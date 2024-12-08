/**
 * Classe gérant la logique de l'horloge.
 */
export default class Language {
    
    /**
     * @type {Object} Le pack de langue utilisé.
     */
    static currentPack = null;

    /**
     * @type {String} La clé du pack de langue par défaut.
     */
    static defaultLanguage = 'english';

    /**
     * @type {Object} Les packs de langues disponibles.
     */
    static languagePacks = {
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

    /**
     * Constructeur de la classe.
     */
    constructor() {
        this.loadPack();
    }

    /**
     * Charge le pack de langue demandé dans l'URL ou celui par défaut.
     */
    loadPack() {
        const urlParameters = new URLSearchParams(window.location.search);
        const languageCode = urlParameters.get('language');
        Language.currentPack = Language.languagePacks[
            languageCode && languageCode in Language.languagePacks ? 
                languageCode : Language.defaultLanguage];
    }

}