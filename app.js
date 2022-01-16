// @ts-check
const express = require("express");
const http = require("http");
const websocket = require("ws")

const indexRouter = require("./routes/index");

const messages = require("./public/javascripts/messages");
const gameStatus = require("./stats");
const Game = require("./game");

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

const websockets = {};

setInterval(function() {
    for (let i in websockets) {
        if (Object.prototype.hasOwnProperty.call(websockets, i)) {
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if (gameObj.finalStatus != null) {
                delete websockets[i];
            }
        }
    }
}, 50000);

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0; // for each websocket we give it a unique id

wss.on("connection", function connection(ws) {
    /*
     * two-player game: every two players are added to the same game
     */
    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websockets[con["id"]] = currentGame;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
    );

    /*
     * inform the client about its assigned player type
     */
    con.send(playerType == "WHITE" ? messages.S_PLAYER_WHITE : messages.S_PLAYER_BLACK);

    /*
     * client B receives the target word (if already available)
     */
    if (playerType == "BLACK" && currentGame.getBoardState() != null) {
        let msg = messages.O_BOARD_STATE;
        msg.data = currentGame.getBoardState();
        con.send(JSON.stringify(msg));
    }

    /*
     * once we have two players, there is no way back;
     * a new game object is created;
     * if a player now leaves, the game is aborted (player is not preplaced)
     */
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

    /*
     * message coming in from a player:
     *  1. determine the game object
     *  2. determine the opposing player OP
     *  3. send the message to OP
     */
    con.on("message", function incoming(message) {
        const oMsg = JSON.parse(message.toString());

        // gameObj holds a game object
        const gameObj = websockets[con["id"]];
        const isPlayerW = gameObj.WPlayer == con ? true : false;

        if (isPlayerW) {
            /*
             *  White Player can state who won/lost
             */
            if (oMsg.type == messages.T_GAME_WON_BY) {
                gameObj.setStatus(oMsg.data);
                //game was won by somebody, update statistics
                gameStatus.gamesCompleted++;
            }

        } else {

            /*
             *  Black Player can state who won/lost
             */
            if (oMsg.type == messages.T_GAME_WON_BY) {
                gameObj.setStatus(oMsg.data);
                //game was won by somebody, update statistics
                gameStatus.gamesCompleted++;
            }
        }
    });

    con.on("close", function(code) {
        /*
         * code 1001 means almost always closing initiated by the client;
         * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
         */
        console.log(`${con["id"]} disconnected ...`);

        if (code == 1001) {
            /*
             * if possible, abort the game; if not, the game is already completed
             */
            const gameObj = websockets[con["id"]];

            if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
                gameObj.setStatus("ABORTED");
                gameStatus.gamesAborted++;

                /*
                 * determine whose connection remains open;
                 * close it
                 */
                try {
                    gameObj.WPlayer.close();
                    gameObj.WPlayer = null;
                } catch (e) {
                    console.log("White Player closing: " + e);
                }

                try {
                    gameObj.BPlayer.close();
                    gameObj.BPlayer = null;
                } catch (e) {
                    console.log("Black Player closing: " + e);
                }
            }
        }
    });
});