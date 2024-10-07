// script.js

// Function to render user reply bubble
export function renderReplyMessage(message, containerId) {
    const messageHTML = `
        <div class="col-12 d-flex justify-content-end"> <!-- Align the reply to the right -->
            <div class="phone-card-response rounded-5 text-white p-3 shadow-sm" style="max-width: 75%; background-color: #9DBDFF; margin-top: 20px;">
                <div class="second-response">
                    <span class="text">${message}</span>
                </div>
            </div>
        </div>
    `;

    // Append the message HTML to the container
    document.getElementById(containerId).innerHTML += messageHTML;
}

// Function to render correct answer by user
export function renderCorrectReplyMessage(message, containerId) {
    const messageHTML = `
        <div class="col-12 d-flex justify-content-end"> <!-- Align the reply to the right -->
                <div class="phone-card-response rounded-5 text-white p-3 shadow-sm" style="max-width: 75%; background-color: #9DBDFF; margin-top: 20px; border: 3.5px solid green; box-shadow: 0 0 25px 10px #006400;">
                <div class="second-response">
                    <span class="text">${message}</span>
                </div>
            </div>
        </div>
    `;

    // Append the message HTML to the container
    document.getElementById(containerId).innerHTML += messageHTML;
}

// Function to render wrong answer by user
export function renderIncorrectReplyMessage(message, containerId) {
    const messageHTML = `
        <div class="col-12 d-flex justify-content-end"> <!-- Align the reply to the right -->
            <div class="phone-card-response rounded-5 text-white p-3 shadow-sm" style="max-width: 75%; background-color: #9DBDFF; margin-top: 20px; border: 3.5px solid red; box-shadow: 0 0 25px 10px red;">
                <div class="second-response">
                    <span class="text">${message}</span>
                </div>
            </div>
        </div>
    `;

    // Append the message HTML to the container
    document.getElementById(containerId).innerHTML += messageHTML;
}


export function renderReceivedMessage(message, containerId) {
    const messageHTML = `
        <div class="col-12 d-flex justify-content-start">
			<div class="phone-card-response rounded-5 p-3 shadow-sm" style="max-width: 75%; background-color: #F8F9FA; margin-top: 20px;">
				<div class="first-response" style="background-color: #F8F9FA;">
					<span class="text">${message}</span>
				</div>
            </div>
		</div>
    `;

    // Append the message HTML to the container
    document.getElementById(containerId).innerHTML += messageHTML;
}

export function renderReceivedImage(imageUrl, containerId) {
    const messageHTML = `
        <div class="col-12 d-flex justify-content-start">
            <div class="phone-card-response rounded-5 bg-light p-3 shadow-sm" style="max-width: 75%; margin-top: 20px;">
                <div class="first-response">
                    <img src="${imageUrl}" alt="Image" style="width: 100%; height: auto;" />
                </div>
            </div>
        </div>
    `;

    // Append the message HTML to the container

    document.getElementById(containerId).innerHTML += messageHTML;
}

// Function to clear all messages
export function clearMessages(containerId) {
    document.getElementById(containerId).innerHTML = ''; // Clear the message container
}


// Function to handle "Got It"
function handleGotItButtonClick() {
    const replyMessage = "GOT IT!"; // Your desired reply message
    renderReplyMessage(replyMessage,'sms-container-middle');

    //Scroll to top
    renderReceivedMessage("Lets begin...", 'sms-container-middle');
    renderReceivedMessage("In this section, let's learn about the different beach safety flags at Australian beaches. Please scroll down", 'sms-container-middle');
    renderReceivedImage('/img/flags/red-yellow-swim-between.png', 'sms-container-middle');
    renderReceivedMessage("Guess what the above flag means!", 'sms-container-middle'); 

    showProceedButtons(
        ['flagQues1CorrectAns', 'flagQues1WrongAns'], 
        ['Always swim between the flags', 'Caution required. Potential hazards']
    );

    //Here we will add height
    const scrollerChatView = document.getElementById('message-wrapper');
    scrollerChatView.scrollTo({
        top: scrollerChatView.scrollHeight,
        behavior: 'smooth'
    });

}

function showProceedButtons(buttonIds, buttonTexts) {
    // let messageWrapper = document.getElementById('message-wrapper');
    // messageWrapper.scrollTop = messageWrapper.scrollHeight; // Scroll to show new message

    // Replace the "Got It" button with specified buttons
    const buttonContainer = document.getElementById('button-section');
    buttonContainer.innerHTML = `
        <div class="d-flex justify-content-between">
            ${createButtonHTML(buttonTexts[0], buttonIds[0])}
            ${createButtonHTML(buttonTexts[1], buttonIds[1])}
        </div>
    `;

    // Attach event listeners to new buttons
    document.getElementById(buttonIds[0]).addEventListener('click', () => {
        handleCoolButtonClick(buttonIds[0]);
    });
    document.getElementById(buttonIds[1]).addEventListener('click', () => {
        handleCoolButtonClick(buttonIds[1]);
    });
}

function handleCoolButtonClick(buttonId) {

    const messageWrapper = document.getElementById('message-wrapper');

    if (buttonId === 'flagQues1CorrectAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderCorrectReplyMessage("Always swim between the flags", 'sms-container-middle');
        renderReceivedMessage("Correct!", 'sms-container-middle');
        const ans1Text = "The most important flags on the beach are the RED and YELLOW flags. These show the supervised area of the beach and that a lifesaving service is operating."
        setTimeout(() => {
            renderReceivedMessage(ans1Text,'sms-container-middle');
            renderReceivedMessage("If there are no red and yellow flags, check with the lifeguards and if unsure don’t go in the water.", 'sms-container-middle');
            renderReceivedImage('/img/flags/ques2-yellow-warning.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues2WrongAns', 'flagQues2CorrectAns'], 
                ['Always swim between the flags', 'Caution required. Potential hazards']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;


        // messageWrapper.scrollTop = messageWrapper.scrollHeight;
        // Add your specific actions for COOL 1 here
    } else if (buttonId === 'flagQues1WrongAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderIncorrectReplyMessage("Caution required. Potential hazards", 'sms-container-middle');
        renderReceivedMessage("Wrong! The flag indicates to swim between flags", 'sms-container-middle');
        const ans1Text = "The most important flags on the beach are the RED and YELLOW flags. These show the supervised area of the beach and that a lifesaving service is operating."
        setTimeout(() => {
            renderReceivedMessage(ans1Text,'sms-container-middle');
            renderReceivedMessage("If there are no red and yellow flags, check with the lifeguards and if unsure don’t go in the water.", 'sms-container-middle');
            renderReceivedImage('/img/flags/ques2-yellow-warning.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues2WrongAns', 'flagQues2CorrectAns'], 
                ['Always swim between the flags', 'Caution required. Potential hazards']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
        // Add your specific actions for COOL 2 here
    } else if (buttonId === 'flagQues2CorrectAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderCorrectReplyMessage("Caution required. Potential hazards", 'sms-container-middle');
        renderReceivedMessage("Correct!", 'sms-container-middle');
        const ans2Text = "Yellow means proceed with caution—it’s probably not safe to swim"
        setTimeout(() => {
            renderReceivedMessage(ans2Text,'sms-container-middle');
            renderReceivedMessage("At AquaGuardians, we advise against it, so choose accordingly", 'sms-container-middle');
            renderReceivedImage('/img/flags/ques3-red-noswim.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues3CorrectAns', 'flagQues3WrongAns'], 
                ['Absolutely no swimming', 'Caution required. Potential hazards']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;

    } else if (buttonId === 'flagQues2WrongAns') {

        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderIncorrectReplyMessage("Always swim between the flags", 'sms-container-middle');
        renderReceivedMessage("Wrong!", 'sms-container-middle');
        const ans2Text = "Yellow means proceed with caution—it’s probably not safe to swim"
        setTimeout(() => {
            renderReceivedMessage(ans2Text,'sms-container-middle');
            renderReceivedMessage("At AquaGuardians, we advise against it, so choose accordingly", 'sms-container-middle');
            renderReceivedImage('/img/flags/ques3-red-noswim.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues3CorrectAns', 'flagQues3WrongAns'], 
                ['Absolutely no swimming', 'Caution required. Potential hazards']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    } else if (buttonId === 'flagQues3CorrectAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderCorrectReplyMessage("Absolutely no swimming", 'sms-container-middle');
        renderReceivedMessage("Correct!", 'sms-container-middle');
        const ans3Text = "A red flag means DO NOT SWIM, no matter how good your swimming skills are—please don’t."
        setTimeout(() => {
            renderReceivedMessage(ans3Text,'sms-container-middle');
            renderReceivedImage('/img/flags/ques4-red-white-evacuate.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues4CorrectAns', 'flagQues4WrongAns'], 
                ['Evacuate the waters', 'Surfcraft riding area boundary']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    } else if (buttonId === 'flagQues3WrongAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderIncorrectReplyMessage("Caution required. Potential hazards", 'sms-container-middle');
        renderReceivedMessage("Wrong!", 'sms-container-middle');
        const ans3Text = "A red flag means DO NOT SWIM, no matter how good your swimming skills are—please don’t."
        setTimeout(() => {
            renderReceivedMessage(ans3Text,'sms-container-middle');
            renderReceivedImage('/img/flags/ques4-red-white-evacuate.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues4CorrectAns', 'flagQues4WrongAns'], 
                ['Evacuate the waters', 'Surfcraft riding area boundary']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    } else if (buttonId === 'flagQues4CorrectAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderCorrectReplyMessage("Evacuate the waters", 'sms-container-middle');
        renderReceivedMessage("Correct!", 'sms-container-middle');
        const ans4Text = "This flag signals to clear the area immediately—lifeguards may be performing a rescue."
        setTimeout(() => {
            renderReceivedMessage(ans4Text,'sms-container-middle');
            renderReceivedMessage("It’s important to stay out of the water and keep the beach clear when you see this flag.",'sms-container-middle');
            renderReceivedImage('/img/flags/ques5-surfcraft-boundary.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues5WrongAns', 'flagQues5CorrectAns'], 
                ['Swim the waters', 'Surfcraft riding area boundary']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    } else if (buttonId === 'flagQues4WrongAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderIncorrectReplyMessage("Surfcraft riding area boundary", 'sms-container-middle');
        renderReceivedMessage("Wrong!", 'sms-container-middle');
        const ans4Text = "This flag signals to clear the area immediately—lifeguards may be performing a rescue."
        setTimeout(() => {
            renderReceivedMessage(ans4Text,'sms-container-middle');
            renderReceivedMessage("It’s important to stay out of the water and keep the beach clear when you see this flag.",'sms-container-middle');
            renderReceivedImage('/img/flags/ques5-surfcraft-boundary.png', 'sms-container-middle');
            renderReceivedMessage("Now what does this new flag mean?", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues5WrongAns', 'flagQues5CorrectAns'], 
                ['Swim the waters', 'Surfcraft riding area boundary']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    } else if (buttonId === 'flagQues5CorrectAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderCorrectReplyMessage("Surfcraft riding area boundary", 'sms-container-middle');
        renderReceivedMessage("Correct!", 'sms-container-middle');
        const ans5Text = "This means the area is not safe for swimming—it's reserved for surfboards, jet skis, or other equipment."
        setTimeout(() => {
            renderReceivedMessage(ans5Text,'sms-container-middle');
            renderReceivedMessage("For your safety, swim in designated areas away from black and white flags",'sms-container-middle');
            renderReceivedMessage("Congrats! This bring to end of the module", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues5HomePage', 'flagQues5HistInsights'], 
                ['Return to Home', 'Learn more about historical incidents']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    } else if (buttonId === 'flagQues5WrongAns') {
        messageWrapper.scrollTop = messageWrapper.scrollHeight;

        clearMessages('button-section')
        renderIncorrectReplyMessage("Swim the waters", 'sms-container-middle');
        renderReceivedMessage("Wrong!", 'sms-container-middle');
        const ans5Text = "This means the area is not safe for swimming—it's reserved for surfboards, jet skis, or other equipment."
        setTimeout(() => {
            renderReceivedMessage(ans5Text,'sms-container-middle');
            renderReceivedMessage("For your safety, swim in designated areas away from black and white flags",'sms-container-middle');
            renderReceivedMessage("Congrats! This bring to end of the module", 'sms-container-middle');
        },20);

        
        setTimeout(() => {
            showProceedButtons(
                ['flagQues5HomePage', 'flagQues5HistInsights'], 
                ['Return to Home', 'Learn more about historical incidents']
            );
        }, 1000);

        messageWrapper.scrollTop = messageWrapper.scrollHeight;
    }else if (buttonId === 'flagQues5HomePage') {
        window.location.href = '/home';
    }else if (buttonId === 'flagQues5HistInsights') {
        window.location.href = '/historical-insights';
    }


}


function createButtonHTML(spanText, buttonId) {
    return `
        <button id="${buttonId}" class="phone-response-button w-100 rounded-3 p-3" style="margin: 0 2px;">
            <span class="text text-background-color">${spanText}</span>
        </button>
    `;
}

document.addEventListener("DOMContentLoaded", function() {
    const gotItButton = document.getElementById('gotItButton');

    if (gotItButton) {
        gotItButton.addEventListener('click', handleGotItButtonClick);
    }
});

// Function to log a message to the console
export function logMessage(message) {
    console.log(`Log: ${message}`);
}
