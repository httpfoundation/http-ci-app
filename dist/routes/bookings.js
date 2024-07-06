"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    const filePath = path_1.default.join(__dirname, "../data/bookings.json");
    console.log({ filePath });
    fs_1.default.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ message: "Error reading rooms data file" });
        }
        else {
            const bookings = JSON.parse(data);
            res.status(200).json(bookings);
        }
    });
});
exports.default = router;
//# sourceMappingURL=bookings.js.map