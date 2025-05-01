let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let numberOfQuestions = 10;
let answered = false;

function shuffle(oldArray) {
  let array = [...oldArray];
  let currentIndex = array.length;

  while (currentIndex != 0) {

    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function loadQuestions() {
  const bucketSelect = document.getElementById('bucket-select');
  const file = bucketSelect ? bucketSelect.value : 'questions.json';

  const res = await fetch(file);
  const data = await res.json();
  questions = data.questions;
}

async function startQuiz() {
  await loadQuestions();

  const select = document.getElementById('num-questions');
  numberOfQuestions = select.value === 'all' ? questions.length : parseInt(select.value);
  questions = questions.sort(() => Math.random() - 0.5).slice(0, numberOfQuestions);

  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('question-screen').classList.remove('hidden');

  showQuestion();
}

function showQuestion() {
  answered = false;
  const question = questions[currentQuestionIndex];
  document.getElementById('question-text').innerText = question.question;

  document.getElementById('progress-text').innerText = `Domanda ${currentQuestionIndex + 1}/${questions.length}`;

  const optionsContainer = document.getElementById('options-container');
  optionsContainer.innerHTML = '';

  const answer = question.options[0];
  
  shuffle(question.options).forEach(option => {
    const button = document.createElement('button');
    button.dataset.correct = answer === option;
    button.className = 'option-btn';
    button.innerText = option;
    button.onclick = () => selectAnswer(button, option);
    optionsContainer.appendChild(button);
  });
}

function selectAnswer(button, selectedOption) {
  if (answered) return; // Evita multipli click

  answered = true;
  if (button.dataset.correct === "true") correctAnswers++;

  const question = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.option-btn');

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.correct === "true") {
      btn.classList.add('correct'); // Verde su corretta
    } else if (btn.innerText === selectedOption) {
      btn.classList.add('wrong'); // Rosso su errore
    }
  });
}

function nextQuestion() {
  if (!answered) {
    alert('Seleziona una risposta!');
    return;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  document.getElementById('question-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');

  document.getElementById('score-text').innerText = `Hai risposto correttamente a ${correctAnswers} su ${questions.length} domande!`;
}
