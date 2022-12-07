import { connection } from "../database/database.js";

export async function getGames(req, res){
    try{
        const games = await connection.query("SELECT * from games;");
        res.send(games.rows);
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
}