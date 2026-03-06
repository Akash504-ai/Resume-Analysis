import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import planRouter from "./routes/plan.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

/* using all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/plans", planRouter);

export default app;