import express from "express";
import cors from "cors";
import gamesRouter from "./routes/games.routes.js";
import categoriesRouter from "./routes/categories.routes.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(gamesRouter);
server.use(categoriesRouter);

const port = process.env.PORT || 4000;

server.listen(port, () => {
    console.log(`Server running in port: ${port}`);
});