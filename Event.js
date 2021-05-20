export default class Event {
    /**
     * 
     * @param {string} name 
     * @param {Date} date 
     * @param {string} description 
     * @param {string} imageUrl 
     */
    constructor(name, date, description, imageUrl) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}