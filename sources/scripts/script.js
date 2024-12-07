const screenElement = document.getElementById('screen');
const effectElement = document.getElementById('effect');
const switchElement = document.getElementById('switch');
const titleElement = document.getElementById('title');
const percentElement = document.getElementById('percent');
const estimatedElement = document.getElementById('estimated');
const clockElement = document.getElementById('clock');

let mainClockThread = null;
let defaultLanguage = 'english';
let currentLanguage = null;
let languagePack = {
    french: {
        htmlLang: 'fr-FR',
        tabTitle: 'Horloge',
        messageHack: 'Journée en cours',
        messageError: 'Erreur',
        estimatedTime: 'Temps actuel estimé',
        dayFirst: true
    },
    english: {
        htmlLang: 'en-EN',
        tabTitle: 'Clock',
        messageHack: 'Day in progress',
        messageError: 'Error',
        estimatedTime: 'Estimated current time',
        dayFirst: false
    },
    spanish: {
        htmlLang: 'sp-SP',
        tabTitle: 'Reloj',
        messageHack: 'Día en progreso',
        messageError: 'Error',
        estimatedTime: 'Hora actual estimada',
        dayFirst: true
    },
    german: {
        htmlLang: 'de-DE',
        tabTitle: 'Uhr',
        messageHack: 'Tag im Gange',
        messageError: 'Fehler',
        estimatedTime: 'Geschätzte aktuelle Zeit',
        dayFirst: true
    },
    italian: {
        htmlLang: 'it-IT',
        tabTitle: 'Orologio',
        messageHack: 'Giornata in corso',
        messageError: 'Errore',
        estimatedTime: 'Ora corrente stimata',
        dayFirst: true
    }
};



initLanguage();
setFullScreen();
addSwitchOnClick();
setHackMode();
playAudioEffect();
runMainThread();



function runMainThread() {
    refreshClock();
    mainClockThread = setInterval(() => {
        refreshClock();
    }, 1000);
}

function stopMainThread() {
    clearInterval(mainClockThread);
    mainClockThread = null;
}

function isMainThreadRunning() {
    return mainClockThread !== null;
}

function playAudioEffect() {
    waitUserGesture(
        effectElement, 
        effectElement.play, 
        () => !effectElement.paused);
}

function setFullScreen() {
    let element = document.documentElement;
    waitUserGesture(
        element, 
        element.requestFullscreen, 
        () => document.fullscreenElement);
}

function addSwitchOnClick() {
    switchElement.onclick = () => {
        if (isMainThreadRunning()) {
            setErrorMode();
            stopMainThread();
        } else {
            setHackMode();
            runMainThread();
        }
        playAudioEffect();
    };
}

function initLanguage() {
    let urlParameters = new URLSearchParams(window.location.search);
    let languageCode = urlParameters.get('language');
    currentLanguage = languagePack[
        languageCode && languageCode in languagePack ?
        languageCode : 
        defaultLanguage];

    document.title = `Payday 2 ${currentLanguage.tabTitle}`;
    document.documentElement.lang = currentLanguage.htmlLang;
    estimated.innerText = currentLanguage.estimatedTime;
}

function setHackMode() {
    screenElement.className = 'hack';
    titleElement.innerText = `${currentLanguage.messageHack}...`;
    clockElement.innerText = '...';
    effectElement.src = '/assets/sounds/hack.mp3';
}

function setErrorMode() {
    screenElement.className = 'error';
    titleElement.innerText = `// ${currentLanguage.messageError} //`;
    clockElement.innerText = `// ${currentLanguage.messageError} //`;
    effectElement.src = '/assets/sounds/error.mp3';
}

function refreshClock() {
    percentElement.value = getDayPercent();
    clockElement.innerText = getClockFormat();
}

function getClockFormat() {
    let currentDate = new Date();

    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();

    let currentHours = currentDate.getHours();
    let currentMinutes = currentDate.getMinutes();
    let currentSeconds = currentDate.getSeconds();

    var dateFormat = (currentLanguage.dayFirst ?
        `${padToTwo(currentDay)}/${padToTwo(currentMonth)}` :
        `${padToTwo(currentMonth)}/${padToTwo(currentDay)}`)
        + `/${currentYear}`;

    var timeFormat = `${padToTwo(currentHours)}:${padToTwo(currentMinutes)}:${padToTwo(currentSeconds)}`;

    return `${dateFormat} - ${timeFormat}`;
}

function getDayPercent() {
    let currentDate = new Date();

    let currentHours = currentDate.getHours();
    let currentMinutes = currentDate.getMinutes();
    let currentSeconds = currentDate.getSeconds();

    let currentStamp = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    let maxDayStamp = 24 * 60 * 60;

    let percent = (currentStamp / maxDayStamp) * 100;

    return percent.toFixed(2);
}

async function waitUserGesture(element, action, condition) {
    while (true) {
        action.call(element).catch(_ => {});
        if (condition()) {
            console.clear();
            break;
        }
        await getSleepPromise();
    }
} 

function padToTwo(number) {
    return number.toString().padStart(2, '0');
}

function getSleepPromise(time = 100) {
    return new Promise(r => setTimeout(r, time));
}