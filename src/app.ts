import express from "express";
import cors from "cors";
import sitesRouter from "./routes/sites";
import statusRouter from "./routes/status";
import webhookRouter from "./routes/webhook";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// status endpoint
app.use("/api/v1/status", statusRouter);
// sites endpoint
app.use("/api/v1/sites", sitesRouter);
// webhook endpoint
app.use("/api/v1/webhook", webhookRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Sites endpoint: http://localhost:${PORT}/api/v1/sites`);
  console.log(
    `Sites endpoint: http://localhost:${PORT}/api/v1/webhook?token=test-token`
  );
});
