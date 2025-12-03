import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";   
import jobsRouter from "./routes/jobs.js";  
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);           
app.use("/api/jobs", jobsRouter);

app.get("/", (req, res) => {
  res.send("JobFlow API running");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
