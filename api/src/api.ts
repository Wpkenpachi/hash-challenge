import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import "../database/Connection";

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

// Routes
import routes from "./routes";

const api = express();
api.use(bodyParser.json());
api.use(cors());

api.use("/api", routes)

api.listen(process.env.PORT, () => {
    console.log('Api running at', process.env.PORT);
});