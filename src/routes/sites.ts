import { Router, Request, Response } from "express";
import { getSites } from "../data/getSites";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { sites, error } = await getSites();
  if (error) {
    res.status(500).json({ message: "Error reading sites data file" });
  } else {
    res.status(200).json(sites);
  }
});

export default router;
