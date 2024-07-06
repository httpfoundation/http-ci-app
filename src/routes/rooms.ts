import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Rooms } from "../types";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "../data/rooms.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).json({ message: "Error reading rooms data file" });
    } else {
      const rooms: Rooms = JSON.parse(data);
      res.status(200).json(rooms);
    }
  });
});

export default router;
