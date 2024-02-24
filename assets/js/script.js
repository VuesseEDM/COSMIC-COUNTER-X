// Funzione che si attiva quando la finestra è completamente caricata
window.onload = function () {
  // Ottiene l'elemento audio per la musica di sottofondo
  let musica = document.getElementById("musica");
  // Avvia la riproduzione della musica di sottofondo e gestisce eventuali errori
  musica.play().catch(function (error) {
    console.error('Impossibile riprodurre l\'audio automaticamente:', error);
  });

  // Chiama la funzione per aggiornare il tempo migliore
  updateBestTimeElement();
};

// Ottiene riferimenti agli elementi HTML utilizzati nell'applicazione
const displayNumber = document.getElementById('displayNumber');
const piu = document.getElementById('segnoPiu');
const meno = document.getElementById('segnoMeno');
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
const victorySound = document.getElementById('victorySound')
// Variabile per tenere traccia del conteggio corrente
let counter = 0;
// Variabile per l'intervallo del timer
let intervallo;
// Migliore tempo salvato in locale o valore infinito se non è stato ancora impostato
let miglioreTempo = localStorage.getItem('miglioreTempo') || Infinity;

// Funzione per aggiornare il numero visualizzato
function tabellone() {
  displayNumber.textContent = counter;
}

// Funzione per incrementare il contatore
function incrementa() {
  counter++;
  tabellone();

  // Controlla se il contatore ha raggiunto 100
  if (counter === 100) {
    clearInterval(intervallo);
    timerDisplay.textContent = "YOU'VE WON";
    alert("Congratulations, you've won!");
    // Riproduce il suono di vittoria
    victorySound.currentTime = 0;
    victorySound.play();

    let tempoTrascorso = Date.now() - startTime;

    // Aggiorna il migliore tempo se necessario
    if (tempoTrascorso < miglioreTempo) {
      miglioreTempo = tempoTrascorso;
      localStorage.setItem('miglioreTempo', miglioreTempo);
      alert("New best time record!");

      // Chiama la funzione per aggiornare il tempo migliore
      updateBestTimeElement();
    }

    // Reimposta il gioco
    resetta();
  }
}
// Funzione per decrementare il contatore
function decrementa() {
  if (counter >= 0) {
    tabellone();
    counter--;
  }
}

// Funzione per reimpostare il gioco
function resetta() {
  counter = 0;
  tabellone();

  if (intervallo) {
    clearInterval(intervallo);
    timerButtonDisabled = false;
    let timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay.textContent !== "00 : 15") {
      timerDisplay.textContent = "00 : 15";
    }
  }
}

// Variabile per disabilitare il pulsante del timer se è già attivo
let timerButtonDisabled = false;

// Funzione per avviare il timer
function avviaTimer() {
  if (timerButtonDisabled) {
    return;
  }
  timerButtonDisabled = true;
  resetta();
  startTime = Date.now();

  let timerDisplay = document.getElementById('timerDisplay');
  let secondiMancanti = 15;

  // Imposta il display del timer a 00:15
  timerDisplay.textContent = `00 : ${secondiMancanti < 10 ? '0' + secondiMancanti : secondiMancanti}`;
  intervallo = setInterval(function () {
    secondiMancanti--;

    let minuti = Math.floor(secondiMancanti / 60);
    let secondi = secondiMancanti % 60;

    // Aggiorna il display del timer con il tempo rimanente
    timerDisplay.textContent = `${minuti < 10 ? '0' + minuti : minuti} : ${secondi < 10 ? '0' + secondi : secondi}`;

    // Controlla se il tempo è scaduto
    if (secondiMancanti === 0) {
      clearInterval(intervallo);
      timerDisplay.textContent = `TIME EXPIRED`;

      // Riproduce il suono di avviso
      timeUpSound.currentTime = 0;
      timeUpSound.play()

      // Se il contatore non è arrivato a 100, azzera il contatore
      if (counter < 100) {
        alert("You didn't reach 100 within the time limit. Counter reset.");
        resetta();
      }
    }
  }, 1000);
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
    // Se non è presente alcun tempo salvato, visualizza un messaggio predefinito
    let bestTimeElement = document.getElementById('bestTime');
    bestTimeElement.textContent = 'NO BEST TIME YET';
  }
}

// Funzione per mostrare la regola del gioco
function showRegola() {
  let show = document.getElementById('mostraRegola');
  show.classList.add('mostraRegola');
  console.log(show);
}



// Evento click per il pulsante di incremento
piu.addEventListener('click', function () {
  incrementa();
  piuSound.currentTime = 0;
  piuSound.play();
});


// Evento click per il pulsante di decremento
meno.addEventListener('click', function () {
  decrementa();
  menoSound.currentTime = 0;
  menoSound.play();
});

// Evento click per il pulsante di reset
reset.addEventListener('click', function () {
  resetta();
  resetBtn.currentTime = 0;
  resetBtn.play();
  let timerDisplay = document.getElementById('timerDisplay');
  clearInterval(intervallo);

  if (timerDisplay.textContent !== "00 : 15") {
    timerDisplay.textContent = "00 : 15";
  }
});

// Variabile per tenere traccia della visibilità della regola
let isMostraRegolaVisible = false;

// Evento click per il pulsante del timer
timer.addEventListener('click', function () {
  avviaTimer();
  audioGoTimer.currentTime = 0;
  audioGoTimer.play();
});

// Evento click per il pulsante della regola
regola.addEventListener('click', function () {

  // Se la regola è già visibile, la nasconde
  if (isMostraRegolaVisible) {
    regolaSound.currentTime = 0;
    regolaSound.play();
    mostraRegola.style.display = 'none';
  }

  else {
    // Altrimenti, la mostra
    regolaSound.currentTime = 0;
    regolaSound.play();
    mostraRegola.style.display = 'block';
  }

  // Inverti lo stato della visibilità
  isMostraRegolaVisible = !isMostraRegolaVisible;
});