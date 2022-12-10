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
    rentals.rows.forEach((rental) =>
      rentalsList.push({
        id: rental.id,
        customerId: rental.customerId,
        gameId: rental.gameId,
        rentDate: rental.rentDate,
        daysRented: rental.daysRented,
        returnDate: rental.returnDate,
        originalPrice: rental.originalPrice,
        delayFee: rental.delayFee,
        customer: { id: customerId, name: rental.customerName },
        game: {
          id: gameId,
          name: rental.gameName,
          categoryId: rental.categoryId,
          categoryName: rental.categoryName,
        },
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
      'SELECT (id) FROM rentals WHERE "gameId" = $1 AND "returnDate" = $2;',
      [gameId, null]
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

export async function postReturnRental(req, res) {
  const { id } = req.params;
  try {
    const rentalExists = await connection.query(
      "SELECT * FROM rentals WHERE id = $1;",
      [id]
    );
    if (rentalExists.rows.length === 0) {
      return res.status(404).send({ message: "Este aluguel não existe!" });
    }
    if (rentalExists.rows[0].returnDate !== null) {
      return res.status(400).send({ message: "O aluguel já foi finalizado!" });
    }
    const returnDate = dayjs().format("YYYY-MM-DD");
    const delayedDays = dayjs(returnDate).diff(
      dayjs(rentalExists.rows[0].rentDate),
      "day"
    );
    let delayFee;
    if (delayedDays <= 0) {
      delayFee = 0;
    } else {
      delayFee =
        (delayedDays * rentalExists.rows[0].originalPrice) /
        rentalExists.rows[0].daysRented;
    }
    await connection.query(
      'UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;',
      [returnDate, delayFee, id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const rentalExists = await connection.query(
      "SELECT * FROM rentals WHERE id = $1;",
      [id]
    );
    if (rentalExists.rows.length === 0) {
      return res.status(404).send({ message: "Este aluguel não existe!" });
    }
    if (rentalExists.rows[0].returnDate !== null) {
      return res.status(400).send({ message: "O aluguel já foi finalizado!" });
    }
    await connection.query("DELETE FROM rentals WHERE id = $1;", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
