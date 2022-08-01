import {boardHandler} from "./services/boardHandler.js";
import {eventHandler} from "./services/eventHandler.js";

boardHandler.renderBoard();
boardHandler.setFENgame("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w"); // starting position

document.addEventListener('click', function( event ) {
    eventHandler.click( 
        (event.target.classList.contains("square")) ? event.target : event.target.parentElement);

    if(boardHandler.isInCheckmate("white"))
        alert("black won");
    if(boardHandler.isInCheckmate("black"))
        alert("white won");
});
