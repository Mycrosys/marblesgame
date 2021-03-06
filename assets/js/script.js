/*jshint esversion: 6 */    // needed by jshint

// Global variables to track Score and Turn

let userScore = 1;          // Score for the Player
let computerScore = 1;      // Score for the Computer
let gameTurn = 1;           // Current Turn number
let lastTurnResult;         // The game result of the previous turn (string)

// Wait for the DOM to finish loading before running the game
// Get the button elements and add event listeners to start the game

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
        });
    }
});


/**
 * Initializing the game by choosing the Amount of Marbles at the start
 * of the game, then set starting scores for both parties
 */
function chooseMarblesAmount() {
    let mainContent = document.getElementById("mid-box");
    
    // set to one of the available options (5,10,15,20,25)
    mainContent.innerHTML = `
        <p>Please choose the amount of Marbles each side starts with. More Marbles make for a longer
        game.</p>
        <div id="select-box">
            <select id="value-select">
                <option value="5">5 Marbles</option>
                <option value="10" selected="selected">10 Marbles</option>
                <option value="15">15 Marbles</option>
                <option value="20">20 Marbles</option>
                <option value="25">25 Marbles</option>
            </select>
        </div>
        <p>Please also choose the difficulty. This will impact the amount of marbles the Computer starts
         with. Chosing normal will give the Computer the same amount of starting marbles, hard will 
         multiply that number by 3 and insane by 5.</p>
        <div id="select-box">
            <select id="difficulty-select">
                <option value="1" selected="selected">Normal (x1)</option>
                <option value="3">Hard (x3)</option>
                <option value="5">Insane (x5)</option>
            </select>
        </div>
        <button data-type="marblesamount" class="button">Continue</button>
    `;

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type")==="marblesamount") {
                let choosenMarbles = document.getElementById("value-select");
                userScore = parseInt(choosenMarbles.value);             // set userScore to selected amount
                computerScore = parseInt(choosenMarbles.value);         // set computerScore to selected amount

                // increase computerScore by factor of 1, 3 or 5, depending on selected difficulty
                let difficulty = document.getElementById("difficulty-select"); 
                computerScore *= parseInt(difficulty.value);
                startGame();
            }
            else {
                let buttonType = this.getAttribute("button-type");      // Handler for everything else, should never happen
                alert(`You clicked ${buttonType}`);
            }
        });
    }
}

/**
 * First run setup for the html to enable all boxes and set correct heights,
 * then start the first turn (bet)
 */
function startGame() {
    
    // Make the 2 divs (top and bottom) visible for playing and set heights
    let topContent = document.getElementById("top-box");
    topContent.style.visibility = "visible";
    topContent.style.height = "140px";
    
    let bottomContent = document.getElementById("bottom-box");
    bottomContent.style.visibility = "visible";
    bottomContent.style.height = "170px";
    
    let midContent = document.getElementById("mid-box");
    midContent.style.height = "350px";

    lastTurnResult = "Here you will see the results of your last turn.";        // Set last turn result for the first time

    playBet();                                                                  // Start betting round
}

/**
 * This starts the betting round. This is the core gameplay loop with this 
 * and the guessing round alternating between each other.
 */
function playBet() {
    
    if (userScore===0 || computerScore ===0) {                                  // check if there is already a winner
        announceWinner();                                                       // if there is a winner, announce him/her
    } else {
        setBetField();                                                          // set up the html for playing the betting round
        
        let buttons = document.getElementsByTagName("button");

        for (let button of buttons) {
            button.addEventListener("click", function() {
                if (this.getAttribute("data-type")==="marblesbet") {
                    let betMarbles = document.getElementById("bet-select");
                    let bet = parseInt(betMarbles.value);
                    
                    // computer makes a random guess if the number is even(0) or odd(1)
                    let guess = Math.floor(Math.random() * 2);

                    // if player has only one marble left, computer will always chose "odd" and win the game
                    if (userScore===1) {
                        guess=1;
                    }
                                
                    // calculate new scores depending on right or wrong guess
                    if (calculateResult(bet, guess)) {                          // if true is returned the answer was correct and player loses marbles
                        userScore = userScore - bet;
                        computerScore = computerScore + bet;
                        lastTurnResult = `Computer chose right! You <span class="lose">lose ${bet} Marble/s</span>!`;
                    } else {                                                    // if false is returned the answer was wrong and player gains marbles
                        userScore = userScore + bet;
                        computerScore = computerScore - bet;
                        lastTurnResult = `Computer chose wrong! You <span class="win">win ${bet} Marble/s</span>!`;
                    }
                    
                    gameTurn++;                                                 // Next turn coming up so increase turn counter
                    playGuess();                                                // start the guessing round

                } else if (this.getAttribute("data-type")==="quit") {          
                        location.reload();                                      // Check if player presses quit button and reset game by reloading page
                } else {
                    let buttonType = this.getAttribute("data-type");            // Handler for everything else, should never happen
                    alert(`You clicked ${buttonType}`);
                }
            });
        }
    }
}

/**
 * Setting up the html for the betting round
 */
function setBetField() {

    // Display user and computer Score
    let topContent = document.getElementById("top-box");
    topContent.innerHTML = `
        <p>Turn ${gameTurn}: Bet your Marbles!</p>
        <span class="left score-user">Your Score: ${userScore}</span>
        <span class="right score-computer">Computer Score: ${computerScore}</span>
    `;

    // Display last round results
    let bottomContent = document.getElementById("bottom-box");
    bottomContent.innerHTML = `
        <p>${lastTurnResult}</p>
        <button data-type="quit" class="button">Quit to Start</button>
    `;
    
    // Manipulate main playing field for betting marbles
    let mainContent = document.getElementById("mid-box");
    let newContent = `
        <p>Please choose the amount of Marbles you want to bet. You must bet at least one Marble
        and can bet up to a maximum of 5 Marbles. However, you can only bet as much Marbles as you
        or the other side has.</p>
        <div id="select-box">
            <select id="bet-select">
                <option value="1">1 Marble</option>
    `;
    
    for (let i=2; i<=calculateMaxBet(); i++) {                  // Add the select box options for the max bet allowed
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

/**
 * This starts the guessing round. This is the core gameplay loop with this 
 * and the betting round alternating between each other.
 */
function playGuess() {
    
    if (userScore===0 || computerScore ===0) {
        announceWinner();
    } else {
        setGuessField();        // set up the html for playing the guessing round

        // computer makes a random bet of marbles between 1 and the max amount allowed
        let bet = calculateBet();

        let buttons = document.getElementsByTagName("button");
        
        for (let button of buttons) {
            button.addEventListener("click", function() {
                if (this.getAttribute("data-type")==="even") {
                    let guess = 0;
                    
                    // calculate new scores depending on right or wrong guess
                    if (calculateResult(bet, guess)) {
                        userScore = userScore + bet;
                        computerScore = computerScore - bet;
                        lastTurnResult = `You chose right! You <span class="win">win ${bet} Marble/s</span>!`;
                    } else {
                        userScore = userScore - bet;
                        computerScore = computerScore + bet;
                        lastTurnResult = `You chose wrong! You <span class="lose">lose ${bet} Marble/s</span>!`;
                    }
                    
                    // Next turn coming up so increase turn counter and set up for betting marbles
                    gameTurn++;
                    playBet();

                } else if (this.getAttribute("data-type")==="odd") {
                    let guess = 1;
                    
                    // calculate new scores depending on right or wrong guess
                    if (calculateResult(bet, guess)) {
                        userScore = userScore + bet;
                        computerScore = computerScore - bet;
                        lastTurnResult = `You chose right! You <span class="win">win ${bet} Marble/s</span>!`;
                    } else {
                        userScore = userScore - bet;
                        computerScore = computerScore + bet;
                        lastTurnResult = `You chose wrong! You <span class="lose">lose ${bet} Marble/s</span>!`;
                    }
                    
                    gameTurn++;                                             // Next turn coming up so increase turn counter
                    playBet();                                              // start the betting round

                } else if (this.getAttribute("data-type")==="quit") {
                    location.reload();                                      // Check if player presses quit button and reset game by reloading page
                } else {
                    let buttonType = this.getAttribute("data-type");        // Handler for everything else, should never happen
                    alert(`You clicked ${buttonType}`);
                }
            });
        }
    }
}

/**
 * Setting up the html for the guessing round
 */
function setGuessField() {
    
    // Display user and computer Score
    let topContent = document.getElementById("top-box");
    topContent.innerHTML = `
        <p>Turn ${gameTurn}: Guess Even or Odd!</p>
        <span class="left score-user">Your Score: ${userScore}</span>
        <span class="right score-computer">Computer Score: ${computerScore}</span>
    `;

    // Display last round results
    let bottomContent = document.getElementById("bottom-box");
    bottomContent.innerHTML = `
        <p>${lastTurnResult}</p>
        <button data-type="quit" class="button">Quit to Start</button>
    `;
    
    // Manipulate main playing field for betting marbles
    let mainContent = document.getElementById("mid-box");
    let newContent = `
        <p>Now the role changes and you have to take a guess if the Computer chose an Even or
        Odd amount of Marbles to bet against you. Please click on the appropriate Button to 
        make your choice.</p>
        <div id="double-button">
            <span style="float:left;"><button data-type="even" class="button left">Guess Even</button></span>
            <span style="float:right;"><button data-type="odd" class="button right">Guess Odd</button></span>
        </div>
    `; 

    mainContent.innerHTML = newContent;    
}

/**
 * Setting up the html for the winning announcement
 */
function setWinnerField() {
    
    // Display user and computer Score
    let topContent = document.getElementById("top-box");
    topContent.innerHTML = `
        <p>We have a Winner!</p>
        <span class="left score-user">Your Score: ${userScore}</span>
        <span class="right score-computer">Computer Score: ${computerScore}</span>
    `;

    // Display last round results, no quit to start here because we have it on the mid-box
    let bottomContent = document.getElementById("bottom-box");
    bottomContent.innerHTML = `
        <p>${lastTurnResult}</p>
    `;
    bottomContent.style.height = "70px";        // reduces the height because the button is no longer there
    
    let mainContent = document.getElementById("mid-box");
    let newContent;

    if(userScore===0) {                         // Player has 0 points and loses
        newContent = `
            <h2>You Lose!</h2>
            <p>Too bad. Sadly, the numbers weren't in your favor. Better luck next time!</p>
        `;
    } else if (computerScore===0) {              // Computer has 0 points and loses
        newContent = `
            <h2>You Win!</h2>
            <p>Good job! Now challenge yourself again by winning multiple times in a row!</p>
        `;
    } else {                                     // All other cases, should never happen
        newContent = `
            <h2>It's a Draw!</h2>
            <p>Honestly, you should have won this. Now try again!</p>
        `;
    }

    newContent += `
        <button data-type="quit" class="button">Play again!</button>
    `;
        
    mainContent.innerHTML = newContent;
}

/**
 * Calculates the maximum amount of Marbles that can be bet and 
 * returns that value
 */
function calculateMaxBet() {
    let maxBet=1;
    
    if (userScore>=5 && computerScore>=5) {                     // maxBet is 5 if both player and computer have equal or more
        maxBet=5;                                               // than 5 marbles
    } else if (userScore<5 && computerScore>=5) {
        maxBet=userScore;                                       // if player is below 5, that is the new maxbet (computer and
    } else if (userScore>=5 && computerScore<5) {               // player cannot be below 5 at the same time)
        maxBet=computerScore;                                   // if computer is below 5, that is the new maxbet
    } else {
        alert(`Calculation of maximum Bet Error!`);             // Handler for everything else, will never happen
    }
    return maxBet;
}

/**
 * Calculates if the amount of marbles bet are matching the guess the other player took
 * @param {*} bet - The amount of Marbles bet by one player
 * @param {*} guess - The guess of the other player if that amount is even (0) or odd (1)
 * @returns - bolean true/false: true if the guess was correct, false if it wasn't
 */
function calculateResult(bet, guess) {
    if (bet%2===guess) {
        return true;
    } else {
        return false;
    }
}

/**
 * This starts the winning announcement. It ends the core gameplay loop and offers 
 * a single button to restart the game by reloading the site
 */
function announceWinner() {
    
    setWinnerField();                                               // set up the html for the winning announcement

    let buttons = document.getElementsByTagName("button");

    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.getAttribute("data-type")==="quit") {          // Check if player presses quit button and reset game by reloading page
                location.reload();
            }
            else {
                let buttonType = this.getAttribute("data-type");    // Handler for everything else, should never happen
                alert(`You clicked ${buttonType}`);
            }
        });
    }
}

/**
 * Generate a number between 1 and maxbet with a perfect 50-50 chance
 * between choosing an even or odd number
 */
function calculateBet() {
    
    if (calculateMaxBet()===1 || calculateMaxBet()===2 || calculateMaxBet()===4) {      // For maxbet 1,2 and 4 the chance is even (1 always returns
        return Math.floor(Math.random() * calculateMaxBet() +1);                        // a 1, 2 and 4 have perfect ratio between even and odd numbers.
    } else if (calculateMaxBet()===3) {
        let coinToss = Math.floor(Math.random() * 2);                                   // toss another coin for maxbet 3

        if (coinToss===0) {
            return 2;                                                                   // if even, there is only one even number between 1 and 3, which is 2
        } else if (coinToss===1) {                                                      // otherwise toss a coin again then get number out of array
            let arrayOdd = [1,3];
            let coinTossOdd = Math.floor(Math.random() * 2);
            return arrayOdd[coinTossOdd];
        } else {
            alert(`Unhandled calculateBet error!`);                                     // handling everything else, should never happen
        }
    } else if (calculateMaxBet()===5) {
        let coinToss = Math.floor(Math.random() * 2);

        if (coinToss===0) {                                                             // with maxbet 5 there are 2 even numbers (2 and 4), so do another
            let arrayEven = [2,4];                                                      // cointoss then choose out of array
            let coinTossEven = Math.floor(Math.random() * 2);
            return arrayEven[coinTossEven];
        } else if (coinToss===1) {                                                      
            let arrayOdd = [1,3,5];                                                     // same as above with odd numbers, just this time we can chose out
            let coinTossOdd = Math.floor(Math.random() * 3);                            // of 1,3 and 5
            return arrayOdd[coinTossOdd];
        } else {
            alert(`Unhandled calculateBet error!`);                                     // handling everything else, should never happen
        }
    } else {
        alert(`Unhandled calculateBet error!`);                                         // handling everything else, should never happen
    }
}