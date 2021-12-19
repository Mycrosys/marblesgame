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
    let mainContent = document.getElementById("mid-box");
    mainContent.innerHTML = `
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
                runGame();
            }
            else {
                let buttonType = this.getAttribute("button-type");
                alert(`You clicked ${buttonType}`);
            }
        })
    }
}

function runGame() {
    
    // Make the 2 divs (top and bottom) visible for playing and set height
    let topContent = document.getElementById("top-box");
    topContent.style.visibility = "visible";
    topContent.style.height = "130px";
    
    let bottomContent = document.getElementById("bottom-box");
    bottomContent.style.visibility = "visible";
    bottomContent.style.height = "55px";
    
    playBet();
}

function playBet() {
    
    // Display user and computer Score
    let topContent = document.getElementById("top-box");
    topContent.innerHTML = `
        <p>Turn ${gameTurn}: Bet your Marbles!</p>
        <span style="float:left; color: #325635">Your Score: ${userScore}</span>
        <span style="float:right; color: #AE3441">Computer Score: ${computerScore}</span>
    `

    // Display last round results
    let bottomContent = document.getElementById("bottom-box");
    bottomContent.innerHTML = `
        <p>Last turn result!</p>
    `
    
    // Manipulate main playing field for betting marbles
    let mainContent = document.getElementById("mid-box");
    let newContent = `
        <p>Please choose the amount of Marbles you want to bet. You must bet at least one Marble
        and can bet up to a maximum of 5 Marbles. However, you can only bet as much Marbles as you
        or the other side has.</p>
        <div id="select-box">
            <select id="bet-select" style="width:175px;">
                <option value="1">1 Marble</option>
    `;
    
    for (let i=2; i<=calculateMaxBet(); i++) {
        newContent += `
                <option value="${i}">${i} Marbles</option>    
        `;
    }
    
    newContent += `
            </select>
        </div>
        <button data-type="marblesbet" class="button">Bet Marbles</button>
    `; 

    mainContent.innerHTML = newContent;
}

function playGuess() {

}

/**
 * Calculates the maximum amount of Marbles that can be bet and 
 * returns that value
 */
function calculateMaxBet() {
    let maxBet=1;
    
    if (userScore>=5 && computerScore>=5) {
        maxBet=5;
    } else if (userScore<5 && computerScore>=5) {
        maxBet=userScore;
    } else if (userScore>=5 && computerScore<5) {
        maxBet=computerScore;
    } else {
        alert(`Calculation of maximum Bet Error!`);
    }
    return maxBet;
}
