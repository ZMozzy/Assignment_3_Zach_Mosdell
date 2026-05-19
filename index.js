
document.getElementById("lose").addEventListener("click", () => {
  document.getElementById("lose").style.display = "none";
});

document.getElementById("win").addEventListener("click", () => {
  document.getElementById("win").style.display = "none";
});
//defauly values
let matches = 0;
let totalPairs = null;
let firstCard = null;
let secondCard = null;
let lockBoard = true;
let clickCount = 0;

function setup() {
  $(".card").on(("click"), function () {
    //doesn't let user spam
    if (lockBoard) return;
    $(this).toggleClass("flip");

    if (!firstCard) {
      firstCard = $(this);
      clickCount++;
      document.getElementById('click').textContent = "Clicks: " + clickCount;

    } else {
      secondCard = $(this);
      const firstImg = firstCard.find(".front_face")[0]
      const secondImg = secondCard.find(".front_face")[0]
      console.log(firstImg, secondImg);
      clickCount++;
      document.getElementById('click').textContent = "Clicks: " + clickCount;
      if (
        firstImg.src
        ==
        secondImg.src
      ) {
        console.log("match");
        firstCard.off("click");
        secondCard.off("click");
        //power up memory
        firstCard.addClass("matched");
        secondCard.addClass("matched");
        //increase matches on UI
        matches++;
        document.getElementById('matches').textContent = "Matches: " + matches + "/" + totalPairs;
        //win
        if (matches == totalPairs) {
          clearInterval(timerInterval);
          //lets card flip before message
          setTimeout(() => {
            document.getElementById('win').style.display = "flex";
          }, 600);
        }
        //resets values
        firstCard = null;
        secondCard = null;
      } else {
        console.log("no match")
        lockBoard = true;
        //flips cards back over
        setTimeout(() => {
          firstCard.toggleClass("flip")
          secondCard.toggleClass("flip")
          //resets values
          firstCard = null;
          secondCard = null;
          lockBoard = false;
        }, 1000)
      }
    }
  });
}

let currentDifficulty = null;
let limit = null;

//easy
document.getElementById('easy').addEventListener('click', async() => {
  lockBoard = true;
  timeLeft = 0;
  clearInterval(timerInterval);
  totalPairs = 3;
  resetBoard();
  setDifficulty(6);
  currentDifficulty = 20
  document.getElementById("timer").textContent = "Time: " + currentDifficulty;
  limit = 3;
  await loadPokemon(3);

});
//normal
document.getElementById('normal').addEventListener('click', async() => {
  lockBoard = true;
  timeLeft = 0;
  clearInterval(timerInterval);
  totalPairs = 6;
  resetBoard();
  setDifficulty(12);
  currentDifficulty = 45
  document.getElementById("timer").textContent = "Time: " + currentDifficulty;
  limit = 6;
  await loadPokemon(6);
});
//hard
document.getElementById('hard').addEventListener('click', async() => {
  lockBoard = true;
  timeLeft = 0;
  clearInterval(timerInterval);
  totalPairs = 10;
  resetBoard()
  setDifficulty(20);
  currentDifficulty = 60
  document.getElementById("timer").textContent = "Time: " + currentDifficulty;
  limit = 10;
  await loadPokemon(10);
});

document.getElementById('start').addEventListener('click', () => {

    if (!currentDifficulty) {
        alert("Choose a difficulty first");
        return;
    }
    if (timeLeft > 0) {
      startTimer(timeLeft);
    } else {
    startTimer(currentDifficulty);
    }
    lockBoard = false;

});

document.getElementById('reset').addEventListener('click', async() => {
  clearInterval(timerInterval);
  resetBoard();
  await loadPokemon(limit);
  startTimer(currentDifficulty);
});

document.getElementById('stop').addEventListener('click', () => {
  clearInterval(timerInterval);
  lockBoard = true;
});

document.getElementById('seer').addEventListener('click', () => {
  revealPowerUp();
});



//flips cards back over and resets values
function resetBoard() {
  $(".card").removeClass("flip matched");
  $(".card").off("click");

  firstCard = null;
  secondCard = null;
  lockBoard = true;

  matches = 0;
  document.getElementById('matches').textContent =
    "Matches: " + matches + "/" + totalPairs;

  setup();
  lockBoard = false;

}

//selects all cards
const cards = document.querySelectorAll(".card");

//only display 6, 12, or 20 hides the rest
function setDifficulty(amount) {

  for (let i = 0; i < cards.length; i++) {

    if (i < amount) {
      cards[i].style.display = "block";
      if (amount === 6) {
        cards[i].style.width = "33.3%";
      }
      if (amount === 12) {
        cards[i].style.width = "25%";
      }
      if (amount === 20) {
        cards[i].style.width = "20%";
      }
    } else {
      cards[i].style.display = "none";
    }

  }

}

//timer
let timerInterval;
let timeLeft = 0;

function startTimer(time) {

  clearInterval(timerInterval);

  timeLeft = time;

  document.getElementById("timer").textContent = "Time: " + timeLeft;

  timerInterval = setInterval(() => {

    timeLeft--;

    document.getElementById("timer").textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {

      clearInterval(timerInterval);

      document.getElementById('lose').style.display = "flex";

    }

  }, 1000);

}

//fetch pokemon from api
async function loadPokemon(limit) {
  //random starting point to get different pokemon
  let offset = Math.floor(Math.random() * 1200)

  let shuffledPokeList = [];
  let PokeList = [];

  let response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
  let jsonObj = await response.json();

  //adds 2 of the same pokemon to array
  for (let i = 0; i < jsonObj.results.length; i++) {
    let pokemon = jsonObj.results[i];

    if (i > 0) {
      lastPokemon = jsonObj.results[i - 1];

      if (pokemon.name === lastPokemon.name || lastPokemon == undefined) {
        continue;
      }
    }


    //console.log(pokemon.name);
    let response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
    let jsonObj2 = await response2.json();

    PokeList.push(jsonObj2.sprites.other['official-artwork'].front_default);
    PokeList.push(jsonObj2.sprites.other['official-artwork'].front_default);

  }
  //randomises array index
  shuffledPokeList = PokeList.sort(() => Math.random() - 0.5);
  //uses random array to inject pokemon
  hidePokemon(shuffledPokeList);
}


const frontImages = document.querySelectorAll(".front_face");
//loops each img and adds pokemon
function hidePokemon(pokemon) {

  for (let i = 0; i < pokemon.length; i++) {
    frontImages[i].src = pokemon[i];
  }

}

function revealPowerUp() {

    lockBoard = true;
    firstCard = null;
    secondCard = null;

    $(".card:visible").addClass("flip");

    setTimeout(() => {

        $(".card:visible").not(".matched").removeClass("flip");

        lockBoard = false;

    }, 2000);
  }

  const toggle = document.getElementById("darkToggle");

toggle.addEventListener("change", () => {
    if (toggle.checked) {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
});


