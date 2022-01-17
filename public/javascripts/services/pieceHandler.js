import { helper } from "./helper.js";
import { boardHandler } from "./boardHandler.js";

export const pieceHandler = {
    getPieceMoves (id) {
        var arr = [id];

        var piece = helper.getPiece(id);
        var color = helper.getColor(id);

        switch(piece){
            case "pawn":
                arr = arr.concat(this.getPawnMoves(id, (color === "white") ? -1 : 1));
                break;
            case "knight":
                arr = arr.concat(this.getKnightMoves(id));
                break;
            case "bishop":
                arr = arr.concat(this.getBishopMoves(id));
                break;
            case "rook":
                arr = arr.concat(this.getRookMoves(id));
                break;
            case "queen":
                arr = arr.concat(this.getBishopMoves(id));
                arr = arr.concat(this.getRookMoves(id));
                break;
            case "king":
                arr = arr.concat(this.getKingMoves(id));
                break;
        }

        return arr;
    },

    getPawnMoves (code, direction) {
        var [x, y] = helper.toIndexNotation(code);

        var moves = [];

        if(helper.isInBounds(x+direction, y) && this.isSquareFree(x+direction, y)) {
            moves.push(helper.toAlgebraicNotation(x+direction, y));

            if((x == 2 || x == 7) && this.isSquareFree(x+direction*2, y)) 
                moves.push(helper.toAlgebraicNotation(x+direction*2, y));
        }

        //attacking
        [-1, 1].forEach(dir => {
            if(helper.isInBounds(x+direction, y+dir) 
                && !this.isSquareFree(x+direction, y+dir) 
                    && helper.getColor(helper.toAlgebraicNotation(x+direction, y+dir)) !== helper.getColor(code)) 
                        moves.push(helper.toAlgebraicNotation(x+direction, y+dir));
        });;

        return moves;
    },

    getKnightMoves (code) {
        let dirX = [-2, -2, -1, -1, 1, 1, 2, 2];
        let dirY = [-1, 1, -2, 2, -2, 2, -1, 1];

        var moves = [];

        var [x, y] = helper.toIndexNotation(code);

        for(var i = 0; i < 8; ++ i){
            let u = x + dirX[i];
            let v = y + dirY[i];

            if(helper.isInBounds(u, v) 
                    && (this.isSquareFree(u, v) || helper.getColor(code) !== helper.getColor(helper.toAlgebraicNotation(u, v))))
                moves.push(helper.toAlgebraicNotation(u, v));
        }

        return moves;
    },

    getBishopMoves (code) {
        let dX = [-1, 1, -1, 1];
        let dY = [-1, -1, 1, 1];

        var [x, y] = helper.toIndexNotation(code);

        var moves = [];

        for(var i = 0; i < 4; ++i) {
            let u = x + dX[i];
            let v = y + dY[i];

            while(helper.isInBounds(u, v) && this.isSquareFree(u, v)) {
                moves.push(helper.toAlgebraicNotation(u, v));

                u += dX[i];
                v += dY[i];
            }

            if(helper.isInBounds(u, v) && helper.getColor(code) !== helper.getColor(helper.toAlgebraicNotation(u, v))) {
                moves.push(helper.toAlgebraicNotation(u, v));
            }
        }

        var [x, y] = helper.toIndexNotation(code);

        return moves;
    },

    getRookMoves (code) {
        let dX = [-1, 1, 0, 0];
        let dY = [0, 0, -1, 1];

        var [x, y] = helper.toIndexNotation(code);

        var moves = [];

        for(var i = 0; i < 4; ++i) {
            let u = x + dX[i];
            let v = y + dY[i];

            while(helper.isInBounds(u, v) && this.isSquareFree(u, v)) {
                moves.push(helper.toAlgebraicNotation(u, v));

                u += dX[i];
                v += dY[i];
            }

            if(helper.isInBounds(u, v) && helper.getColor(code) !== helper.getColor(helper.toAlgebraicNotation(u, v))) {
                moves.push(helper.toAlgebraicNotation(u, v));
            }
        }

        var [x, y] = helper.toIndexNotation(code);

        return moves;
    },

    getKingMoves (code) {
        let dirX = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
        let dirY = [-1, 0, 1, -1, 0, 1, -1, 0, 1];

        var moves = [];

        var [x, y] = helper.toIndexNotation(code);

        for(var i = 0; i < 9; ++ i){
            let u = x + dirX[i];
            let v = y + dirY[i];

            if(helper.isInBounds(u, v) 
                    && (this.isSquareFree(u, v) || helper.getColor(code) !== helper.getColor(helper.toAlgebraicNotation(u, v))))
                moves.push(helper.toAlgebraicNotation(u, v));
        }

        return moves;
    },

    isSquareFree (x, y) {
        var id = helper.toAlgebraicNotation(x, y);
        return document.getElementById(id).firstChild === null;
    }
}