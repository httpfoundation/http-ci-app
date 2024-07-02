"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBookings = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// import fetch from "node-fetch";
const types_1 = require("../types");
// Function to fetch a random guest name
const axios_1 = __importDefault(require("axios"));
const showCalendar_1 = require("./showCalendar");
function getGuestName() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://randomuser.me/api/?results=1&inc=name";
        try {
            const response = yield axios_1.default.get(url);
            const data = response.data;
            const name = data.results[0].name;
            const { first, last } = name;
            return first + " " + last;
        }
        catch (error) {
            //console.error("Error fetching guest name:", error);
            return "John Doe";
        }
    });
}
// Function to generate a random date within June 2024
function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    date.setHours(2, 0, 0, 0);
    return date;
}
// Function to generate a random number of days for the booking (1 to 10 days)
function getRandomDuration(maxDays) {
    return Math.floor(Math.random() * maxDays) + 1;
}
// Function to check if a room is available for the given date range
function getAvailableRoomId(bookings, roomType, checkIn, checkOut) {
    // Filter bookings by room type and cheking and checking out dates
    const filteredBookings = bookings.filter((booking) => booking.roomType === roomType &&
        new Date(booking.checkInDate) <= checkOut &&
        new Date(booking.checkOutDate) >= checkIn);
    // create array of room ids from filtered bookings
    const reservedRoomIds = filteredBookings.map((booking) => booking.roomId);
    // filter rooms by room type
    const roomsInRoomTypes = roomsData.filter((room) => room.roomType === roomType);
    const freeRooms = roomsInRoomTypes.filter((room) => !reservedRoomIds.includes(room.id));
    console.log({
        availableRoomId: freeRooms.length > 0 ? freeRooms[0].id : null,
    });
    return freeRooms.length > 0 ? freeRooms[0].id : null;
}
// Load rooms data
const roomsFilePath = path_1.default.join(__dirname, "./data/rooms.json");
const roomsData = JSON.parse(fs_1.default.readFileSync(roomsFilePath, "utf8"));
// Generate random bookings
function generateBookings() {
    return __awaiter(this, void 0, void 0, function* () {
        const bookings = [];
        const numBookings = 150; // Adjust the number of bookings as needed
        const maxStayingDays = 8;
        for (let i = 0; i < numBookings; i++) {
            const guestName = yield getGuestName();
            let checkInDate;
            let duration;
            let checkOutDate;
            let roomType = types_1.RoomType.Deluxe;
            checkInDate = getRandomDate(new Date("2024-06-01"), new Date("2024-06-30")); // Ensure checkout is within June
            duration = getRandomDuration(Math.min(maxStayingDays, (new Date("2024-06-30").getTime() - checkInDate.getTime()) /
                (1000 * 60 * 60 * 24)));
            checkOutDate = new Date(checkInDate);
            checkOutDate.setDate(checkOutDate.getDate() + duration);
            // generate a random room type
            const randomIndex = Math.floor(Math.random() * Object.keys(types_1.RoomType).length);
            roomType = Object.values(types_1.RoomType)[randomIndex];
            const availableRoomId = getAvailableRoomId(bookings, roomType, checkInDate, checkOutDate);
            if (availableRoomId) {
                const room = roomsData.find((r) => r.id === availableRoomId);
                const booking = {
                    id: `B${String(i + 1).padStart(3, "0")}`,
                    guestName: guestName,
                    checkInDate: checkInDate.toISOString().split("T")[0],
                    checkOutDate: checkOutDate.toISOString().split("T")[0],
                    roomType: roomType,
                    roomId: availableRoomId,
                    numberOfGuests: Math.floor(Math.random() * ((room === null || room === void 0 ? void 0 : room.capacity) || 1)) + 1,
                    specialRequests: Math.random() > 0.8 ? "Extra pillows" : undefined, // 20% chance of a special request
                };
                bookings.push(booking);
            }
            console.log(`Number of succefully generated booking: ${bookings.length} / ${i + 1}`);
        }
        // Write the bookings to bookings.json
        const bookingsFilePath = path_1.default.join(__dirname, "./data/bookings.json");
        fs_1.default.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
        console.log(`Generated ${numBookings} bookings and saved to ${bookingsFilePath}`);
        (0, showCalendar_1.showCalendar)();
    });
}
exports.generateBookings = generateBookings;
// Run the script
generateBookings();
//# sourceMappingURL=generateBookings.js.map