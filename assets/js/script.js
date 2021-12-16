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
 * Choose the Amount of Marbles at the start of the game
 */
function chooseMarblesAmount() {
    let difficulty = document.getElementById("mid-box");
    difficulty.innerHTML = `
        <p>Please choose the amount of Marbles each side starts with. More Marbles make for a longer
        game.</p>
        <div id="select-box">
            <select>
                <option value="0">10</option>
                <option value="1">15</option>
                <option value="2">20</option>
                <option value="3">25</option>
                <option value="4">30</option>
            </select>
        </div>
        <button data-type="marblesamount" class="button">Continue</button>
    `;
}

function runGame() {

}
