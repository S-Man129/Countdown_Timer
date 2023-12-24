import { validateForm, getFieldsValue, reset, updateCount } from './util.js'

// Retrieve the user's tasks from local storage
let countdowns = JSON.parse(localStorage.getItem('countdowns')) || [];

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

    const themeDivs = document.querySelectorAll('.theme');

    // Add click event listener to each theme div
    themeDivs.forEach(themeDiv => {
        themeDiv.addEventListener('click', function () {
            // Remove the checkmark from all theme divs
            console.log('Clicked on themeDiv:', themeDiv.dataset.theme);
            themeDivs.forEach(div => {
                const checkmark = div.querySelector('.fa-check');
                if (checkmark) {
                    checkmark.style.display = 'none';
                }
                themeDiv.classList.remove('active'); // Remove 'active' class from all themes
            });

            // Display the checkmark on the clicked theme div
            const checkmark = themeDiv.querySelector('.fa-check');
            if (checkmark) {
                checkmark.style.display = 'block';
            }
            themeDiv.classList.add('active'); // Add 'active' class to the clicked theme

            // const themeValue = themeDiv.dataset.theme;
            // saveThemeColor(countdowns[currentPosition], themeValue);

        });
    });

    addCountToContainer();
});

let currentPosition = -1;

const addCountBtn = document.querySelector('#save-count-button');

addCountBtn.addEventListener('click', function () {
    const isValidated = validateForm();

    if (!isValidated) {
        return;
    }

    console.log('Save button is now working');

    const formValues = getFieldsValue();
    reset();

    const formHead = document.querySelector('.add-countdown-form h2');

    if (!Array.isArray(countdowns)) {
        countdowns = []; // Initialize countdowns as an array if it's not
    }

    if (currentPosition === -1) {
        // If currentPosition is -1, it means we are creating a new countdown
        countdowns.push(formValues);
    } else {
        // If currentPosition is set, it means we are updating an existing countdown
        countdowns[currentPosition] = formValues;
        currentPosition = -1; // Reset currentPosition after updating
        formHead.innerText = 'Add Countdown';
        addCountBtn.innerText = 'Save';
    }

    updateLocalStorage(countdowns);
    addCountToContainer(countdowns);
});

const addCountToContainer = () => {
    const countCardContainer = document.querySelector('.countdown-display-container');
    countCardContainer.innerHTML = '';

    for (let itemPosition = 0; itemPosition < countdowns.length; itemPosition++) {
        const count = countdowns[itemPosition];
        const themeDiv = document.querySelector(`#theme${count.theme}`);
        const themeColor = themeDiv ? getThemeColor(themeDiv.dataset.theme) : '#fff';

        const countCardDisplay = createCountdownCard(countdowns[itemPosition], itemPosition, themeColor);
        countCardContainer.appendChild(countCardDisplay);
    }
};


const createCountdownCard = (countdown, index) => {
    const countdownCard = document.createElement('div');
    countdownCard.setAttribute('class', 'count-card border p-5 rounded-lg flex flex-col');

    // Find the theme div with the 'active' class
    const activeThemeDiv = document.querySelector('.theme.active');
    const themeColor = activeThemeDiv ? getComputedStyle(activeThemeDiv).backgroundColor : '#fff';

    countdownCard.style.backgroundColor = themeColor;

    // console.log('Theme Color:', themeColor); // Log the theme color

    // Save the theme color for the current countdown
    // saveThemeColor(index, theme);


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
        socialMedia.style.display = socialMedia.style.display == 'none' ? 'block' : 'none';

        // Call the share function with countdown data when the Share button is clicked
        shareCountdown(countdown);
    });

    optionMenuShare.appendChild(shareCount);

    optionMenu.appendChild(optionMenuShare);

    const optionMenuEdit = document.createElement('li');
    optionMenuEdit.setAttribute('class', 'option-menu-list cursor-pointer');

    const editCount = document.createElement('a')
    editCount.setAttribute('class', 'px-3 py-2.5 w-36 flex items-center gap-2 hover:bg-gray-500')
    editCount.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Edit`;
    editCount.addEventListener('click', function() {
        updateCount(countdowns[index]);
        currentPosition = index;
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
            countdowns.splice(index,1);
            updateLocalStorage(countdowns);
            addCountToContainer(countdowns);
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

    let countdownType = 'hms';
    const countdownTypeSelector = document.getElementById('fieldCountfor');
    countdownTypeSelector.addEventListener('change', function () {
        countdownType = this.value; // Update countdownType based on the selected option
    });

    const intervalId = setInterval(() => {
    const now = new Date().getTime();
    const targetDate = new Date(`${countdown.dueDate} ${countdown.dueTime}`).getTime();
    const timeRemaining = targetDate - now;

        if (timeRemaining > 0) {
            const countdownTimeDisplay = document.createElement('span');
            countdownTimeDisplay.setAttribute('class', 'text-xl md:text-2xl font-medium self-center text-center');
            
            let countdownText;

            switch (countdownType) {
                case 'hms':
                    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
                    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                    countdownText = `${hours}hr ${minutes}min ${seconds}sec`;
                    break;
                case 'days':
                    const days = (timeRemaining / (1000 * 60 * 60 * 24)).toFixed(1);
                    countdownText = `${days} days`;
                    break;
                case 'months':
                    const months = (timeRemaining / (1000 * 60 * 60 * 24 * 30)).toFixed(1);
                    countdownText = months < 1 ? `${months.replace(/^0/, '.')} months` : `${Math.floor(months)} months`;
                    countdownText = `${months} months`;
                    break;
                case 'years':
                    const years = (timeRemaining / (1000 * 60 * 60 * 24 * 365)).toFixed(1);
                    countdownText = years < 1 ? `${years.replace(/^0/, '.')} years` : `${Math.floor(years)} years`;
                    countdownText = `${years} years`;
                    break;
                default:
                    countdownText = 'Invalid countdown type';
            }

            countdownTimeDisplay.textContent = countdownText;
            countTimeDisplayContainer.innerHTML = ''; // Clear previous content
            countTimeDisplayContainer.appendChild(countdownTimeDisplay);
        } else {
            clearInterval(intervalId);

            const expiredText = document.createElement('span');
            expiredText.setAttribute('class', 'text-xl md:text-2xl font-medium self-center text-center text-red-500');
            expiredText.textContent = 'Countdown expired';

            countTimeDisplayContainer.innerHTML = ''; // Clear previous content
            countTimeDisplayContainer.appendChild(expiredText);
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

function updateLocalStorage(countdowns) {
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
}

// const shareOnTwitter = (text) => {
//     const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
//     openShareWindow(twitterUrl);
// };

// const shareOnLinkedIn = (text) => {
//     const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(text)}`;
//     openShareWindow(linkedInUrl);
// };

// const shareOnFacebook = (text) => {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
//     openShareWindow(facebookUrl);
// };

// const shareOnInstagram = (text) => {
//     // Instagram sharing involves mobile apps and is more complex
//     // You might need to use Instagram API or open the Instagram app with the shared text
//     alert('Instagram sharing not implemented');
// };

// const shareOnWhatsApp = (text) => {
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
//     openShareWindow(whatsappUrl);
// };

// const openShareWindow = (url) => {
//     // Open a new window or redirect to the provided URL
//     window.open(url, '_blank');
// };

const shareCountdown = (countdown) => {
    const socialMedia = document.querySelector('.socialmedia');
    socialMedia.style.display = socialMedia.style.display == 'none' ? 'block' : 'none';

    // Modify your event listeners for social media links
    const twitterLink = document.querySelector('.twitter-link');
    twitterLink.addEventListener('click', function () {
        shareOnTwitter(countdown);
    });

    const linkedinLink = document.querySelector('.linkedin-link');
    linkedinLink.addEventListener('click', function () {
        shareOnLinkedIn(countdown);
    });

    const facebookLink = document.querySelector('.facebook-link');
    facebookLink.addEventListener('click', function () {
        shareOnFacebook(countdown);
    });

    const instagramLink = document.querySelector('.instagram-link');
    instagramLink.addEventListener('click', function () {
        alert('Please manually share the link on Instagram.');
    });

    const whatsappLink = document.querySelector('.whatsapp-link');
    whatsappLink.addEventListener('click', function () {
        shareOnWhatsApp(countdown);
    });
};

const shareOnTwitter = (countdown) => {
    const timeRemaining = getTimeRemaining(countdown);
    const text = encodeURIComponent(`Check out my countdown: ${countdown.countName} - ${timeRemaining}`);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(twitterUrl, '_blank');
};

const shareOnLinkedIn = (countdown) => {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${getCountdownLink(countdown)}`;
    window.open(linkedInUrl, '_blank');
};

const shareOnFacebook = (countdown) => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${getCountdownLink(countdown)}`;
    window.open(facebookUrl, '_blank');
};

const shareOnWhatsApp = (countdown) => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my countdown: ${getCountdownLink(countdown)}`)}`;
    window.open(whatsappUrl, '_blank');
};

const getCountdownLink = (countdown) => {
    // Extract the necessary information from the countdown object
    const countdownName = countdown.countName;
    const countdownTimeRemaining = calculateTimeRemaining(countdown);

    // Construct the link with the countdown name and time remaining
    const link = `https://spindown.com/share?name=${encodeURIComponent(countdownName)}&time=${encodeURIComponent(countdownTimeRemaining)}`;

    return link;
};

const calculateTimeRemaining = (countdown) => {
    const now = new Date().getTime();
    const targetDate = new Date(`${countdown.dueDate} ${countdown.dueTime}`).getTime();
    const timeRemaining = targetDate - now;

    if (timeRemaining > 0) {
        // Calculate hours, minutes, and seconds
        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        // Create a human-readable time remaining string
        return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else {
        return 'Countdown expired';
    }
};



// Modify your event listeners for social media links
// const twitterLink = document.querySelector('.twitter-link').addEventListener('click', function () {
//     // Replace 'yourText' and 'yourHashtags' with the actual text and hashtags you want to share
//     // const text = encodeURIComponent(`Check out my countdown: ${getCountdownLink(yourCountdownData)} #yourHashtags`);
//     // const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
//     // window.open(twitterUrl, '_blank');
// });

// const linkedinLink = document.querySelector('.linkedin-link').addEventListener('click', function () {
//     // const linkedinUrl = `https://www.linkedin.com/shareArticle?url=${getCountdownLink(yourCountdownData)}`;
//     // window.open(linkedinUrl, '_blank');
// });

// const facebookLink = document.querySelector('.facebook-link').addEventListener('click', function () {
//     const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${getCountdownLink(yourCountdownData)}`;
//     window.open(facebookUrl, '_blank');
// });

// const instagramLink = document.querySelector('.instagram-link').addEventListener('click', function () {
//     // Instagram does not support sharing links programmatically due to security restrictions
//     // You can show a message to the user to manually share the link on Instagram
//     alert('Please manually share the link on Instagram.');
// });

// const whatsappLink = document.querySelector('.whatsapp-link').addEventListener('click', function () {
//     const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my countdown: ${getCountdownLink(yourCountdownData)}`)}`;
//     window.open(whatsappUrl, '_blank');
// });


// const shareOnTwitter = (countdown) => {
//     const timeRemaining = getTimeRemaining(countdown);
//     const text = encodeURIComponent(`Check out my countdown: ${countdown.countName} - ${timeRemaining}`);
//     const twitterUrl = `https://twitter.com/intent/tweet?text=${text}`;
//     window.open(twitterUrl, '_blank');
// };
