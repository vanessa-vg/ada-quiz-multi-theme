//Import de question et reponses à partir de notre base de donnees
import { quiz_culture_g } from './questions.js';
import { quiz_animaux } from './questions_animaux.js';
import { quiz_anatomie } from './questions_anatomie.js';
import { quiz_football } from './questions_football.js';
//Récuperer les emplacements en HTML pour inserer tout dont on a besoin
const questionsText = document.getElementById('question-text');
const answersContainer = document.getElementById('options-container');
const buttonNext = document.getElementById('next-button');
const replayButton = document.getElementById('replay-button');
const textEnd = document.getElementById('messageEnd');
const explication = document.getElementById('explication');
const timerElement = document.getElementById('timer');
const introContainer = document.getElementById ('start');
const quizContainer = document.getElementById ('quiz-container');
const goodAnswerSound = document.getElementById('good_answer');
const wrongAnswerSound = document.getElementById('wrong_answer');
const quizCultureButton = document.getElementById('quiz-culture-btn');
const quizAnimauxButton = document.getElementById('quiz-animaux-btn');
const quizAnatomieButton = document.getElementById('quiz-anatomie-btn');
const quizFootballButton = document.getElementById('quiz-football-btn');
//Variables pour suivre l'état du quiz
let questionIndex = 0;
let score = 0;
let time = 5;
let timerInterval;
let progress = 0;
const endSound = new Audio('/sounds/end_game.wav');
let currentQuiz = null;
buttonNext.style.display = 'none';
// Fonction pour initialiser le quiz en fonction du thème sélectionné
function startQuiz(quizTheme) {
  currentQuiz = quizTheme;
  introContainer.style.display = 'none';
  quizContainer.style.display = 'block';
  buttonNext.style.display = 'inline-block';
  textEnd.style.display = 'none';
  replayButton.style.display = 'none';
  timerElement.style.display = 'inline-block'; // Afficher le timer lors du début du quiz
  document.getElementById("progression").value = 0;
  questionIndex = 0;
  score = 0;
  loadQuestion(); // Charger la première question
}
// Événements pour choisir le thème
quizFootballButton.addEventListener('click', () => startQuiz(quiz_football));
quizAnimauxButton.addEventListener('click', () => startQuiz(quiz_animaux));
quizAnatomieButton.addEventListener('click', () => startQuiz(quiz_anatomie));
quizCultureButton.addEventListener('click', () => startQuiz(quiz_culture_g));
//Fonction pour afficher une question basée sur l'index actuel
  function loadQuestion(){
     // Vider le conteneur des options, pour afficher la premiere question
    answersContainer.innerHTML='';
    // Récupérer la question actuelle, donc variable egal a notre base de donnees et puis notre index
    const currentQuestion = currentQuiz.questions[questionIndex];
    // Inserter la question dans le HTML
    questionsText.innerText = currentQuestion.text;
  //Pour chaque option on crée un boutton et on l'ajoute
  currentQuestion.options.forEach(options => {
    const buttonAnswer = document.createElement('button');
    buttonAnswer.innerText = options;
    buttonAnswer.classList.add('option-button');
    answersContainer.appendChild(buttonAnswer);
// Ajoute l'événement pour vérifier la réponse
    buttonAnswer.addEventListener('click', () => checkAnswer(buttonAnswer, currentQuestion));
    buttonNext.disabled = true;
  });
  startTimer(); // On redémarre le timer à chaque question
}
// Afficher un timer
function startTimer() {
  clearInterval(timerInterval);
  time = 25;
  //  Affichage initial correct en forçant la mise à jour après 1 ms
  setTimeout(() => {
    time--;
    updateTimerDisplay();
  }, 1);
  timerInterval = setInterval(() => {
      if (time <= 0) {
          clearInterval(timerInterval);
          timerElement.innerText = "00:00";
          buttonNext.disabled = false;
          const allButtons = document.querySelectorAll('.option-button');
          allButtons.forEach(btn => btn.disabled = true);
          return;
      }
      time--;
      updateTimerDisplay();
  }, 1000);
}
// Fonction pour mettre à jour l'affichage du timer
function updateTimerDisplay() {
  let minutes = Math.floor(time / 60);
  let secondes = time % 60;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  secondes = secondes < 10 ? "0" + secondes : secondes;
  timerElement.innerText = minutes + ":" + secondes;
}
function growProgression (){
  progress +=10;
  document.getElementById("progression").value = progress;
  document.getElementById("progression").setAttribute("style", "background-color: white; height: 20px; border-radius: 10px; width: " + progress + "%;");
}
buttonNext.addEventListener("click", growProgression);
replayButton.addEventListener("click", progressionzero);
function progressionzero(){
  if( progress >=100){
  progress=0 }
  document.getElementById("progression").value = 0;
  console.log(progress+"progress")
}
// Fonction pour vérifier les réponses des joueurs
function checkAnswer(buttonAnswer, currentQuestion) {
  if (time < 0) return; // Empêche de répondre après la fin du timer
  clearInterval(timerInterval); // Arrêter le timer lorsque l'utilisateur répond
const allButtons = document.querySelectorAll('.option-button');
const userAnswer = buttonAnswer.innerText;
const goodAnswer = currentQuestion.correct_answer;
buttonNext.disabled = false;
if (userAnswer.trim() === goodAnswer.trim()) {
  buttonAnswer.style.border = '3px solid green';
  score++;
  explication.innerHTML = currentQuestion.explication_answer;
  explication.style.display = 'block';
  console.log(score);
  // Jouer le son pour la bonne réponse
  goodAnswerSound.play();
} else {
  buttonAnswer.style.border = '3px solid red';
  explication.innerText = currentQuestion.explication_answer;
  explication.style.display = 'block';
  allButtons.forEach( btn => {
    if (btn.innerText.trim() === goodAnswer.trim()) {
        btn.style.border = '3px solid green';
    }
});
  console.log(explication);
  // Jouer le son pour la mauvaise réponse
  wrongAnswerSound.play();
}
  allButtons.forEach(btn => {
    btn.disabled = true;
  })
  console.log(buttonAnswer.disabled);
  if (buttonAnswer) {
    clearInterval(timerInterval); // Stoppe le timer quand il atteint 0
    buttonNext.disabled = false;
}
}
  // Ajouter un écouteur d'événements pour le bouton "Suivant"
buttonNext.addEventListener('click', () => {
  buttonNext.disabled = true;
  // Incrémenter l'index de la question et le score
  questionIndex++;
  explication.style.display = 'none';
  // Vérifier s'il reste des questions
  if ( questionIndex< currentQuiz.questions.length) {
    // Afficher la question suivante
    loadQuestion();
  } else {
    // Si plus de questions, indiquer la fin du quiz
   reactionFinal(score);
    answersContainer.innerText = ''; // Effacer les options
    questionsText.innerHTML = ''; // Effacer les questions
    buttonNext.style.display = 'none'; // Cacher le bouton Suivant
    replayButton.style.display = 'inline-block'; //on montre le button rejouer
  }
});
//function pour les messages selon le score
function reactionFinal(score) {
  endSound.play();
  textEnd.style.display = 'block';
  timerElement.style.display = 'none';
  document.getElementById("progression").style.display = 'none';
  if (score <= 4) {
    textEnd.innerText = 'Tu peux mieux faire';
  } else if (score >= 5 && score <= 7) {
    textEnd.innerText = 'Bien joué !';
  } else if (score > 7 && score < 10) {  // Modifié ici
    textEnd.innerText = 'Quel as !';
  } else {
    textEnd.innerText = 'Parfait ! Un véritable sans-faute ! ';
    // Jouer la musique de fin
    var end = Date.now() + (15 * 100);
// go Buckeyes!
var colors = ['#BB0000', '#FFFFFF'];
(function frame() {
  confetti({
    particleCount: 2,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors
  });
  confetti({
    particleCount: 2,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors
  });
  if (Date.now() < end) {
    requestAnimationFrame(frame);
  }
}());
  }
}
//ajouter un evenement pour replay
replayButton.addEventListener('click', () => {
  // Masquer l'écran du quiz et afficher l'écran de sélection du thème
  quizContainer.style.display = 'none';
  introContainer.style.display = 'block'; // Affiche l'écran de sélection du thème
  // Réinitialiser l'état du quiz
  questionIndex = 0;
  score = 0;
  // Cacher l'écran de fin et les autres éléments
  textEnd.style.display = 'none';
  timerElement.style.display = 'none'; // Réafficher le timer
  // Réinitialiser les éléments du quiz (comme les options de réponse et la question)
  answersContainer.innerHTML = ''; // Effacer les options de réponse
  questionsText.innerHTML = ''; // Effacer la question
  explication.style.display = 'none'; // Cacher l'explication
  buttonNext.style.display = 'none'; // Cacher le bouton suivant
});
