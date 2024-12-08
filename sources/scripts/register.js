/**
 * Classe gérant l'enregistrement du service worker pour le mode offline.
 */
export default class Register {

    /**
     * Constructeur de la classe.
     */
    constructor() {
        this.registerServiceWorker();
    }

    /**
     * Enregistre le service worker si le navigateur le supporte.
     */
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service.js');
        }
    }

}