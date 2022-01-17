import { helper } from "./helper.js";
import { pieceHandler } from "./pieceHandler.js";
import {pieceCode} from "../config/pieceCode.js"
import {pieceImage} from "../config/pieceImage.js"
import { codePiece } from "../config/codePiece.js";

var board = new Array(9);
var turn = "white";

export const boardHandler = {
    renderBoard() {
        var boardElem = document.getElementById("board");

        for(var i = 1; i <= 8; ++i) {
            board[i] = new Array(9);
            var row = document.createElement("div");

            for(var j = 1; j <= 8; ++j) {
                board[i][j] = document.createElement("div");
                board[i][j].className = "square";
                board[i][j].id = helper.toAlgebraicNotation(j, i);

                if(i%2 == j%2) 
                    board[i][j].classList.add("black");
                else 
                    board[i][j].classList.add("white");


                row.appendChild(board[i][j]);
            }
            boardElem.appendChild(row);      
        }
    },

    movePiece(from, to) {
        this.removePiece(to);

        document.getElementById(to).appendChild(document.getElementById(from).firstChild);

        turn = (turn === 'white') ? 'black':'white';

        //special cases
        if(helper.getPiece(to) === "pawn" && (helper.toIndexNotation(to)[0] == 1 || helper.toIndexNotation(to)[0] == 8)) {
            let [x, y] = helper.toIndexNotation(to);

            let queen = 'q';

            if(helper.getColor(to))
                queen = 'Q';
            this.removePiece(to);

            this.addPiece(x, y, queen);
        }
    },

    addPiece(x, y, ch) {
        var piece = document.createElement("img");

        piece.classList.add("square-piece");
        piece.src = pieceImage[pieceCode[ch]];
        
        if(ch.charCodeAt(0) < 97)
            piece.classList.add("white");
        else 
            piece.classList.add("black");

        piece.classList.add((pieceCode[ch].split("-"))[0]);

        board[y][x].appendChild(piece);
    },

    removePiece(id) {
        document.getElementById(id).innerHTML = "";
    },

    setFENgame(FEN) {
        for(var i = 1; i <= 8; ++i) 
            for(var j = 1; j<=8; ++j)
                board[i][j].innerHTML = "";
    
        const rows = FEN.split(/\/| /);

        for(var i = 0; i < 8; ++i) { //every row
            var col = 1;

            for(var j = 0; j<rows[i].length; ++j) {

                if(rows[i].charCodeAt(j) >= 48 && rows[i].charCodeAt(j) <= 57)  // the character is a digit
                    col += rows[i].charCodeAt(j) - 49;
                else
                    this.addPiece(i + 1,col + j, rows[i].charAt(j)); 
            }
        }

        if(rows[8] === 'w')
            turn = "white";
        else
            turn = "black";
    },

    highLight(arr, piece) {
        arr.forEach(id => {
            if(document.getElementById(id) !== null && this.legalMove(piece, id))
                document.getElementById(id).classList.add("highlight");
        });
    },

    legalMove(from, to) { // check whether this move would result in a check
        if(from === to)
            return true;

        var ans;
        var foo = this.getFENcode();

        this.movePiece(from, to);

        ans = !this.isInCheck(helper.getColor(to));

        this.setFENgame(foo);

        return ans;
    },

    getFENcode() {
        var FEN = "";
        for(var i = 1; i <= 8; ++i) {
            for(var j = 1; j <= 8; ++j){
                var cnt=0;
                while(helper.isInBounds(i, j) && pieceHandler.isSquareFree(i, j)) {
                    ++cnt;
                    ++j;
                }
                if(cnt > 0) {
                    FEN += cnt.toString();
                }
                if(j > 8) break;
                var str = helper.getPiece(board[j][i].id);
                str +="-" + helper.getColor(board[j][i].id);

                FEN += codePiece[str];
            }
            if(i != 8)FEN += '/';
        }

        FEN += " " + turn.charAt(0);
        return FEN;
    },

    clearAllHighlights() {
        for(var i = 1; i <= 8; ++i) 
            for(var j = 1; j <= 8; ++j)
                board[i][j].classList.remove("highlight");
    },

    isAttacked(id, color) {
        let attacked = [];

        for(var i = 1; i <= 8; ++i) 
            for(var j = 1; j <= 8; ++j){
                if(!pieceHandler.isSquareFree(j, i) && helper.getColor(board[i][j].id) === color)
                    attacked = attacked.concat(pieceHandler.getPieceMoves(board[i][j].id));
            }

        return attacked.includes(id);
    },

    isInCheck(color) {
        let other_color = (color === "white") ? "black":"white";

        for(var i = 1; i <= 8; ++i) 
            for(var j = 1; j <= 8; ++j)
                if(!pieceHandler.isSquareFree(j, i) && color === helper.getColor(board[i][j].id) && helper.getPiece(board[i][j].id) === "king")
                    return this.isAttacked(board[i][j].id, other_color);
    },

    isInCheckmate(color) {
        let other_color = (color === "white") ? "black":"white";

        var ans = true;

        for(var i = 1; i <= 8; ++i) 
            for(var j = 1; j <= 8; ++j)
                if(!pieceHandler.isSquareFree(j, i) && color === helper.getColor(board[i][j].id)) {
                    var moves = pieceHandler.getPieceMoves(board[i][j].id);

                    moves.forEach(element => {
                        if(document.getElementById(element) !== null && this.legalMove(board[i][j].id, element) && board[i][j].id != element)
                            ans = false;
                    });
                }
        return ans;
    },

    Win (color) {
        alert(color.toString() + "won!!!");
    },

    getTurn() {
        return turn;
    }
}