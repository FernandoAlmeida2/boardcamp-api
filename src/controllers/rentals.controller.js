import { connection } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId, gameId } = req.query;
  const rentalsList = [];
  let rentals;
  try {
    if (customerId)
      rentals = await connection.query(
        'SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId" WHERE "customerId" = $1;',
        [customerId]
      );
    else if (gameId)
      rentals = await connection.query(
        'SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId" WHERE "gameId" = $1;',
        [gameId]
      );
    else
      rentals = await connection.query(
        'SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON games.id = rentals."gameId" JOIN categories ON categories.id = games."categoryId";'
      );
    rentals.rows.forEach(
      ({
        id,
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
        customerName,
        gameName,
        categoryId,
        categoryName,
      }) =>
        rentalsList.push({
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          customer: { id: customerId, name: customerName },
          game: { id: gameId, name: gameName, categoryId, categoryName },
        })
    );
    res.send(rentalsList);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const gameInfo = await connection.query(
      "SELECT * FROM games WHERE id = $1",
      [gameId]
    );
    const gameRentals = await connection.query(
      'SELECT (id) FROM rentals WHERE "gameId" = $1',
      [gameId]
    );
    if (gameInfo.rows[0].stockTotal === gameRentals.rows.length) {
      return res
        .status(400)
        .send({ message: "Jogo esgotado para aluguel no momento!" });
    }
    const originalPrice = daysRented * gameInfo.rows[0].pricePerDay;
    const rentDate = dayjs().format("YYYY-MM-DD");
    await connection.query(
      'INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);',
      [customerId, gameId, rentDate, daysRented, null, originalPrice, null]
    );
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
