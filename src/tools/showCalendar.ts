import fs from "fs";
import path from "path";
// import fetch from "node-fetch";
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
      const bookingMap = roomCalendar.reduce((acc, bookingId, index) => {
        return `${acc}${bookingId} `;
      }, "");
      console.log(`${room.id}  ${room.roomType.padEnd(9, " ")}  ${bookingMap}`);
    }
  });
}

function getRoomCalendar(roomId: string, bookings: Bookings) {
  const roomCalendar = new Array(30).fill("----");
  const bookingsByRoomId = bookings.filter((b) => b.roomId === roomId);

  bookingsByRoomId.forEach((booking) => {
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    for (let d = checkInDate; d <= checkOutDate; d.setDate(d.getDate() + 1)) {
      roomCalendar[d.getDate() - 1] = booking.id;
    }
  });

  return roomCalendar;
}

// Run the script
showCalendar();
