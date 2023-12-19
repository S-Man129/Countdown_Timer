import { validateForm, getFieldsValue, reset, updateCount } from './util.js'

// Retrieve the user's tasks from local storage
const existingCountdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
const countCard = existingCountdowns;

// itemsArray[countId] = formvalues;

document.addEventListener('DOMContentLoaded', function () {
    const countformHead = document.querySelector('.add-countdown-form h2');
    
    document.querySelectorAll('.overlapping-input').forEach(function(overlappingInput) {
        overlappingInput.addEventListener('focus', function () {
            this.setAttribute('placeholder', ' '); 
        });
        
          overlappingInput.addEventListener('blur', function () {
            if (!this.value) {
              this.setAttribute('placeholder', ''); 
            }
        });
    });
    

    const toggle = document.getElementById('toggle');

    toggle.addEventListener('change', function () {
        if (this.checked) {
            toggle.classList.add('translate-x-full');
            document.body.classList.add('bg-slate-900'); // Change background color when toggle is checked
            countformHead.classList.remove('text-spin-black')
            countformHead.classList.add('text-spin-white')
        } else {
            document.body.classList.remove('bg-slate-900'); // Reset background color when toggle is unchecked
            toggle.classList.remove('translate-x-full');
            countformHead.classList.add('text-spin-black')
            countformHead.classList.remove('text-spin-white')
        }
    });


    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');

    hamburgerBtn.addEventListener('click', function () {
      sidebar.classList.toggle('sidebar-expanded');
    });

    closeSidebar.onclick = function() {
        sidebar.classList.remove('sidebar-expanded');
    }

    // Close the sidebar when clicking outside of it
    document.addEventListener('click', function (event) {
      const isClickInsideSidebar = sidebar.contains(event.target);
      const isClickOnHamburger = hamburgerBtn.contains(event.target);

      if (!isClickInsideSidebar && !isClickOnHamburger) {
        sidebar.classList.remove('sidebar-expanded');
      }
    });

    const createCountBtn2 = document.querySelector('.create-count-button2');
    const addCountdownForm = document.querySelector('.add-countdown-form');
    const close = document.getElementsByClassName("close")[0];

    createCountBtn2.onclick = function(event) {
        addCountdownForm.setAttribute('id', 'add-countdown-form-modal');
        addCountdownForm.style.display = 'block';
        event.stopPropagation();
    }

    close.onclick = function() {
        addCountdownForm.style.display = 'none';
    }

    addCountToContainer();
});

let currentPosition = -1;

const addCountBtn = document.querySelector('#save-count-button');

addCountBtn.addEventListener('click', function () {
    handleSave('countdowns');
});

function handleSave(itemType) {
    const isValidated = validateForm();

    if (!isValidated) {
        return;
    }

    console.log('Save button is now working');

    const formValues = getFieldsValue();
    reset();

    const formHead = document.querySelector('.add-countdown-form h2');
    const itemsArray = itemType === 'countdowns' ? existingCountdowns : [];

    if (!formValues.theme){
        formValues.theme = '#ccc';
    }

    if (currentPosition === -1) {
        // If currentPosition is -1, it means we are creating a new countdown
        itemsArray.push(formValues);
    } else {
        // If currentPosition is set, it means we are updating an existing countdown
        itemsArray[currentPosition] = formValues;
        currentPosition = -1; // Reset currentPosition after updating
        formHead.innerText = 'Add Countdown';
        addCountBtn.innerText = 'Save';
    }

    updateLocalStorage(itemType);

    // Call the appropriate function to add the item to the container
    if (itemType === 'countdowns') {
        addCountToContainer();
    }
}


const addCountToContainer = () => {
    const countCardContainer = document.querySelector('.countdown-display-container');
    countCardContainer.innerHTML = '';
    
    for (const countId in existingCountdowns){
        const count = existingCountdowns[countId];

        if (!count.theme){
            count.theme = 'defaultTheme';
        }
        const countCardDisplay = createCountdownCard(count);
        countCardContainer.appendChild(countCardDisplay);
    }
}

// function selectTheme(color, themeName) {
//     // Remove checkmark from previously selected theme
//     document.querySelectorAll('.fa-check').forEach(mark => mark.style.display = 'none');

//     // Apply the selected theme color to your countdown card background
//     countdownCard.style.backgroundColor = color;

//     // Show checkmark on the selected theme
//     const checkmark = document.querySelector('#${themeName} .fa-check');
//     checkmark.style.display = 'block';

//     // Log the selected theme
//     console.log('Selected Theme:', themeName);
// }

const createCountdownCard = (countdown) => {
    const countdownCard = document.createElement('div');
    countdownCard.setAttribute('class', 'count-card border p-5 rounded-lg flex flex-col');

    const themeColor = getThemeClass(countdown.theme);

    if (themeColor) {
        countdownCard.style.backgroundColor = themeColor;
        console.log('Selected theme:', countdown.theme);
    } else {
        console.error('Invalid theme:', countdown.theme);
        countdownCard.style.backgroundColor = '#ccc';
    }
    // countdownCard.style.backgroundColor = getThemeClass(countdown.themeSelect);

    const countCardHead = document.createElement('div');
    countCardHead.setAttribute('class', 'flex justify-between items-center');

    const countHeadTitle = document.createElement('h3');
    countHeadTitle.setAttribute('class', 'count-title text-lg sm:text-xl font-medium');
    countHeadTitle.textContent = countdown.countName;

    countCardHead.appendChild(countHeadTitle);

    const countCardOption = document.createElement('div');
    countCardOption.setAttribute('class', 'relative');

    const optionBtn = document.createElement('button');
    optionBtn.setAttribute('class', 'p-1.5');
    optionBtn.setAttribute('id', 'threeDotBtn');
    optionBtn.innerHTML = 
        `<span class="block w-1 h-1 rounded-full bg-gray-800"></span>
        <span class="block w-1 h-1 rounded-full bg-gray-800 mt-1"></span>
        <span class="block w-1 h-1 rounded-full bg-gray-800 mt-1"></span>`;

    countCardOption.appendChild(optionBtn);

    const optionMenu = document.createElement('ul');
    optionMenu.setAttribute('role', 'list');
    optionMenu.setAttribute('class', 'option-menu hidden flex flex-col divide-y divide-slate-200 bg-gray-400 text-white absolute top-0 right-4 rounded-md border text-md');

    const optionMenuShare = document.createElement('li');
    optionMenuShare.setAttribute('class', 'option-menu-list cursor-pointer');

    const shareCount = document.createElement('a')
    shareCount.setAttribute('class', 'px-3 py-2.5 w-36 flex items-center gap-2 hover:bg-gray-500')
    shareCount.innerHTML = `<i class="fa-solid fa-share-nodes"></i> Share`;
    shareCount.addEventListener('click', function () {
        const socialMedia = document.querySelector('.socialmedia');
        // socialMedia.style.display = 'block';
        // Call the share function with countdown data
        // shareCountdown(countdown);
    });

    optionMenuShare.appendChild(shareCount);

    optionMenu.appendChild(optionMenuShare);

    const optionMenuEdit = document.createElement('li');
    optionMenuEdit.setAttribute('class', 'option-menu-list cursor-pointer');

    const editCount = document.createElement('a')
    editCount.setAttribute('class', 'px-3 py-2.5 w-36 flex items-center gap-2 hover:bg-gray-500')
    editCount.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Edit`;
    editCount.addEventListener('click', function() {
        updateCount(countdown);
    });
    optionMenuEdit.appendChild(editCount);

    optionMenu.appendChild(optionMenuEdit);

    const optionMenuDelete = document.createElement('li');
    optionMenuDelete.setAttribute('class', 'option-menu-list cursor-pointer');

    const deleteCount = document.createElement('a')
    deleteCount.setAttribute('class', 'px-3 py-2.5 w-36 flex items-center gap-2 hover:bg-gray-500')
    deleteCount.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> Delete`;
    deleteCount.addEventListener('click', function() {
        const confirmDelete = confirm('Are you sire you want to delete this countdown');

        if (confirmDelete){
            const updatedCountdowns = existingCountdowns.filter((count) => count.dueDate !== countdown.dueDate);
            localStorage.setItem('countdowns', JSON.stringify(updatedCountdowns));
        }
    });
    optionMenuDelete.appendChild(deleteCount);

    optionMenu.appendChild(optionMenuDelete);

    countCardOption.appendChild(optionMenu);

    optionBtn.addEventListener('click', function(event) {
        console.log('You clicked the option button');
        optionMenu.style.display = 'block';
        event.stopPropagation();
    });

    document.body.addEventListener('click', function() {
        optionMenu.style.display = 'none';
    });

    countCardHead.appendChild(countCardOption);

    countdownCard.appendChild(countCardHead);

    const countDate = document.createElement('div');
    countDate.setAttribute('class', 'count-set-date text-sm sm:text-base');
    countDate.textContent = countdown.dueDate;

    countdownCard.appendChild(countDate);

    const countTimeDisplayContainer = document.createElement('div');
    countTimeDisplayContainer.setAttribute('class', 'count-time-display mt-5 mx-auto flex justify-center item-center bg-white w-28 h-28 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full border border-black')
    
    const countdownTimeDisplay = document.createElement('span');
    countdownTimeDisplay.setAttribute('class', 'text-xl md:text-2xl font-medium self-center text-center');
    
    const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const targetDate = new Date(`${countdown.dueDate} ${countdown.dueTime}`).getTime();
        const timeRemaining = targetDate - now;

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            countdownTimeDisplay.textContent = 'Countdown expired';
        } else {
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            const formattedDays = days < 10 ? days.toFixed(1).replace(/^0/, '.') : days;
            const formattedHours = hours < 10 ? '0' + hours : hours;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

            const formattedTime = `${formattedDays} days ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;

            countdownTimeDisplay.textContent = formattedTime;
        }
    }, 1000);

    countTimeDisplayContainer.appendChild(countdownTimeDisplay);
    countdownCard.appendChild(countTimeDisplayContainer);

    const countdownNote = document.createElement('div');
    countdownNote.setAttribute('class', 'mt-5 countdown-note text-justify text-base')
    countdownNote.textContent = countdown.description;

    countdownCard.appendChild(countdownNote);

    return countdownCard;
}  

function updateLocalStorage() {
    localStorage.setItem('countdowns', JSON.stringify(existingCountdowns));
}

function getThemeClass(themeValue) {
    switch (themeValue) {
      case "theme1":
        return "bg-gray-500"; // Replace with the actual class for theme1
      case "theme2":
        return "bg-green-500"; // Replace with the actual class for theme2
      case "theme3":
        return "bg-blue-500"; // Replace with the actual class for theme3
      case "theme4":
        return "bg-orange-500"; // Replace with the actual class for theme4
      case "theme5":
        return "bg-purple-500"; // Replace with the actual class for theme5
      default:
        return "#fff"; // Default class if no theme is specified
    }
};

