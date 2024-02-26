// Variabili globali
let counter = 0;
let intervallo;
let miglioreTempo = localStorage.getItem('miglioreTempo') || Infinity;
let startTime; // Variabile per tenere traccia dell'inizio del timer
let timerButtonDisabled = false; // Flag per disabilitare il pulsante del timer durante il conteggio
let isMostraRegolaVisible = false; // Flag per la visibilità della regola

// Funzione che si attiva quando la finestra è completamente caricata
window.onload = function () {
  // Avvio dell'audio
  const musica = document.getElementById("musica");
  musica.play().catch(function (error) {
    console.error('Impossibile riprodurre l\'audio automaticamente:', error);
  });
  // Aggiornamento del miglior tempo
  updateBestTimeElement();
};

// Creazione degli elementi HTML
const container = document.querySelector('.container');
const displayNumberBox = document.createElement('div');
const displayNumber = document.createElement('p');
const buttonsContainer = document.createElement('div');
const plusButton = createButton('+');
const minusButton = createButton('-');

// Impostazione degli attributi e testo per gli elementi
displayNumberBox.setAttribute('class', 'displayNumberBox');
displayNumber.setAttribute('id', 'displayNumber');
displayNumber.textContent = '0';
buttonsContainer.setAttribute('class', 'buttonsContainer');
plusButton.setAttribute('id', 'segnoPiu');
minusButton.setAttribute('id', 'segnoMeno');

// Aggiunta degli elementi al DOM
displayNumberBox.appendChild(displayNumber);
buttonsContainer.appendChild(plusButton);
buttonsContainer.appendChild(minusButton);
container.appendChild(displayNumberBox);
container.appendChild(buttonsContainer);

// Aggiunta displayNumberBox sopra resetButtonBox
container.insertBefore(displayNumberBox, document.querySelector('.resetButtonBox'));

// Aggiunta buttonsContainer sopra resetButtonBox
container.insertBefore(buttonsContainer, document.querySelector('.resetButtonBox'));


// Ottiene riferimenti agli elementi HTML
const reset = document.getElementById('resetButton');
const timer = document.getElementById('timerButton');
const timerDisplay = document.getElementById('timerDisplay');
const audioGoTimer = document.getElementById("audioGoTimer");
const piuSound = document.getElementById("piuSound");
const menoSound = document.getElementById("menoSound");
const resetBtn = document.getElementById('resetBtn');
const regola = document.getElementById('regola');
const mostraRegola = document.getElementById('mostraRegola');
const regolaSound = document.getElementById('regolaSound');
const victorySound = document.getElementById('victorySound');

// Event delegation per i pulsanti di incremento e decremento
buttonsContainer.addEventListener('click', function (event) {
  // Verifica se il clic è avvenuto su un pulsante
  if (event.target.matches('button')) {
    // Verifica quale pulsante è stato cliccato
    switch (event.target.id) {
      case 'segnoPiu':
        incrementa();
        piuSound.currentTime = 0;
        piuSound.play();
        break;
      case 'segnoMeno':
        decrementa();
        menoSound.currentTime = 0;
        menoSound.play();
        break;
    }
  }
});

// Evento click per il pulsante di reset
reset.addEventListener('click', function () {
  resetta();
  resetBtn.currentTime = 0;
  resetBtn.play();
});

// Evento click per il pulsante del timer
timer.addEventListener('click', function () {
  avviaTimer();
  audioGoTimer.currentTime = 0;
  audioGoTimer.play();
});

// Evento click per il pulsante della regola
regola.addEventListener('click', function () {
  regolaSound.currentTime = 0;
  regolaSound.play();
  isMostraRegolaVisible = !isMostraRegolaVisible;
  mostraRegola.style.display = isMostraRegolaVisible ? 'block' : 'none';
});

// Funzione per creare pulsanti
function createButton(text) {
  const button = document.createElement('button');
  button.textContent = text;
  return button;
}

// Funzione per aggiornare il numero visualizzato
function tabellone() {
  displayNumber.textContent = counter;
}

// Funzione per incrementare il contatore
function incrementa() {
  counter++;
  tabellone();
  checkWinCondition();
}

// Funzione per decrementare il contatore
function decrementa() {
  if (counter > 0) {
    counter--;
    tabellone();
  }
}

// Funzione per reimpostare il gioco
function resetta() {
  counter = 0;
  tabellone();
  clearInterval(intervallo);
  timerButtonDisabled = false;
  if (timerDisplay.textContent !== "00 : 15") {
    timerDisplay.textContent = "00 : 15";
  }
}

// Funzione per avviare il timer
function avviaTimer() {
  if (timerButtonDisabled) {
    return;
  }
  timerButtonDisabled = true;
  resetta();
  startTime = Date.now(); // Memorizza il tempo di inizio
  let secondiMancanti = 15;
  timerDisplay.textContent = `00 : ${secondiMancanti < 10 ? '0' + secondiMancanti : secondiMancanti}`;
  intervallo = setInterval(function () {
    secondiMancanti--;
    timerDisplay.textContent = `${Math.floor(secondiMancanti / 60)} : ${secondiMancanti % 60 < 10 ? '0' + secondiMancanti % 60 : secondiMancanti % 60}`;
    if (secondiMancanti === 0) {
      clearInterval(intervallo);
      timerDisplay.textContent = `TIME EXPIRED`;
      if (counter < 100) {
        alert("You didn't reach 100 within the time limit. Counter reset.");
        resetta();
      }
    }
  }, 1000);
}

// Funzione per verificare se è stata raggiunta la condizione di vittoria
function checkWinCondition() {
  if (counter === 100) {
    clearInterval(intervallo);
    timerDisplay.textContent = "YOU'VE WON";
    alert("Congratulations, you've won!");
    victorySound.currentTime = 0;
    victorySound.play();
    let tempoTrascorso = Date.now() - startTime;
    if (tempoTrascorso < miglioreTempo && tempoTrascorso <= 15000) {
      miglioreTempo = tempoTrascorso;
      localStorage.setItem('miglioreTempo', miglioreTempo);
      alert("New best time record!");
      updateBestTimeElement();
    }
    resetta();
  }
}

// Funzione per aggiornare l'elemento del miglior tempo
function updateBestTimeElement() {
  let tempo = localStorage.getItem('miglioreTempo');
  if (tempo !== null && tempo !== Infinity) {
    let minuti = Math.floor(tempo / (1000 * 60));
    let secondi = Math.floor((tempo % (1000 * 60)) / 1000);
    let millisecondi = tempo % 1000;
    millisecondi = millisecondi.toString().padStart(3, '0').slice(0, 2);
    let bestTimeElement = document.getElementById('bestTime');
    bestTimeElement.textContent = `BEST TIME : ${secondi} seconds and ${millisecondi} milliseconds`;
  } else {
    let bestTimeElement = document.getElementById('bestTime');
    bestTimeElement.textContent = 'NO BEST TIME YET';
  }
}
