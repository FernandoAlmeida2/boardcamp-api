import express from "express";
import cors from "cors";
import gamesRouter from "./routes/games.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import customersRouter from "./routes/customers.routes.js";
import rentalsRouter from "./routes/rentals.routes.js";

const server = express();
server.use(cors());
server.use(express.json());
server.use(gamesRouter);
server.use(categoriesRouter);
server.use(customersRouter);
server.use(rentalsRouter);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server running in port: ${port}`);
});
