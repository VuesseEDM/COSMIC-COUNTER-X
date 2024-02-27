// Funzione che si attiva quando la finestra è completamente caricata
window.onload = function () {
  // Avvio dell'audio
  const musica = document.getElementById("musica");
  musica.play().catch(function (error) {
    console.error('Impossibile riprodurre l\'audio automaticamente:', error);
  });
  // Aggiornamento del miglior tempo
  updateBestTimeElement();
}


// Variabili globali
let counter = 0;
let intervallo;
let miglioreTempo = localStorage.getItem('miglioreTempo') || Infinity;
let startTime; // Variabile per tenere traccia dell'inizio del timer
let timerButtonDisabled = false; // Flag per disabilitare il pulsante del timer durante il conteggio
let isMostraRegolaVisible = false; // Flag per la visibilità della regola



// Creazione degli elementi HTML utilizzando la funzione createDOMElement
function createDOMElement(tagName, className, innerHTML, id) {
  const element = document.createElement(tagName);
  if (className) {
    element.setAttribute('class', className);
  }
  if (id) {
    element.setAttribute('id', id);
  }
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }
  return element;
}
const container = document.querySelector('.container');
const displayNumberBox = createDOMElement('div', 'displayNumberBox');
const displayNumber = createDOMElement('p', '', '0', 'displayNumber');
const buttonsContainer = createDOMElement('div', 'buttonsContainer');
const plusButton = createDOMElement('button', '', '+', 'segnoPiu');
const minusButton = createDOMElement('button', '', '-', 'segnoMeno');
const resetButton = createDOMElement('button', '', 'Reset', 'resetButton');
const timerButton = createDOMElement('button', '', 'Go Timer', 'timerButton');
const timerDisplay = createDOMElement('p', '', '', 'timerDisplay');
const regolaButton = createDOMElement('button', '', 'ONE RULE', 'regola');
const mostraRegola = createDOMElement('div', '', 'The only rule is to make 100 clicks within 15 seconds. The best time will be shown at the top.', 'mostraRegola');

// Aggiunta degli elementi al DOM
container.insertBefore(displayNumberBox, document.querySelector('.resetButtonBox'));
container.insertBefore(buttonsContainer, document.querySelector('.resetButtonBox'));
displayNumberBox.appendChild(displayNumber);
buttonsContainer.appendChild(plusButton);
buttonsContainer.appendChild(minusButton);
container.appendChild(resetButton);
container.appendChild(timerButton);
container.appendChild(timerDisplay);
container.appendChild(boxRegola);
boxRegola.appendChild(regolaButton);
boxRegola.appendChild(mostraRegola);


// Gestore degli eventi per tutti i pulsanti all'interno del container
container.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
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
      case 'resetButton':
        resetta();
        resetBtn.currentTime = 0;
        resetBtn.play();
        break;
      case 'timerButton':
        avviaTimer();
        audioGoTimer.currentTime = 0;
        audioGoTimer.play();
        break;
      case 'regola':
        regolaSound.currentTime = 0;
        regolaSound.play();
        isMostraRegolaVisible = !isMostraRegolaVisible;
        mostraRegola.style.display = isMostraRegolaVisible ? 'block' : 'none';
        break;
    }
  }
});


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
};
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
        // Riproduce il suono di avviso
        timeUpSound.currentTime = 0;
        timeUpSound.play()
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

