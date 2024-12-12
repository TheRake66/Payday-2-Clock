/**
 * Classe de librairie de fonctions.
 */
export default class Library {
    
    /**
     * Exécute une action en boucle jusqu'à ce qu'elle réussisse suivant une condition.
     * 
     * @param {HTMLElement} element L'élément sur lequel l'action va être effectuée.
     * @param {Function} action La fonction à exécuter comme action.
     * @param {Function} condition La fonction qui va vérifier si l'action est correctement effectuée.
     */
    static async forceUntilSuccess(element, action, condition) {
        while (true) {
            action.call(element).catch(_ => {});
            if (condition()) break;
            await Library.sleepPromise();
        }
    } 
    
    /**
     * Retourne un nombre complète sur deux caractères avec des zéros.
     * 
     * @param {Number} number Le nombre à compléter.
     * @returns {String} Le nombre completé.
     */
    static padToTwo(number) {
        return number.toString().padStart(2, '0');
    }
    
    /**
     * Retourne une promesse avec un timer permettant de faire des pauses.
     * 
     * @param {Number} time Le nombre de millisecondes à attendre.
     * @returns {Promise} La promesse.
     */
    static sleepPromise(time = 100) {
        return new Promise(r => setTimeout(r, time));
    }

}