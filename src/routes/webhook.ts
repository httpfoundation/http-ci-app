import { exec } from "child_process";
import { Router, Request, Response } from "express";
import path from "path";
import { getSites } from "../data/getSites";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { sites, error } = await getSites();
  if (error)
    return res.status(500).json({ message: "Error reading sites data file" });
  const queryToken = req.query.token.toString();
  const site = sites.find((site) => site.token === queryToken);
  if (!site) return res.status(404).send("Site not found");

  const dockerComposeDir = path.resolve(site.path);
  exec(
    `cd ${dockerComposeDir} && docker-compose up -d --pull always`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).send("Failed to execute docker-compose");
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      const msg = `Docker Compose of ${site.name} executed successfully`;
      res
        .status(200)
        .send(`Docker Compose of ${site.name} executed successfully`);
    }
  );
});

export default router;
