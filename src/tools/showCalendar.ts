import fs from "fs";
import path from "path";
import { Room, Rooms, Booking, RoomType, Bookings, GuestName } from "../types";

export async function showCalendar() {
  let rooms: Rooms = [];
  let bookings: Bookings = [];

  const readRoomFiles = new Promise((resolve, reject) => {
    const roomsFilePath = path.join(__dirname, "../data/rooms.json");
    fs.readFile(roomsFilePath, "utf8", (err, data) => {
      if (err) reject(err);
      rooms = JSON.parse(data);
      resolve(rooms);
    });
  });

  const readBookingFiles = new Promise((resolve, reject) => {
    const bookingsFilePath = path.join(__dirname, "../data/bookings.json");
    fs.readFile(bookingsFilePath, "utf8", (err, data) => {
      if (err) reject(err);
      bookings = JSON.parse(data);
      resolve(bookings);
    });
  });

  await Promise.all([readRoomFiles, readBookingFiles]);

  const dayHeaders = new Array(31).fill("").reduce((acc, element, index) => {
    const indexStr = String(index).padStart(4, " ");
    return `${acc}${indexStr} `;
  });
  console.log(`Room ${"Room type".padEnd(10, " ")} ${dayHeaders}`);
  rooms.sort((a, b) => a.roomType.localeCompare(b.roomType));
  rooms.forEach((room) => {
    const roomCalendar = getRoomCalendar(room.id, bookings);

    if (roomCalendar) {
      const bookingMapUp = roomCalendar[0].reduce((acc, bookingId, index) => {
        return `${acc}${bookingId} `;
      }, "");
      const bookingMapDown = roomCalendar[1].reduce((acc, bookingId, index) => {
        return `${acc}${bookingId} `;
      }, "");
      console.log(
        `${room.id}  ${room.roomType.padEnd(9, " ")}  ${bookingMapUp}`
      );
      console.log(`${"".padEnd(14, " ")}  ${bookingMapDown}`);
    }
  });
  // cleanRoomAssignmentsSinceADate(bookings, "2024-06-21");
  showUnassignedBookings(bookings);
}

function getRoomCalendar(roomId: string, bookings: Bookings) {
  const roomCalendar = [new Array(30).fill("----"), new Array(30).fill("----")];
  const bookingsByRoomId = bookings.filter((b) => b.roomId === roomId);

  bookingsByRoomId.forEach((booking) => {
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    for (let d = checkInDate; d <= checkOutDate; d.setDate(d.getDate() + 1)) {
      const index = roomCalendar[0][d.getDate() - 1] === "----" ? 0 : 1;
      roomCalendar[index][d.getDate() - 1] = booking.id;
    }
  });

  return roomCalendar;
}

function showUnassignedBookings(
  bookings: Booking[],
  roomType: RoomType = RoomType.Deluxe
) {
  const unassigned = bookings.filter(
    (booking) => booking.roomId === "" && booking.roomType === roomType
  );
  console.log("Unassigned bookings for room type " + roomType + ":");
  unassigned.forEach((booking) => {
    console.log(
      `${booking.id} - ${booking.guestName.padEnd(20, " ")} - ${
        booking.checkInDate
      } - ${booking.checkOutDate} - ${booking.numberOfGuests}`
    );
  });
}

function cleanRoomAssignmentsSinceADate(bookings: Booking[], date: String) {
  const unassigned = bookings.filter((booking) => booking.checkInDate >= date);

  unassigned.forEach((booking) => {
    // remove roomId from booking
    booking.roomId = "";
  });
  // const extendedBookings = extendBookingsByOneDay(bookings);
  showUnassignedBookings(bookings);

  // write to file
  fs.writeFileSync(
    path.join(__dirname, "../data/bookings-unassignments.json"),
    JSON.stringify(bookings)
  );
}

function extendBookingsByOneDay(bookings: Booking[]) {
  const extendedBookings = [...bookings];
  extendedBookings.forEach((booking) => {
    if (booking.checkOutDate === "2024-06-30") return;
    const checkOutDate = new Date(booking.checkOutDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    booking.checkOutDate = checkOutDate.toISOString().split("T")[0];
  });

  // write to file
  fs.writeFileSync(
    path.join(__dirname, "../data/bookings-extended.json"),
    JSON.stringify(extendedBookings)
  );

  return extendedBookings;
}

showCalendar();
