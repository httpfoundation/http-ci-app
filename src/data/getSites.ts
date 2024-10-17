import path from "path";
import fs from "fs/promises";
import { Sites } from "../types";

export const getSites = async () => {
  let error: any = null;
  let sites: Sites = [];
  const filePath = path.join(__dirname, "../data/sites.json");
  try {
    const data = await fs.readFile(filePath, "utf8");
    sites = JSON.parse(data);
  } catch (err) {
    error = err;
  }
  return { sites, error };
};
