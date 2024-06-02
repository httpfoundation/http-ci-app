import express from "express";
import cors from "cors";
import roomsRouter from "./routes/rooms";
import bookingRouter from "./routes/bookings";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// rooms endpoint
app.use("/api/v1/rooms", roomsRouter);
// bookings endpoint
app.use("/api/v1/bookings", bookingRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Rooms endpoint: http://localhost:${PORT}/api/v1/rooms`);
  console.log(`Bookings endpoint: http://localhost:${PORT}/api/v1/bookings`);
});
