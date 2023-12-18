// countdownCard.js
import { updateCount, shareCountdown } from "./util.js";

const createCountdownCard = (countdown, existingCountdowns) => {
    const countdownCard = document.createElement('div');
    countdownCard.setAttribute('class', 'count-card bg-gray-300 p-5 rounded-lg flex flex-col');

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
    optionMenuShare.setAttribute('class', 'option-menu-list');

    const shareCount = document.createElement('a')
    shareCount.setAttribute('class', 'px-3 py-2.5 w-28 flex items-center gap-2 hover:bg-gray-500')
    shareCount.innerHTML = `<i class="fa-solid fa-share-nodes"></i> Share`;
    shareCount.addEventListener('click', function () {
        // Call the share function with countdown data
        shareCountdown(countdown);
    });
    optionMenuShare.appendChild(shareCount);

    optionMenu.appendChild(optionMenuShare);

    const optionMenuEdit = document.createElement('li');
    optionMenuEdit.setAttribute('class', 'option-menu-list');

    const editCount = document.createElement('a')
    editCount.setAttribute('class', 'px-3 py-2.5 w-28 flex items-center gap-2 hover:bg-gray-500')
    editCount.innerHTML = `<i class="fa-regular fa-pen-to-square"></i> Edit`;
    editCount.addEventListener('click', function() {
        updateCount(countdown);
    });
    optionMenuEdit.appendChild(editCount);

    optionMenu.appendChild(optionMenuEdit);

    const optionMenuDelete = document.createElement('li');
    optionMenuDelete.setAttribute('class', 'option-menu-list');

    const deleteCount = document.createElement('a')
    deleteCount.setAttribute('class', 'px-3 py-2.5 w-28 flex items-center gap-2 hover:bg-gray-500')
    deleteCount.innerHTML = `<i class="fa-regular fa-circle-xmark"></i> Delete`;
    deleteCount.addEventListener('click', function() {
        const confirmDelete = confirm('Are you sire you want to delete this countdown');

        if (confirmDelete){
            const updatedCountdowns = existingCountdowns.filter((count) => count.countName !== countdown.countName);
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

    const countdownContainer = document.createElement('div');
    countdownContainer.setAttribute('class', 'count-time-display mt-5 mx-auto flex justify-center item-center bg-white w-28 h-28 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full border border-black')
    
    const countdownDisplay = document.createElement('span');
    countdownDisplay.setAttribute('class', 'text-xl md:text-3xl font-medium self-center');
    countdownDisplay.textContent = countdown.countFor;

    countdownContainer.appendChild(countdownDisplay);

    countdownCard.appendChild(countdownContainer);

    const countdownNote = document.createElement('div');
    countdownNote.setAttribute('class', 'mt-5 countdown-note text-justify text-base')
    countdownNote.textContent = countdown.description;

    countdownCard.appendChild(countdownNote);

    return countdownCard;
};

export { createCountdownCard };
