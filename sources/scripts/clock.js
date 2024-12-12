import Library from './library.js';
import Language from './language.js';



/**
 * Classe gérant la logique de l'horloge.
 */
export default class Clock {

    /**
     * @type {HTMLElement} L'élément racine de la page.
     */
    screenElement = document.getElementById('screen');

    /**
     * @type {HTMLElement} L'élément audio pour le son d'arrière-plan.
     */
    effectElement = document.getElementById('effect');

    /**
     * @type {HTMLElement} L'élément pour mettre en plein écran.
     */
    fullscreenElement = document.getElementById('fullscreen');

    /**
     * @type {HTMLElement} L'élément permettant le passage du mode hack au mode error.
     */
    switchElement = document.getElementById('switch');

    /**
     * @type {HTMLElement} L'élément de texte clignotant.
     */
    titleElement = document.getElementById('title');

    /**
     * @type {HTMLElement} L'élément de la barre de progression.
     */
    percentElement = document.getElementById('percent');

    /**
     * @type {HTMLElement} L'élément du label du temps estimé.
     */
    estimatedElement = document.getElementById('estimated');

    /**
     * @type {HTMLElement} L'élément qui affiche la date et l'heure.
     */
    clockElement = document.getElementById('clock');

    /**
     * @type {Number} Le handle de la boucle principale d'actualisation.
     */
    clockThreadHandle = null;

    /**
     * @type {Number} Le handle du délai pour cacher le curseur.
     */
    cursorDelayHandle = null;

    /**
     * Constructeur de la classe.
     */
    constructor() {
        this.initLanguage();
        this.addSwitchModeEvent();
        this.addInactiveCursorEvent();
        this.addFullScreenEvent();
        this.setHackMode();
        this.playAudioEffect();
        this.runClockThread();
    }

    /**
     * Lance la boucle principale d'actualisation.
     */
    runClockThread() {
        this.refreshClock();
        this.clockThreadHandle = setInterval(() => {
            this.refreshClock();
        }, 1000);
    }
    
    /**
     * Arrête la boucle principale d'actualisation.
     */
    stopClockThread() {
        clearInterval(this.clockThreadHandle);
        this.clockThreadHandle = null;
    }
    
    /**
     * Vérifie si la boucle principale d'actualisation est lancée.
     * 
     * @returns {Boolean} Si la boucle principale d'actualisation est lancée.
     */
    isClockRunning() {
        return this.clockThreadHandle !== null;
    }
    
    /**
     * Charge les textes constants par rapport a la langue.
     */
    initLanguage() {
        const pack = Language.currentPack;
        document.title = `Payday 2 ${pack.tabTitle}`;
        document.documentElement.lang = pack.htmlLang;
        this.estimatedElement.innerText = pack.estimatedTime;
    }
    
    /**
     * Joue le son d'arrière-plan. 
     */
    playAudioEffect() {
        Library.forceUntilSuccess(
            this.effectElement, 
            this.effectElement.play, 
            () => !this.effectElement.paused);
    }
    
    /**
     * Ajoute l'événement qui permet de changer de mode.
     */
    addSwitchModeEvent() {
        this.switchElement.onclick = () => {
            if (this.isClockRunning()) {
                this.setErrorMode();
                this.stopClockThread();
            } else {
                this.setHackMode();
                this.runClockThread();
            }
            this.playAudioEffect();
        }
    }
    
    /**
     * Ajoute l'événement qui permet de cacher la souris.
     */
    addInactiveCursorEvent() {
        this.screenElement.onmousemove = () => {
            this.screenElement.classList.remove('inactive');
            clearTimeout(this.cursorDelayHandle);
            this.cursorDelayHandle = setTimeout(() => {
                this.screenElement.classList.add('inactive');
            }, 2000);
        }
    }
    
    /**
     * Ajoute l'événement qui permet de mettre en plein écran.
     */
    addFullScreenEvent() {
        this.fullscreenElement.onclick = () => {
            document.fullscreenElement ?
                document.exitFullscreen() :
                document.documentElement.requestFullscreen();
        }
    }
    
    /**
     * Bascule en mode hack avec l'horloge.
     */
    setHackMode() {
        const pack = Language.currentPack;
        this.screenElement.classList.add('hack');
        this.screenElement.classList.remove('error');
        this.titleElement.innerText = `${pack.messageHack}...`;
        this.clockElement.innerText = '...';
        this.effectElement.src = '/assets/sounds/hack.mp3';
    }
    
    /**
     * Bascule en mode error sans l'horloge..
     */
    setErrorMode() {
        const pack = Language.currentPack;
        this.screenElement.classList.add('error');
        this.screenElement.classList.remove('hack');
        this.titleElement.innerText = `// ${pack.messageError} //`;
        this.clockElement.innerText = `// ${pack.messageError} //`;
        this.effectElement.src = '/assets/sounds/error.mp3';
    }
    
    /**
     * Rafraîchis la barre de progression et l'horloge.
     */
    refreshClock() {
        this.percentElement.value = this.getDayPercent();
        this.clockElement.innerText = this.getClockFormat();
    }
    
    /**
     * Calcul et retourne le texte de l'horloge.
     * 
     * @returns {String} Le texte avec la date et l'heure.
     */
    getClockFormat() {
        const currentDate = new Date();
    
        const currentDay = currentDate.getDate();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
    
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();
    
        const pack = Language.currentPack;
        const dateFormat = (pack.dayFirst ?
            `${Library.padToTwo(currentDay)}/${Library.padToTwo(currentMonth)}` :
            `${Library.padToTwo(currentMonth)}/${Library.padToTwo(currentDay)}`)
            + `/${currentYear}`;
    
        const timeFormat = `${Library.padToTwo(currentHours)}:${Library.padToTwo(currentMinutes)}:${Library.padToTwo(currentSeconds)}`;
    
        return `${dateFormat} - ${timeFormat}`;
    }
    
    /**
     * Retourne le pourcentage actuel de la journée en cours.
     * 
     * @returns {Number} Le pourcentage sur 100.
     */
    getDayPercent() {
        const currentDate = new Date();
    
        const currentHours = currentDate.getHours();
        const currentMinutes = currentDate.getMinutes();
        const currentSeconds = currentDate.getSeconds();
    
        const currentStamp = currentHours * 3600 + currentMinutes * 60 + currentSeconds;
        const maxDayStamp = 24 * 60 * 60;
    
        const percent = (currentStamp / maxDayStamp) * 100;
    
        return percent.toFixed(2);
    }

}