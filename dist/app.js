"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rooms_1 = __importDefault(require("./routes/rooms"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// rooms endpoint
app.use("/api/v1/rooms", rooms_1.default);
// bookings endpoint
app.use("/api/v1/bookings", bookings_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Rooms endpoint: http://localhost:${PORT}/api/v1/rooms`);
    console.log(`Bookings endpoint: http://localhost:${PORT}/api/v1/bookings`);
});
//# sourceMappingURL=app.js.map