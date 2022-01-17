export const helper = {
    toAlgebraicNotation (i, j) {
        if(! this.isInBounds(i, j))
            return "a0";
        return String.fromCharCode("a".charCodeAt(0) + j - 1) + (8 - i + 1).toString();
    },
    
    toIndexNotation (code) {
        return [9 - (code.charCodeAt(1) - 48), code.charCodeAt(0) - 96];
    },

    getColor(id) {
        if(document.getElementById(id).firstChild === null) 
            return "NULL";
        return document.getElementById(id).firstChild.classList[1];
    },

    getPiece(id) {
        if(document.getElementById(id).firstChild === null) 
            return "NULL";
        return document.getElementById(id).firstChild.classList[2];
    },

    isInBounds(x, y) {
        if(x < 1 || y < 1) return false;
        if(x > 8 || y > 8) return false;
        return true;
    }
}