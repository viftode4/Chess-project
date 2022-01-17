import { boardHandler } from "./boardHandler.js";
import { pieceHandler } from "./pieceHandler.js";

var selectedPiece = null;

export const eventHandler = {
    click (square) {
        if(!square.classList.contains("square"))
            return;

        if(selectedPiece !== null && selectedPiece != square.id) {
            if(square.classList.contains("highlight")) 
                boardHandler.movePiece(selectedPiece, square.id);
            
            selectedPiece = null;
            boardHandler.clearAllHighlights();
        } 
        
        if(square.firstChild !== null && square.firstChild.classList.contains(boardHandler.getTurn())){
            selectedPiece = square.id;
            boardHandler.highLight(pieceHandler.getPieceMoves(selectedPiece));
        }
    }
}