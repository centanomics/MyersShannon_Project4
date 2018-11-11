window.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    let assignment = Assignment.getInstance();
});

class Assignment {
    constructor() {
        console.log('Singleton loaded');
        this.consonants = this.getCharacters('consonant');
        this.vowels = this.getCharacters('vowel');
        this.check = 0;
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
                if(Number(this.check) !== 1) {
                    console.log(this.check);
                    this.check++;
                    this.consonants = returnJSON;
                } else {
                    console.log('reached it');
                    this.vowels = returnJSON;
                    this.addListeners();
                }
            })
            .catch(error => {
                console.log('Error occured: ', error);
            });
        
    }

    addListeners() {
        document.querySelector('#searchForm').addEventListener('submit', this.searchForCharacter.bind(this));
        document.querySelector('#transcribeForm').addEventListener('submit', this.getTranscription.bind(this));
    }

    getTranscription(e) {
        e.preventDefault();
        let word = e.target.querySelector('input').value;
        if(this.validate(word)) {
            this.transcribeWord(word);
        }
    }

    transcribeWord(word) {
        let config = {
            method: 'GET'
        }
        let key = 'aa25a0f2-55f1-47ed-bf80-dccca1199bab'
        fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${key}`, config) 
            .then(response => response.json())
            .then(responseAsJson => {
                let ipa = responseAsJson[0].hwi.prs[0].mw
                console.log(ipa);
            })
    }

    searchForCharacter(e) {
        e.preventDefault();
        let searchTerm = e.target.querySelector('input:first-child');
        let searchType = Number(e.target.querySelector('select').selectedIndex);
        if(this.validate(searchTerm.value)) {
            this.getSearchResults(searchTerm.value, searchType);
            //console.log(this.consonants);
            searchTerm.value = '';
        }
    }

    getSearchResults(term, type) {
        let results = [];
        if(type === 0) {
            for(let i = 0; i < this.consonants.length; i++) {
                if(this.consonants[i].name.indexOf(term) !== -1) {
                    results.push(this.consonants[i]);
                }
            }
            for(let i = 0; i < this.vowels.length; i++) {
                if(this.vowels[i].name.indexOf(term) !== -1) {
                    results.push(this.vowels[i]);
                }
            }
        } else if (type === 1) {
            for(let i = 0; i < this.consonants.length; i++) {
                if(this.consonants[i].place.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    results.push(this.consonants[i]);
                }
            }
        } else if (type === 2) {
            for(let i = 0; i < this.consonants.length; i++) {
                if(this.consonants[i].manner.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    results.push(this.consonants[i]);
                }
            }
        } else if (type === 3) {
            for(let i = 0; i < this.vowels.length; i++) {
                if(this.vowels[i].place.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    results.push(this.vowels[i]);
                }
            }
        } else {
            for(let i = 0; i < this.vowels.length; i++) {
                if(this.vowels[i].manner.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    results.push(this.vowels[i]);
                }
            }
        }
        console.log(results);
    }

    validate(term) {
        if(term !== '') {
            return true;
        } else {
            console.log('need to type something in');
            return false;
        }
    }
}