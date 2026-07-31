const survey = document.querySelector('#survey');
const playerName = survey?.querySelector('input[name="name"]')?.value || 'guest';
const draftKey = `survey-egypt-draft-${playerName.toLowerCase()}`;
const completedCards = new Set();
const balance = document.querySelector('#potential-balance');
const consentButton = document.querySelector('#consent-button');
const surveyContent = document.querySelector('#survey-content');

let draft = {};
try { draft = JSON.parse(sessionStorage.getItem(draftKey) || '{}'); } catch { draft = {}; }

const updateBalance = () => {
  if (!balance) return;
  balance.textContent = [...completedCards].reduce((sum, card) => sum + Number(card.dataset.reward), 0);
};

const saveDraft = () => {
  if (!survey) return;
  const values = {};
  survey.querySelectorAll('textarea, input[name="phone"]').forEach((field) => { values[field.name] = field.value; });
  sessionStorage.setItem(draftKey, JSON.stringify({
    values,
    completed: [...completedCards].map((card) => card.querySelector('textarea').name),
    consented: !surveyContent?.hidden,
  }));
};

document.querySelectorAll('textarea').forEach((field) => {
  const card = field.closest('.question-card');
  const count = card.querySelector('.char-note span');
  const button = card.querySelector('.complete-answer');
  if (draft.values?.[field.name]) field.value = draft.values[field.name];

  const refreshCard = (resetCompletion = false) => {
    const ready = field.value.trim().length >= Number(field.dataset.min);
    count.textContent = field.value.trim().length;
    button.disabled = !ready;
    if (resetCompletion && card.classList.contains('is-complete')) {
      card.classList.remove('is-complete');
      completedCards.delete(card);
      updateBalance();
    }
  };

  field.addEventListener('input', () => { refreshCard(true); saveDraft(); });
  refreshCard();
  if (draft.completed?.includes(field.name) && !button.disabled) {
    card.classList.add('is-complete');
    completedCards.add(card);
  }
  button.addEventListener('click', () => {
    if (button.disabled) return;
    card.classList.add('is-complete');
    completedCards.add(card);
    updateBalance();
    saveDraft();
  });
});
updateBalance();

const phone = survey?.querySelector('input[name="phone"]');
if (phone) {
  if (draft.values?.[phone.name]) phone.value = draft.values[phone.name];
  phone.addEventListener('input', saveDraft);
}

const showSurvey = (focus = false) => {
  if (!surveyContent || !consentButton) return;
  surveyContent.hidden = false;
  consentButton.closest('#consent-notice').classList.add('accepted');
  if (focus) {
    surveyContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    surveyContent.querySelector('textarea')?.focus();
  }
  saveDraft();
};
if (draft.consented) showSurvey();
consentButton?.addEventListener('click', () => showSurvey(true));

survey?.addEventListener('submit', (event) => {
  const cards = document.querySelectorAll('.question-card');
  if (completedCards.size !== cards.length) {
    event.preventDefault();
    document.querySelector('.question-card:not(.is-complete)')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    alert('من فضلك اضغط «خلصت» بعد الانتهاء من كل سؤال.');
    return;
  }
  sessionStorage.removeItem(draftKey);
});
