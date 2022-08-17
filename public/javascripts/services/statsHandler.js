var lastClick = (new Date()).getTime();

export const statsHandler = {
    addTime (isWhite) {
        var turn = "White";
        if(!isWhite) 
            turn = "Black";
        
        var tag = document.createElement("p");
        
        tag.textContent = turn + " took " + Math.floor(((new Date()).getTime() - lastClick) / 1000 + 1).toString() + " seconds to move";

        lastClick = (new Date()).getTime();

        (document.getElementsByClassName("stats")[0]).appendChild(tag);
    },

    addCheck(turn) {
        var tag = document.createElement("p");

        tag.textContent = turn + " is in check";

        (document.getElementsByClassName("stats")[0]).appendChild(tag);
    }
}