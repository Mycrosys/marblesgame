// Global variables to track Score and Turn

let userScore = 1;
let computerScore =1;
let gameTurn =1;

// Wait for the DOM to finish loading before running the game
// Get the button elements and add event listeners to them

document.addEventListener("DOMContentLoaded", function() {
    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type")==="startgame") {
                alert("You clicked to start the Game!");
            }
            else {
                let buttonType = this.getAttribute("button-type");
                alert(`You clicked ${buttonType}`);
            }
        })
    }
})



function runGame() {

}
