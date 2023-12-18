//app.js

import { validateForm, getFieldsValue, reset, updateCount } from "./util.js";
import { createCountdownCard } from "./countdownCard.js";

class Countdown {
    constructor(countdownData) {
        this.data = countdownData;
        this.displayContainer = document.querySelector('.countdown-display-container');

        displayCountdowns();
    }

    startCountdown() {
        // Access the countdown due date and time from this.data
        const targetDate = new Date(this.data.dueDate + 'T' + this.data.dueTime).getTime();

        // Update the countdown display every second
        const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const timeRemaining = targetDate - now;

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            this.updateCountdownDisplay('Countdown expired');
        } else {
            // Calculate days, hours, minutes, and seconds
            const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            // Format the time remaining
            const formattedDays = days < 10 ? days.toFixed(1).replace(/^0/, '.') : days;
            const formattedHours = hours < 10 ? '0' + hours : hours;
            const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

            const formattedTime = `${formattedDays} days ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;

            // Update the countdown display
            this.updateCountdownDisplay(formattedTime);
            }
        }, 1000); // Update every second
    }
}

const addCountBtn = document.querySelector('#save-count-button');

addCountBtn.addEventListener('click', function () {
    const isValidated = validateForm();

    if (!isValidated) {
        return;
    }

    console.log('Your clicked the save countdown button');

    const formValues = getFieldsValue();
    reset();

    const existingCountdowns = JSON.parse(localStorage.getItem('countdowns')) || [];
    const isEdit = addCountBtn.innerText === 'Save changes';

    const countdown = new Countdown(formValues);

    if (isEdit) {
        // Update existing countdown
        const editedCountdownIndex = existingCountdowns.findIndex((count) => count.countName === formValues.countName);
        existingCountdowns[editedCountdownIndex] = formValues;
    } else {
        // Save new countdown
        existingCountdowns.push(formValues);
    }

    localStorage.setItem('countdowns', JSON.stringify(existingCountdowns));
    countdown.startCountdown();
    displayCountdowns();
});

document.addEventListener('DOMContentLoaded', function () {
    const countdownDisplayContainer = document.querySelector('.countdown-display-container');
    
    document.querySelectorAll('.overlapping-input').forEach(function(overlappingInput){
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
        } else {
            document.body.classList.remove('bg-slate-900'); // Reset background color when toggle is unchecked
            toggle.classList.remove('translate-x-full');
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

    const createCountBtn = document.querySelector('.create-count-button2');
    const addCountdownForm = document.querySelector('.add-countdown-form');
    const close = document.getElementsByClassName("close")[0];

    createCountBtn.onclick = function(event) {
        addCountdownForm.setAttribute('id', 'add-countdown-form-modal');
        addCountdownForm.style.display = 'block';
        event.stopPropagation();
    }

    close.onclick = function() {
        addCountdownForm.style.display = 'none';
    }

    displayCountdowns(countdownDisplayContainer);
});

const displayCountdowns = (countdownDisplayContainer) => {
    const existingCountdowns = JSON.parse(localStorage.getItem('countdowns')) || [];

    existingCountdowns.forEach((countdown) => {
        const countdownCard = createCountdownCard(countdown);
        countdownDisplayContainer.appendChild(countdownCard);
    });
};


