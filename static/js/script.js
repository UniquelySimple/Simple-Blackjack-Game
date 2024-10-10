let blackjack = {
    'you':{'scorespan':'#user-score','div':'#user-box','score':0},
    'dealer':{'scorespan':'#dealer-score','div':'#dealer-box','score':0},
    'cards':['2','3','4','5','6','7','8','9','10','j','q','k','a'],
    'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'j':10,'q':10,'k':10,'a':[1,11]},
    'isStand':false,
    'userPlayed':false,
    'wins':0,
    'losses':0,
    'draws':0,
};

var YOU = blackjack['you']
var DEALER = blackjack['dealer']

const cashSound = new Audio("static/sounds/cash sound.mp3")
const loseSound = new Audio("static/sounds/lose sound.mp3")
const hitSound = new Audio("static/sounds/hit sound.mp3")

document.querySelector('#hit-button').addEventListener('click', hitFunc);
document.querySelector('#stand-button').addEventListener('click', standFunc);
document.querySelector('#deal-button').addEventListener('click', dealFunc);

function sleep() { //sleep function pauses the execution for a while
    return new Promise(resolve => setTimeout(resolve,1000));
    // above line is the sleep logic
}

function hitFunc(){
    if (blackjack['isStand']===false) {
        let card = randomCard();
        showCard(card, YOU);
        updateScore(card, YOU);
    }
    blackjack['userPlayed']=true;
}
async function standFunc(){
    if (blackjack['userPlayed']===true) {
        blackjack['isStand']=true;
        while (DEALER['score']<16) {
            let card = randomCard();
            showCard(card, DEALER);
            updateScore(card, DEALER);
            await sleep(); //sleep function must be called using await
        }
        showResult();
        blackjack['userPlayed']=false;
    }
}
function randomCard(){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjack['cards'][randomIndex];
}
function showCard(card, activePlayer){
    if (activePlayer['score']<=21) {
        let cardImage = document.createElement('img');
        cardImage.src = 'static/images/'+card+'.png';
        cardImage.style.width = '120px';
        cardImage.style.margin = '10px';
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}
function updateScore(card, activePlayer){
    if (card=='a') {
        //if adding 11 keeps the score below 21, add 11, otherwise add 1
        if (activePlayer['score'] + blackjack['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjack['cardsMap'][card][1];            
        }
        else{
            activePlayer['score'] += blackjack['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blackjack['cardsMap'][card];
    }
    if (activePlayer['score']>21) {
        document.querySelector(''+activePlayer['scorespan']).textContent = 'BURST';
        document.querySelector(''+activePlayer['scorespan']).style.color = '#FF0400';  
    }
    else{
        document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
}
function dealFunc() {
    blackjack['isStand']=false;

    let yourImages = document.querySelector('#user-box').querySelectorAll('img');
    let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

    for (let index = 0; index < yourImages.length; index++) {
        yourImages[index].remove();
    }
    for (let index = 0; index < dealerImages.length; index++) {
        dealerImages[index].remove();
    }

    YOU['score'] = 0;
    DEALER['score'] = 0;

    document.querySelector('#state').textContent = "Let's Play";
    document.querySelector('#state').style.color = '#FFFFFF';

    document.querySelector('#user-score').textContent = 0;
    document.querySelector('#dealer-score').textContent = 0;
    document.querySelector('#user-score').style.color = '#FFFFFF';
    document.querySelector('#dealer-score').style.color = '#FFFFFF';
}
function showResult() {
    if (YOU['score']>DEALER['score'] && YOU['score']<22) {
        document.querySelector('#state').textContent = 'You Win!';
        document.querySelector('#state').style.color = '#00FF00';
        blackjack['wins']+=1;
        document.querySelector('#wins').textContent = blackjack['wins'];
        cashSound.play();

    } else if (DEALER['score']>YOU['score'] && DEALER['score']<22) {
        document.querySelector('#state').textContent = 'You Lose!';
        document.querySelector('#state').style.color = '#FF0000';
        blackjack['losses']+=1;
        document.querySelector('#losses').textContent = blackjack['losses'];
        loseSound.play();
    } else if (DEALER['score']===YOU['score'] || (DEALER['score']>21 && YOU['score']>21)){
        document.querySelector('#state').textContent = 'Draw!';
        document.querySelector('#state').style.color = '#666666';
        blackjack['draws']+=1;
        document.querySelector('#draws').textContent = blackjack['draws'];
    }
}