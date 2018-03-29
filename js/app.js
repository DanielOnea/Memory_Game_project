/*
 * Create a list that holds all of your cards
 */
var cardLists = [
        "fa-diamond",
        "fa-paper-plane-o",
        "fa-anchor",
        "fa-bolt",
        "fa-cube",
        "fa-leaf",
        "fa-bicycle",
        "fa-bomb"
      ];
// to store number of moves and matches found
var moves = 0;
var match_found = 0;

// check when first card is opened
var game_started = false;

// timer object
var timer = new Timer();
timer.addEventListener('secondsUpdated', function (e) {
    $('#timer').html(timer.getTimeValues().toString());
});

// reset button
$('#reset-button').click(resetGame);
// create and append card html

function createCard(card) {
    $('#deck').append(`<li class="card animated"><i class="fa ${card}"></i></li>`);
}
// generate random cards on the deck
function generateCards() {
    for (var i = 0; i < 2; i++) {
        cardLists = shuffle(cardLists);
        cardLists.forEach(createCard);
    }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length
        , temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
// Array to keep track of open cards
openCards = [];

// card functionality
function toggleCard() {

    // start the timer when first card is opened
    if (game_started == false) {
        game_started = true;
        timer.start();
    }

    if (openCards.length === 0) {
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        disableCLick();
    }
    else if (openCards.length === 1) {
        // increment moves
        updateMoves();
        $(this).toggleClass("show open").animateCss('flipInY');
        openCards.push($(this));
        setTimeout(matchOpenCards, 1100);
    }
}
// Disable click of the open Cards
function disableCLick() {
    openCards.forEach(function (card) {
        card.off('click');
    });
}
// enable click on the open card
function enableClick() {
    openCards[0].click(toggleCard);
}
// check openCards if they match or not
function matchOpenCards() {
    if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
        console.log("matchCard");
        openCards[0].addClass("match").animateCss('pulse');
        openCards[1].addClass("match").animateCss('pulse');
        disableCLick();
        removeOpenCards();
        setTimeout(checkWin, 1000);
    }
    else {
        openCards[0].toggleClass("show open").animateCss('flipInY');
        openCards[1].toggleClass("show open").animateCss('flipInY');
        enableClick();
        removeOpenCards();
    }
}
// function to remove openCards
function removeOpenCards() {
    openCards = [];
}
// function to add animations
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass(animationName).one(animationEnd, function () {
            $(this).removeClass(animationName);
        });
        return this;
    }
});
// update moves
function updateMoves() {
    moves += 1;
    $('#moves').html(`${moves} Moves`);
    if (moves == 25) {
        addBlankStar();
    }
    else if (moves == 16) {
        addBlankStar();
    }
}
// check game completion
function checkWin() {
    match_found += 1;
    if (match_found == 8) {
        showResults();
    }
}
// add blank stars
function addBlankStar() {
    $('#rating').children()[0].remove();
    $('#rating').append('<li><i class="fa fa-star-o"></i></li>');
}
// add initial stars
function addStars() {
    for (var i = 0; i < 3; i++) {
        $('#rating').append('<li><i class="fa fa-star"></i></li>');
    }
}
// resets the game
function resetGame() {
    moves = 0;
    match_found = 0;
    $('#deck').empty();
    $('#rating').empty();
    $('#game-deck')[0].style.display = "";
    $('#sucess-result')[0].style.display = "none";
    game_started=false;
    timer.stop();
    $('#timer').html("00:00:00");
    playGame();
}

// game start
playGame();

// Init function
function playGame() {
    generateCards();
    $('.card').click(toggleCard);
    $('#moves').html("0 Moves");
    addStars(3);
}
// shows result on game completion
function showResults() {
    $('#sucess-result').empty();
    timer.pause();
    var scoreBoard = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 135">
            <circle class="path circle" fill="none" stroke="#8bda7d" stroke-width="8" stroke-miterlimit="10" cx="67" cy="67" r="60" />
            <polyline class="path check" fill="none" stroke="#8bda7d" stroke-width="8" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " /></svg>
        <p class="success"> DONE ! </p>
        <p>
            <span class="score-titles">Moves:</span>
            <span class="score-values">${moves}</span>
            <span class="score-titles">Time:</span>
            <span class="score-values">${timer.getTimeValues().toString()}</span>
        </p>
        <div class="top-center bottom-line">
             <div class="star">
                <i class="fa fa-star fa-3x"></i>
             </div>
             <div class="star">
                <i class="fa ${ (moves > 25) ? "fa-star-o" : "fa-star"} fa-3x"></i>
             </div>
            <div class="star">
                <i class="fa ${ (moves > 16) ? "fa-star-o" : "fa-star"} fa-3x"></i>
             </div>
        </div>
        <div class="top-center bottom-line" id="restart">
            <p class="try"> TRY AGAIN? <p>
            <i class="fa fa-refresh fa-spin"></i>
          </div>
    `;
    $('#game-deck')[0].style.display = "none";
    $('#sucess-result')[0].style.display = "block";
    $('#sucess-result').append($(scoreBoard));
    $('#restart').click(resetGame);
}
