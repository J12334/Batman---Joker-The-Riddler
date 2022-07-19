class AudioController{
  constructor() {
    this.bgMusic = new Audio('bgm.mp3');
    this.bgMusic.volume = 0.17;
  }

  startMusic() {
    this.bgMusic.currentTime = 0;
    this.bgMusic.play();
  }

  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.volume = 0;
    // this.bgMusic.currentTime = 0;
  }

}


let bc = new AudioController();

function generateGrid(rows){

    let gridarea = document.querySelector(".guess-grid");
    gridarea.style.gridTemplateRows = `repeat(${rows},3.5em)`;
    for(let i=0; i<rows*5; i++){
      
       let box = document.createElement("div");
       box.classList.add("tile");
       gridarea.appendChild(box);

    }

}


let getinstruction = document.getElementsByClassName("ino");
let instructions = document.getElementsByClassName("instructions");
let menu = document.getElementsByClassName("menu");
let backtomenu = document.getElementsByClassName("goback");
let startgame = document.getElementsByClassName("startgame");
let game = document.getElementsByClassName("game");


function abc() {
  menu[0].classList.add("invisible");
  instructions[0].classList.remove("invisible");
};

function btm() {
  instructions[0].classList.add("invisible");
  menu[0].classList.remove("invisible");
};

let timerall = document.getElementsByClassName("timer");
let timer = timerall[0];

let totaltimetocountdown = 90;
let totalTime = 90;
let noOfRows = 5;

function start() {
  let levels = document.querySelector(".leveloptions");
  // console.log(levels.value);
  // in case of error ->
  if(levels.value === "levelname"){
    alert("Select one level");
    // showAlert("You Win", 1000);
    return;
  }
  
  if(levels.value === "Easy"){
    generateGrid(6);
    totaltimetocountdown = 90;
    totalTime = 90;
    noOfRows = 6;

  }else if(levels.value === "Medium"){
    generateGrid(5);
    totaltimetocountdown = 70;
    totalTime = 70;
    noOfRows = 5;
    
  }else{
    generateGrid(4);
    totaltimetocountdown = 50;
    noOfRows = 4;
    totalTime = 50;
  } 

  timer.innerHTML = `${totaltimetocountdown}`;


  startInteraction();
  menu[0].classList.add("invisible");
  game[0].classList.remove("invisible");
};






// function updateCountdown(){
//   let ts = totaltimetocountdown;
//   timer.innerHTML = `${ts}`;
//   totaltimetocountdown--;
// }






const WORD_LENGTH = 5
const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
let tw = Math.floor(Math.random() * 100000)
let targetWord = tw.toString();

if(targetWord.length < 5){
   targetWord = 4 + targetWord;
}

console.log(targetWord);
console.log(typeof (targetWord));
let timerinterval;

function startInteraction() {
  bc.startMusic();
  timerinterval = setInterval(() => {
    let ts = totaltimetocountdown;
    timer.innerHTML = `${ts}`;
    totaltimetocountdown--;
    if (totaltimetocountdown < 0) {
      bc.stopMusic();
      stopInteraction();
      showAlert(targetWord, 5000);
      
    }
  }, 1000);
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
  // updateCountdown();
}

function stopInteraction() {
  clearInterval(timerinterval);
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[0-9]$/)) {
    /* a-z ke beechme sab hai kya uske liye regular expression */
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  // nextTile.dataset.letter = key.toLowerCase()
  nextTile.dataset.letter = key;
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  // const activeTiles = getActiveTiles();
  if (activeTiles.length !== WORD_LENGTH) {
    return;
  }

  const guess = activeTiles.reduce((guess, tile) => {

    return (guess * 10) + Number(tile.dataset.letter);

  }, 0);

  console.log(guess);
  stopInteraction();
  // guessGrid.setAttribute("readonly",true);
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (Number(targetWord[index]) === Number(letter)) {
        tile.dataset.state = "correct"
        //  key.classList.add("correct")
      } else {

        if (Math.abs(Number(targetWord[index]) - Number(letter)) > 6) {
          tile.dataset.state = "red";
        } else if (Math.abs(Number(targetWord[index]) - Number(letter)) > 3) {
          tile.dataset.state = "orange";
        } else {
          tile.dataset.state = "yellow";
        }

      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction();
            checkWinLose(guess, array)
            // guessGrid.setAttribute("readonly",false);
          }, {
            once: true
          }
        )
      }
    }, {
      once: true
    }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      }, {
        once: true
      }
    )
  })
}

function checkWinLose(guess, tiles) {
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])");
  const rowUsed = ((noOfRows*5) - remainingTiles.length) / 5;
  const gameInfo = {};
  if (guess === Number(targetWord)) {
    showAlert("You Win", 5000);
    //this.cc = new AudioController();
    bc.stopMusic();
    stopInteraction();
    gameInfo.showTime = totalTime - totaltimetocountdown -1;
    gameInfo.showRow = rowUsed;
    showGameInfo(gameInfo);
    return
  }


  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    bc.stopMusic();
    stopInteraction();
    gameInfo.showTime = totalTime - totaltimetocountdown -1;
    gameInfo.showRow = rowUsed;
    showGameInfo(gameInfo);
  }
}

function showGameInfo(gameInformation) {
  const game = document.querySelector(".game");
  game.style.zIndex = '0';
  game.style.backgroundColor  = 'transparent';

  const gameInfo =document.querySelector(".gameInfo");
  gameInfo.style.display = 'block';
  gameInfo.style.backgroundColor  = 'rgba(0,0,0,0.8)';

  const showTime = document.querySelector("#showTime");
  showTime.textContent = `${gameInformation.showTime} s`;

  const showRow = document.querySelector("#showRow");
  showRow.textContent = gameInformation.showRow;
}

function resetGame() {
  const gameInfo =document.querySelector(".gameInfo");
  gameInfo.style.display = 'none';
}

function cancel() {
  location.reload();
}


function restart() {
  let gridarea = document.querySelector(".guess-grid");
  gridarea.innerHTML = '';
  resetGame();
  tw = Math.floor(Math.random() * 100000)
  targetWord = tw.toString();
  bc = new AudioController();
  console.log("new target word ",targetWord);
  start();
}