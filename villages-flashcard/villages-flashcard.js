// --- CONSTANTS / ELEMENTS ---
const radioButtons = document.querySelectorAll('input[name="opportunity"]');
const saveBtn = document.querySelector('.form-btn');

const providerSection = document.getElementById('Provider');
const seekerSection = document.getElementById('Seeker');

const providerFieldset = providerSection.querySelector('fieldset');
const seekerFieldset = seekerSection.querySelector('fieldset');

const providerCards = providerSection.querySelectorAll('.provider-card');
const providerCheckboxes = providerSection.querySelectorAll('input[type="checkbox"]');
const providerJoinBtn = providerSection.querySelector('.provider-btn');

const seekerCards = seekerSection.querySelectorAll('.provider-card');
const seekerCheckboxes = seekerSection.querySelectorAll('input[type="checkbox"]');
const seekerJoinBtn = seekerSection.querySelector('.seeker-btn');

// --- INITIAL STATE ---
saveBtn.disabled = true;
providerSection.style.display = 'none';
seekerSection.style.display = 'none';
providerFieldset.disabled = true;
seekerFieldset.disabled = true;
providerJoinBtn.disabled = true;
seekerJoinBtn.disabled = true;

// --- STEP 1: Radio selection enables Save ---
radioButtons.forEach(radio => {
    radio.addEventListener('change', () => {
        saveBtn.disabled = false;
    });
});

// --- STEP 2: Save button activates section based on selection ---
saveBtn.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="opportunity"]:checked');
    if (!selectedRadio) return;

    if (selectedRadio.value === "Opportunity Provider") {
        providerSection.style.display = 'block';
        seekerSection.style.display = 'none';
        providerFieldset.disabled = false;
        seekerFieldset.disabled = true;
        updateJoinBtnState(providerCheckboxes, providerJoinBtn);
    } else if (selectedRadio.value === "Oppurtunity Seeker") {
        providerSection.style.display = 'none';
        seekerSection.style.display = 'block';
        providerFieldset.disabled = true;
        seekerFieldset.disabled = false;
        updateJoinBtnState(seekerCheckboxes, seekerJoinBtn);
    }
});

// --- STEP 3: Card click toggles checkbox and selected class ---
function setupCards(cards, checkboxes, fieldset, joinBtn) {
    cards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (fieldset.disabled) return;
            checkboxes[index].checked = !checkboxes[index].checked;
            card.classList.toggle('selected', checkboxes[index].checked);
            updateJoinBtnState(checkboxes, joinBtn);
        });

        checkboxes[index].addEventListener('change', () => {
            card.classList.toggle('selected', checkboxes[index].checked);
            updateJoinBtnState(checkboxes, joinBtn);
        });
    });
}

// --- STEP 4: Enable Join button if at least one checkbox selected ---
function updateJoinBtnState(checkboxes, joinBtn) {
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    joinBtn.disabled = !anyChecked;
}

// Setup card selection
setupCards(providerCards, providerCheckboxes, providerFieldset, providerJoinBtn);
setupCards(seekerCards, seekerCheckboxes, seekerFieldset, seekerJoinBtn);

// --- STEP 5: Join Selected Villages buttons redirect ---
providerJoinBtn.addEventListener('click', () => {
    if (!providerJoinBtn.disabled) window.location.href = '../global-feed/global-feed.html';
});
seekerJoinBtn.addEventListener('click', () => {
    if (!seekerJoinBtn.disabled) window.location.href = '../global-feed/global-feed.html';
});
