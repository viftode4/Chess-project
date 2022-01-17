document.getElementById("animate").onclick = function() { myFunction() };

function myFunction() {
    document.getElementById("bbody").className = "change";
    setTimeout(redirect, 2500);
    typeWriter();
}

function redirect() {
    window.location = "/play";
}
var i = 0;
var txt = '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
var speed = 50;

function typeWriter() {
    if (i < txt.length) {
        document.getElementById("animate").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}