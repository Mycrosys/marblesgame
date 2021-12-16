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
                chooseMarblesAmount();
            }
            else {
                let buttonType = this.getAttribute("button-type");
                alert(`You clicked ${buttonType}`);
            }
        })
    }
})


/**
 * Choose the Amount of Marbles at the start of the game and
 * set starting scores
 */
function chooseMarblesAmount() {
    let difficulty = document.getElementById("mid-box");
    difficulty.innerHTML = `
        <p>Please choose the amount of Marbles each side starts with. More Marbles make for a longer
        game.</p>
        <div id="select-box">
            <select id="value-select">
                <option value="5">5</option>
                <option value="10" selected="selected">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
            </select>
        </div>
        <button data-type="marblesamount" class="button">Continue</button>
    `;

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type")==="marblesamount") {
                let choosenMarbles = document.getElementById("value-select");
                userScore = parseInt(choosenMarbles.value);
                computerScore = parseInt(choosenMarbles.value);
                console.log(computerScore);
                console.log(userScore);
                alert(`Continue to the game!`);
            }
            else {
                let buttonType = this.getAttribute("button-type");
                alert(`You clicked ${buttonType}`);
            }
        })
    }
}



function runGame() {

}
