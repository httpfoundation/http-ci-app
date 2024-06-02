import fs from "fs";
import path from "path";
// import fetch from "node-fetch";
import { Room, Rooms, Booking, RoomType, Bookings, GuestName } from "../types";

// Function to fetch a random guest name
import axios from "axios";
import { showCalendar } from "./showCalendar";

async function getGuestName() {
  const url = "https://randomuser.me/api/?results=1&inc=name";
  try {
    const response = await axios.get(url);
    const data = response.data;
    const name = data.results[0].name;
    const { first, last } = name;
    return first + " " + last;
  } catch (error) {
    //console.error("Error fetching guest name:", error);
    return "John Doe";
  }
}

// Function to generate a random date within June 2024
function getRandomDate(start: Date, end: Date): Date {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  date.setHours(2, 0, 0, 0);
  return date;
}

// Function to generate a random number of days for the booking (1 to 10 days)
function getRandomDuration(maxDays: number): number {
  return Math.floor(Math.random() * maxDays) + 1;
}

// Function to check if a room is available for the given date range
function getAvailableRoomId(
  bookings: Bookings,
  roomType: RoomType,
  checkIn: Date,
  checkOut: Date
): string | null {
  // Filter bookings by room type and cheking and checking out dates
  const filteredBookings = bookings.filter(
    (booking) =>
      booking.roomType === roomType &&
      new Date(booking.checkInDate) <= checkOut &&
      new Date(booking.checkOutDate) >= checkIn
  );
  // create array of room ids from filtered bookings
  const reservedRoomIds = filteredBookings.map((booking) => booking.roomId);
  // filter rooms by room type
  const roomsInRoomTypes = roomsData.filter(
    (room) => room.roomType === roomType
  );

  const freeRooms = roomsInRoomTypes.filter(
    (room) => !reservedRoomIds.includes(room.id)
  );

  console.log({
    availableRoomId: freeRooms.length > 0 ? freeRooms[0].id : null,
  });

  return freeRooms.length > 0 ? freeRooms[0].id : null;
}

// Load rooms data
const roomsFilePath = path.join(__dirname, "./data/rooms.json");
const roomsData: Rooms = JSON.parse(fs.readFileSync(roomsFilePath, "utf8"));

// Generate random bookings
export async function generateBookings() {
  const bookings: Bookings = [];
  const numBookings = 150; // Adjust the number of bookings as needed
  const maxStayingDays = 8;

  for (let i = 0; i < numBookings; i++) {
    const guestName = await getGuestName();
    let checkInDate: Date;
    let duration: number;
    let checkOutDate: Date;
    let roomType = RoomType.Deluxe;
    checkInDate = getRandomDate(new Date("2024-06-01"), new Date("2024-06-30")); // Ensure checkout is within June
    duration = getRandomDuration(
      Math.min(
        maxStayingDays,
        (new Date("2024-06-30").getTime() - checkInDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );
    checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + duration);
    // generate a random room type
    const randomIndex = Math.floor(
      Math.random() * Object.keys(RoomType).length
    );
    roomType = Object.values(RoomType)[randomIndex];
    const availableRoomId = getAvailableRoomId(
      bookings,
      roomType,
      checkInDate,
      checkOutDate
    );
    if (availableRoomId) {
      const room = roomsData.find((r) => r.id === availableRoomId);
      const booking: Booking = {
        id: `B${String(i + 1).padStart(3, "0")}`,
        guestName: guestName,
        checkInDate: checkInDate.toISOString().split("T")[0],
        checkOutDate: checkOutDate.toISOString().split("T")[0],
        roomType: roomType,
        roomId: availableRoomId,
        numberOfGuests: Math.floor(Math.random() * (room?.capacity || 1)) + 1,
        specialRequests: Math.random() > 0.8 ? "Extra pillows" : undefined, // 20% chance of a special request
      };
      bookings.push(booking);
    }
    console.log(
      `Number of succefully generated booking: ${bookings.length} / ${i + 1}`
    );
  }

  // Write the bookings to bookings.json
  const bookingsFilePath = path.join(__dirname, "./data/bookings.json");
  fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
  console.log(
    `Generated ${numBookings} bookings and saved to ${bookingsFilePath}`
  );
  showCalendar();
}

// Run the script
generateBookings();
