window.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    let assignment = Assignment.getInstance();
});

class Assignment {
    constructor() {
        console.log('Singleton loaded');
        let consonants = this.getCharacters('consonant');
        let vowels = this.getCharacters('vowel');
    }

    static getInstance() {
        if(!Assignment._instance) {
        
            Assignment._instance = new Assignment();

            return Assignment._instance;

        } else {
            throw 'Can\'t create another singleton';
        }
    }

    getCharacters(file) {
        let config = {
            method: 'GET',
            headers: {
                'content-type' : 'applications/json'
            }
        }
        let returnJSON = undefined;
        fetch(`js/json/${file}.json`, config)
            .then(response => response.json())
            .then(responseAsJson => {
                returnJSON = responseAsJson;
                return returnJSON;
            })
            .catch(error => {
                console.log('Error occured: ', error);
            });
    }
}