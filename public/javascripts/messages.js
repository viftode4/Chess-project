// @ts-check

(function(exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null,
    };

    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
        type: "GAME-ABORTED",
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
     * Server to client: choose target word
     */
    exports.O_INIT = { type: "INITIAL-BOARD" };
    exports.S_INIT = JSON.stringify(exports.O_INIT);

    /*
     * Server to client: set as player A
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
        type: exports.T_PLAYER_TYPE,
        data: "WHITE",
    };
    exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

    /*
     * Server to client: set as player B
     */
    exports.O_PLAYER_B = {
        type: exports.T_PLAYER_TYPE,
        data: "BLACK",
    };
    exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

    /*
     * Player A to server OR server to Player B: this is the target word
     */
    exports.T_BOARD_STATE = "SET-BOARD-STATE";
    exports.O_BOARD_STATE = {
        type: exports.T_BOARD_STATE,
        data: null,
    };
    //exports.S_TARGET_WORD does not exist, as we always need to fill the data property

    /*
     * Player B to server OR server to Player A: guessed character
     */
    exports.T_MAKE_A_MOVE = "MAKE-A-MOVE";
    exports.O_MAKE_A_MOVE = {
        type: exports.T_MAKE_A_MOVE,
        data: null,
    };
    //exports.S_MAKE_A_GUESS does not exist, as data needs to be set

    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null,
    };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);
//if exports is undefined, we are on the client; else the server