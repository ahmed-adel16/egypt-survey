const completedCards = new Set();
const balance = document.querySelector('#potential-balance');
const updateBalance = () => {
  const total = [...completedCards].reduce((sum, card) => sum + Number(card.dataset.reward), 0);
  balance.textContent = total;
};

document.querySelectorAll('textarea').forEach((field) => {
  const count = field.parentElement.querySelector('.char-note span');
  const card = field.closest('.question-card');
  const button = card.querySelector('.complete-answer');
  const update = () => {
    const isReady = field.value.trim().length >= Number(field.dataset.min);
    count.textContent = field.value.trim().length;
    button.disabled = !isReady;
    if (card.classList.contains('is-complete')) {
      card.classList.remove('is-complete');
      completedCards.delete(card);
      updateBalance();
    }
  };
  field.addEventListener('input', update); update();
  button.addEventListener('click', () => {
    if (button.disabled) return;
    card.classList.add('is-complete');
    completedCards.add(card);
    updateBalance();
  });
});

document.querySelector('#survey')?.addEventListener('submit', (event) => {
  const cards = document.querySelectorAll('.question-card');
  if (completedCards.size !== cards.length) {
    event.preventDefault();
    document.querySelector('.question-card:not(.is-complete)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    alert('من فضلك اضغط «خلصت» بعد الانتهاء من كل سؤال.');
  }
});

const consentButton = document.querySelector('#consent-button');
const surveyContent = document.querySelector('#survey-content');
if (consentButton && surveyContent) {
  consentButton.addEventListener('click', () => {
    surveyContent.hidden = false;
    consentButton.closest('#consent-notice').classList.add('accepted');
    surveyContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    surveyContent.querySelector('textarea')?.focus();
  });
}
