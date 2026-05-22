const questions = [
  {
    sentence: 'The biggest state in population is ',
    options: ['Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra'],
    answer: 'Uttar Pradesh',
  },
  {
    sentence: 'The largest glacier is ',
    options: ['Siachen Glacier', 'Gangotri Glacier', 'Yamunotri Glacier'],
    answer: 'Siachen Glacier',
  },
  {
    sentence: 'The biggest desert is ',
    options: ['Gobi Desert', 'Sahara Desert', 'Arabian Desert'],
    answer: 'Sahara Desert',
  },
  {
    sentence: 'The highest brick tower is ',
    options: ['Chand Minar', 'Charminar', 'Qutub Minar'],
    answer: 'Qutub Minar',
  },
  {
    sentence: 'The biggest gurudwara is ',
    options: ['Harmandir Sahib', 'Golden Temple', 'Durgiana Temple'],
    answer: 'Golden Temple',
  },
];

const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const questionSentence = document.getElementById('questionSentence');
const answerInput = document.getElementById('answerInput');
const optionsPanel = document.getElementById('optionsPanel');
const feedbackText = document.getElementById('feedbackText');
const progressText = document.getElementById('progressText');
const finalMessage = document.getElementById('finalMessage');
const scoreText = document.getElementById('scoreText');
const reviewList = document.getElementById('reviewList');
const playAgainButton = document.getElementById('playAgainButton');
const confettiContainer = document.getElementById('confettiContainer');

let currentIndex = 0;
let score = 0;
let audioContext;

function startQuiz() {
  currentIndex = 0;
  score = 0;
  resultCard.classList.add('hidden');
  quizCard.classList.remove('hidden');
  feedbackText.textContent = '';
  answerInput.value = '';
  answerInput.placeholder = 'Tap for options';
  answerInput.setAttribute('aria-expanded', 'false');
  optionsPanel.classList.add('hidden');
  quizCard.classList.remove('correct-state', 'wrong-state');
  showQuestion();
}

function showQuestion() {
  const currentQuestion = questions[currentIndex];
  questionSentence.textContent = currentQuestion.sentence;
  progressText.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  feedbackText.textContent = '';
  answerInput.value = '';
  answerInput.classList.remove('input-wrong', 'input-correct');
  answerInput.placeholder = 'Tap for options';
  answerInput.setAttribute('aria-expanded', 'false');
  optionsPanel.classList.add('hidden');
  optionsPanel.innerHTML = '';

  currentQuestion.options.forEach((option) => {
    const optionButton = document.createElement('button');
    optionButton.type = 'button';
    optionButton.className = 'option-item';
    optionButton.textContent = option;
    optionButton.dataset.value = option;
    optionButton.addEventListener('click', () => selectAnswer(optionButton));
    optionsPanel.appendChild(optionButton);
  });

  quizCard.classList.add('fade-in');
  setTimeout(() => quizCard.classList.remove('fade-in'), 450);
}

function openOptions() {
  optionsPanel.classList.remove('hidden');
  answerInput.setAttribute('aria-expanded', 'true');
}

function selectAnswer(optionButton) {
  const selected = optionButton.dataset.value;
  answerInput.value = selected;
  const currentQuestion = questions[currentIndex];

  if (selected === currentQuestion.answer) {
    showCorrectFeedback();
  } else {
    showWrongFeedback(optionButton);
  }
}

function showCorrectFeedback() {
  feedbackText.textContent = 'Great job! 🌈';
  quizCard.classList.remove('wrong-state');
  quizCard.classList.add('correct-state');
  optionsPanel.classList.add('hidden');
  answerInput.setAttribute('aria-expanded', 'false');
  applyCorrectInputState();
  playSuccessSound();
  createConfetti();

  setTimeout(() => {
    quizCard.classList.remove('correct-state');
    answerInput.classList.remove('input-correct');
    currentIndex += 1;

    if (currentIndex < questions.length) {
      score += 1;
      showQuestion();
    } else {
      score += 1;
      showResults();
    }
  }, 1000);
}

function showWrongFeedback(optionButton) {
  feedbackText.textContent = 'Try again! ❌';
  quizCard.classList.remove('correct-state');
  quizCard.classList.add('wrong-state');
  answerInput.classList.add('input-wrong');
  playWrongSound();

  optionButton.classList.add('option-wrong');
  setTimeout(() => {
    quizCard.classList.remove('wrong-state');
    optionButton.classList.remove('option-wrong');
  }, 400);
}

function applyCorrectInputState() {
  answerInput.classList.remove('input-wrong');
  answerInput.classList.add('input-correct');
}

function showResults() {
  quizCard.classList.add('hidden');
  resultCard.classList.remove('hidden');
  finalMessage.textContent = score >= 4 ? 'Amazing! You are a quiz star!' : 'Great effort! Keep learning!';
  scoreText.textContent = `You answered ${score} out of ${questions.length} correctly.`;
  reviewList.innerHTML = '';

  questions.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'review-item';
    listItem.innerHTML = `
      <span class="review-question">${index + 1}. ${item.sentence}</span>
      <span class="review-answer">${item.answer}</span>
    `;
    reviewList.appendChild(listItem);
  });
}

function createConfetti() {
  const colors = ['#ff60b5', '#6af28e', '#3cc1ff', '#ff9e42', '#fff66c'];
  const count = 22;

  for (let i = 0; i < count; i += 1) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti-piece';
    const size = Math.random() * 12 + 10;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 0.32}px`;
    confetti.style.left = `${Math.random() * 85 + 5}%`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.setProperty('--confetti-duration', `${Math.random() * 1.2 + 1.2}s`);
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confettiContainer.appendChild(confetti);

    confetti.addEventListener('animationend', () => {
      confetti.remove();
    });
  }
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency, duration, type = 'triangle') {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.12;

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
}

function playSuccessSound() {
  playTone(880, 0.12);
  setTimeout(() => playTone(1040, 0.1), 120);
}

function playWrongSound() {
  playTone(220, 0.18, 'square');
  setTimeout(() => playTone(180, 0.12, 'square'), 140);
}

answerInput.addEventListener('click', openOptions);
playAgainButton.addEventListener('click', startQuiz);
startQuiz();
