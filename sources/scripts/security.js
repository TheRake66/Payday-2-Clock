/**
 * Classe gérant la sécurité du site.
 */
export default class Security {

    /**
     * Constructeur de la classe.
     */
    constructor() {
        this.forceSslUsage();
    }

    /**
     * Redirige l'utilisateur vers la version HTTPS du site s'il demande une version HTTP.
     */
    forceSslUsage() {
        if (location.protocol !== 'https:') {
            const path = location.href.substring(location.protocol.length);
            location.replace(`https:${path}`);
        }
    }

}