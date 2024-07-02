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
exports.showCalendar = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const types_1 = require("../types");
function showCalendar() {
    return __awaiter(this, void 0, void 0, function* () {
        let rooms = [];
        let bookings = [];
        const readRoomFiles = new Promise((resolve, reject) => {
            const roomsFilePath = path_1.default.join(__dirname, "../data/rooms.json");
            fs_1.default.readFile(roomsFilePath, "utf8", (err, data) => {
                if (err)
                    reject(err);
                rooms = JSON.parse(data);
                resolve(rooms);
            });
        });
        const readBookingFiles = new Promise((resolve, reject) => {
            const bookingsFilePath = path_1.default.join(__dirname, "../data/bookings.json");
            fs_1.default.readFile(bookingsFilePath, "utf8", (err, data) => {
                if (err)
                    reject(err);
                bookings = JSON.parse(data);
                resolve(bookings);
            });
        });
        yield Promise.all([readRoomFiles, readBookingFiles]);
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
                console.log(`${room.id}  ${room.roomType.padEnd(9, " ")}  ${bookingMapUp}`);
                console.log(`${"".padEnd(14, " ")}  ${bookingMapDown}`);
            }
        });
        // cleanRoomAssignmentsSinceADate(bookings, "2024-06-21");
        showUnassignedBookings(bookings);
    });
}
exports.showCalendar = showCalendar;
function getRoomCalendar(roomId, bookings) {
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
function showUnassignedBookings(bookings, roomType = types_1.RoomType.Deluxe) {
    const unassigned = bookings.filter((booking) => booking.roomId === "" && booking.roomType === roomType);
    console.log("Unassigned bookings for room type " + roomType + ":");
    unassigned.forEach((booking) => {
        console.log(`${booking.id} - ${booking.guestName.padEnd(20, " ")} - ${booking.checkInDate} - ${booking.checkOutDate} - ${booking.numberOfGuests}`);
    });
}
function cleanRoomAssignmentsSinceADate(bookings, date) {
    const unassigned = bookings.filter((booking) => booking.checkInDate >= date);
    unassigned.forEach((booking) => {
        // remove roomId from booking
        booking.roomId = "";
    });
    // const extendedBookings = extendBookingsByOneDay(bookings);
    showUnassignedBookings(bookings);
    // write to file
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "../data/bookings-unassignments.json"), JSON.stringify(bookings));
}
function extendBookingsByOneDay(bookings) {
    const extendedBookings = [...bookings];
    extendedBookings.forEach((booking) => {
        if (booking.checkOutDate === "2024-06-30")
            return;
        const checkOutDate = new Date(booking.checkOutDate);
        checkOutDate.setDate(checkOutDate.getDate() + 1);
        booking.checkOutDate = checkOutDate.toISOString().split("T")[0];
    });
    // write to file
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "../data/bookings-extended.json"), JSON.stringify(extendedBookings));
    return extendedBookings;
}
showCalendar();
//# sourceMappingURL=showCalendar.js.map