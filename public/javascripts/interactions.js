/* eslint-disable no-undef */
//@ts-check

const clickSound = new Audio("../data/click.wav");

/**
 * Game state object
 * @param {*} visibleWordBoard
 * @param {*} socket
 */
function GameState(visibleWordBoard, socket) {
    this.playerType = null;
    this.boardState = null;
    this.socket = socket;
}

GameState.prototype.getPlayerType = function() {
    return this.playerType;
};

GameState.prototype.setPlayerType = function(p) {
    this.playerType = p;
};

//TO DO
/**
 * Check if anyone one won.
 * @returns {string|null} player who whon or null if there is no winner yet
 */
GameState.prototype.whoWon = function() {
    //too many wrong guesses? Player A (who set the word) won
    //TO DO
    return null; //nobody won yet
};

GameState.prototype.updateGame = function(Move) {
    return;
    // const res = this.alphabet.getLetterInWordIndices(
    //     clickedLetter,
    //     this.targetWord
    // );

    // //wrong guess
    // if (res.length == 0) {
    //     this.incrWrongGuess();
    // } else {
    //     this.revealLetters(clickedLetter, res);
    // }

    // this.alphabet.makeLetterUnAvailable(clickedLetter);
    // this.visibleWordBoard.setWord(this.visibleWordArray);

    // const outgoingMsg = Messages.O_MAKE_A_GUESS;
    // outgoingMsg.data = clickedLetter;
    // this.socket.send(JSON.stringify(outgoingMsg));

    // //is the game complete?
    // const winner = this.whoWon();

    // if (winner != null) {
    //     this.revealAll();

    //     /* disable further clicks by cloning each alphabet
    //      * letter and not adding an event listener; then
    //      * replace the original node through some DOM logic
    //      */
    //     const elements = document.querySelectorAll(".letter");
    //     Array.from(elements).forEach(function(el) {
    //         // @ts-ignore
    //         el.style.pointerEvents = "none";
    //     });

    //     let alertString;
    //     if (winner == this.playerType) {
    //         alertString = Status["gameWon"];
    //     } else {
    //         alertString = Status["gameLost"];
    //     }
    //     alertString += Status["playAgain"];
    //     this.statusBar.setStatus(alertString);

    //     //player B sends final message
    //     if (this.playerType == "B") {
    //         let finalMsg = Messages.O_GAME_WON_BY;
    //         finalMsg.data = winner;
    //         this.socket.send(JSON.stringify(finalMsg));
    //     }
    //     this.socket.close();
    // }
};
//TO DO
// function Board(gs) {
//     //only initialize for player that should actually be able to use the board
//     this.initialize = function() {
//         const elements = document.querySelectorAll(".letter");
//         Array.from(elements).forEach(function(el) {
//             el.addEventListener("click", function singleClick(e) {
//                 const clickedLetter = e.target["id"];
//                 clickSound.play();

//                 gs.updateGame(clickedLetter);

//                 /*
//                  * every letter can only be clicked once;
//                  * here we remove the event listener when a click happened
//                  */
//                 el.removeEventListener("click", singleClick, false);
//             });
//         });
//     };
// }

/**
 * Disable the alphabet buttons.
 */
// function disableBoard() {
//     const alphabet = document.getElementById("alphabet");
//     const letterDivs = alphabet.getElementsByTagName("div");
//     for (let i = 0; i < letterDivs.length; i++) {
//         letterDivs.item(i).className += " alphabetDisabled";
//     }
// }

//set everything up, including the WebSocket
(function setup() {
    const socket = new WebSocket(Setup.WEB_SOCKET_URL);

    /*
     * initialize all UI elements of the game:
     * - visible word board (i.e. place where the hidden/unhidden word is shown)
     * - status bar
     * - alphabet board
     *
     * the GameState object coordinates everything
     */
    //no object, just a function
    // @ts-ignore
    //createBalloons();
    // const sb = new StatusBar();
    const gs = new GameState(vw, socket);

    socket.onmessage = function(event) {
        let incomingMsg = JSON.parse(event.data);

        //set player type
        if (incomingMsg.type == Messages.T_PLAYER_TYPE) {
            gs.setPlayerType(incomingMsg.data); //should be "WHITE" or "BLACK"

            //if player type is WHITE, (2) sent it to the server
            if (gs.getPlayerType() == "WHITE") {
                // sb.setStatus(Status["player1Intro"]);
                // initialize the board, now that we have the word
                let outgoingMsg = Messages.O_BOARD_STATE;
                outgoingMsg.data = "HELLOW";
                socket.send(JSON.stringify(outgoingMsg));
            } else {
                // sb.setStatus(Status["playerWait"]);
            }
        }

        //Player A: wait for Move and update the board ...
        if (
            incomingMsg.type == Messages.T_MAKE_A_MOVE &&
            gs.getPlayerType() == "WHITE"
        ) {
            // sb.setStatus(Status["player2Moved"] + incomingMsg.data);
            gs.updateGame(incomingMsg.data);
        }
        if (
            incomingMsg.type == Messages.T_MAKE_A_MOVE &&
            gs.getPlayerType() == "BLACK"
        ) {
            // sb.setStatus(Status["player1Moved"] + incomingMsg.data);
            gs.updateGame(incomingMsg.data);
        }
    };

    socket.onopen = function() {
        socket.send("{}");
    };

    //server sends a close event only if the game was aborted from some side
    // socket.onclose = function() {
    //     if (gs.whoWon() == null) {
    //         sb.setStatus(Status["aborted"]);
    //     }
    // };

    socket.onerror = function() {};
})(); //execute immediately