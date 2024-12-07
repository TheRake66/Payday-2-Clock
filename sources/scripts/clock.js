const screenElement = document.getElementById('screen');
const effectElement = document.getElementById('effect');
const switchElement = document.getElementById('switch');
const titleElement = document.getElementById('title');
const percentElement = document.getElementById('percent');
const estimatedElement = document.getElementById('estimated');
const clockElement = document.getElementById('clock');

const defaultLanguage = 'english';
const languagePack = {
    french: {
        htmlLang: 'fr',
        tabTitle: 'Horloge',
        messageHack: 'Journée en cours',
        messageError: 'Erreur',
        estimatedTime: 'Temps actuel estimé',
        dayFirst: true
    },
    english: {
        htmlLang: 'en',
        tabTitle: 'Clock',
        messageHack: 'Day in progress',
        messageError: 'Error',
        estimatedTime: 'Estimated current time',
        dayFirst: false
    },
    spanish: {
        htmlLang: 'es',
        tabTitle: 'Reloj',
        messageHack: 'Día en progreso',
        messageError: 'Error',
        estimatedTime: 'Hora actual estimada',
        dayFirst: true
    },
    german: {
        htmlLang: 'de',
        tabTitle: 'Uhr',
        messageHack: 'Tag im Gange',
        messageError: 'Fehler',
        estimatedTime: 'Geschätzte aktuelle Zeit',
        dayFirst: true
    },
    italian: {
        htmlLang: 'it',
        tabTitle: 'Orologio',
        messageHack: 'Giornata in corso',
        messageError: 'Errore',
        estimatedTime: 'Ora corrente stimata',
        dayFirst: true
    }
};

let mainClockThread = null;
let currentLanguage = null;



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
    const element = document.documentElement;
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
    const urlParameters = new URLSearchParams(window.location.search);
    const languageCode = urlParameters.get('language');
    currentLanguage = languagePack[
        languageCode && languageCode in languagePack ? languageCode : defaultLanguage];

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
    const currentDate = new Date();

    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    const dateFormat = (currentLanguage.dayFirst ?
        `${padToTwo(currentDay)}/${padToTwo(currentMonth)}` :
        `${padToTwo(currentMonth)}/${padToTwo(currentDay)}`)
        + `/${currentYear}`;

    const timeFormat = `${padToTwo(currentHours)}:${padToTwo(currentMinutes)}:${padToTwo(currentSeconds)}`;

    return `${dateFormat} - ${timeFormat}`;
}

function getDayPercent() {
    const currentDate = new Date();

    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    const currentStamp = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
    const maxDayStamp = 24 * 60 * 60;

    const percent = (currentStamp / maxDayStamp) * 100;

    return percent.toFixed(2);
}

async function waitUserGesture(element, action, condition) {
    while (true) {
        action.call(element).catch(_ => {});
        if (condition()) break;
        await getSleepPromise();
    }
} 

function padToTwo(number) {
    return number.toString().padStart(2, '0');
}

function getSleepPromise(time = 100) {
    return new Promise(r => setTimeout(r, time));
}