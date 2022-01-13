const express = require("express");
const http = require("http");
const websocket = require("ws")

const indexRouter = require("./routes/index");

//const Game = require("./game");

if (process.argv.length < 3) {
    console.log("Error: expected a port as argument (eg. 'node app.js 3000').");
    process.exit(1);
}

const port = process.argv[2];
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

const server = http.createServer(app).listen(port);
const wss = new websocket.Server({ server });