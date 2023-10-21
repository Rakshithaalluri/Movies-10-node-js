const express = require("express");
const path = require("path");

const dbPath = path.join(__dirname, "moviesData.db");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(2375, () => {
      console.log("Server is running at http://localhost:2375");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const app = express();

app.use(express.json());

app.get("/movies/", async (request, response) => {
  const getMovieNames = `
    SELECT 
       movie_name AS movieName
    FROM 
       movie`;

  const movieNamesQuery = await db.all(getMovieNames);
  response.send(movieNamesQuery);
});

//api2

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO 
    movie
    (director_id,movie_name , lead_actor)
    VALUES
    ( ${directorId},
        '${movieName}',
        '${leadActor}'
    )`;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

//API3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieDetails = `
    SELECT 
    movie_id AS movieId,
    director_id AS directorId,
    movie_name AS movieName,
    lead_actor AS leadActor
    FROM 
    movie 
    WHERE 
    movie_id = ${movieId}`;

  const dbMovieResponse = await db.get(getMovieDetails);
  response.send(dbMovieResponse);
});

///API 4

app.put("/movies/movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `
    UPDATE movie 
    SET 
    director_id = ${directorId}, 
    movie_name = '${movieName}',
    lead_actor = '${leadActor}'
    WHERE
     movie_id = ${movieId};`;

  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    DELETE FROM 
    movie 
    WHERE movie_id = ${movieId};`;

  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//api6

app.get("/directors/", async (request, response) => {
  const getDirectorNames = `
    SELECT 
       director_id AS directorId,
       director_name AS directorName
    FROM 
       director`;

  const directorNamesQuery = await db.all(getDirectorNames);
  response.send(directorNamesQuery);
});

//api7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorNames = `
    SELECT 
       movie_name AS movieName
    FROM 
       movie
    WHERE 
    director_id = ${directorId}`;

  const directorNamesQuery = await db.all(getDirectorNames);
  response.send(directorNamesQuery);
});

module.exports = app;
