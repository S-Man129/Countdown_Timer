//util.js

const countDateInput = document.querySelector('#fieldDate');
const countTimeInput = document.querySelector('#fieldTime');
const countTitleInput = document.querySelector('#fieldTitle');
const countDescriptionInput = document.querySelector('#fieldDescription');
const countPeriodSelect = document.querySelector('#fieldCountfor');

const currentDate = new Date().toISOString().split('T')[0];
countDateInput.min = currentDate;

const addCountBtn = document.querySelector('#save-count-button');

const validateForm = () => {
    
    const countDate = countDateInput.value;
    const countTime = countTimeInput.value;
    const countTitle = countTitleInput.value;      
    const countDescription = countDescriptionInput.value;
    const countPeriod = countPeriodSelect.value;
    
    
    if (!countDate || !countTitle || !countTime || countPeriod === " " || !countDescription) {
        alert ("Please fill in all necessary fields.");
        return false;    
    } 

    return true;
};

const getFieldsValue = () => {
    const countdownId = generateUniqueId();
    const dueDate = countDateInput.value;
    const countName = countTitleInput.value.trim();    
    const dueTime = countTimeInput.value;
    const description = countDescriptionInput.value;
    const countFor = countPeriodSelect.value;
    const themeSelect = document.querySelector('.theme:checked');
    const themeValue = themeSelect ? themeSelect.value : "defaultTheme"; // Assuming "default" is your default theme


    return {
        id: countdownId, countName, dueDate, dueTime, countFor, description, themeValue
    }
};

const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
}

const reset = () => {
    // countId = null;
    countTitleInput.value = '';
    countDateInput.value = '';
    countTimeInput.value = '';
    countPeriodSelect.value = '';
    countDescriptionInput.value = '';
}

function updateCount(count) {
    const countformHead = document.querySelector('.add-countdown-form h2');
    countformHead.innerText = 'Edit Countdown';
    // modal.style.display = 'block';
    addCountBtn.innerText = 'Save changes';

    // Populate the input fields with the countdown data for editing
    document.getElementById('fieldDate').value = count.dueDate;
    document.getElementById('fieldTime').value = count.dueTime;
    document.getElementById('fieldTitle').value = count.countName;
    document.getElementById('fieldDescription').value = count.description;
    document.getElementById('fieldCountfor').value = count.countFor;
    
}

export { validateForm, getFieldsValue, reset, updateCount };
