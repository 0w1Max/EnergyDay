import { dictionary } from "./lang.js";
import { lock } from "./utils.js";

const langSelect = document.getElementById('lang');
const energyTitle = document.querySelector('.energy__title');
const energyProgress = document.querySelector('.energy__progress');
const infoPercent = document.querySelector('.info__percent');
const energyButton = document.querySelector('.energy__button');

let PROGRESS_DATA = 0;
const STEP = 5;

const COLORS = {
  red: 'linear-gradient(90deg, #ff7c7c, #ff4d4d)',
  orange: 'linear-gradient(90deg, #ffc97c, #ff9900)',
  green: 'linear-gradient(90deg, #77ff7c, #4caf50)',
}

function langHandler(evt) {
  const lang = evt.target.value;

  energyTitle.textContent = dictionary[lang].title;
  energyButton.textContent = dictionary[lang].button;
}

function increaseProgress(step) {
  PROGRESS_DATA = Math.max(0, Math.min(PROGRESS_DATA + step, 100))
}

function decreaseProgress(step) {
  PROGRESS_DATA = Math.min(100, Math.max(PROGRESS_DATA - step, 0))
}

function resetProgress() {
  PROGRESS_DATA = 0
}

function updateAriaProgress(view) {
  view.setAttribute("aria-valuenow", PROGRESS_DATA)
}

function updateProgressColor(view) {
  let gradient;

  if (PROGRESS_DATA <= 33) {
    gradient = COLORS.red
  } else if (PROGRESS_DATA <= 66) {
    gradient = COLORS.orange
  } else {
    gradient = COLORS.green
  }

  view.style.background = gradient;
}

function updateButtonState(button) {
  if (PROGRESS_DATA >= 100) {
    button.disabled = true;
    button.classList.add("button--disabled");
  } else {
    button.disabled = false;
    button.classList.remove("button--disabled");
  }
}

function renderProgress(view, text) {
  view.style.width = `${PROGRESS_DATA}%`;
  text.textContent = `${PROGRESS_DATA}%`;

  updateAriaProgress(view);
  updateProgressColor(view);
  updateButtonState(energyButton);
}

function animateDecrease(step = 1, interval = 20) {
  const timer = setInterval(() => {
    decreaseProgress(step);
    renderProgress(energyProgress, infoPercent);

    if (PROGRESS_DATA <= 0) {
      clearInterval(timer)
    }
  }, interval);
}

function buttonHandler(evt) {
  evt.preventDefault();

  increaseProgress(STEP);
  renderProgress(energyProgress, infoPercent);

  if (PROGRESS_DATA === 100) {
    console.log('Fully charged');
    
    setTimeout(function() {
      animateDecrease()
  }, 3000);
  }
}

const safeCharge = lock(buttonHandler, 300);

renderProgress(energyProgress, infoPercent);

langSelect.addEventListener('change', langHandler);
energyButton.addEventListener('click', safeCharge);
