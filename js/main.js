/* jshint undef: true, unused: true, esversion: 6 */

window.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    let assignment = Assignment.getInstance();
});

class Assignment {
    constructor() {
        // console.log('Singleton loaded');
        this.consonants = this.getCharacters('consonant');
        this.vowels = this.getCharacters('vowel');
        this.check = 0;
        this.currentSearch = 0;
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
        };
        let returnJSON;
        fetch(`js/json/${file}.json`, config)
            .then(response => response.json())
            .then(responseAsJson => {
                returnJSON = responseAsJson;
                if(Number(this.check) !== 1) {
                    //console.log(this.check);
                    this.check++;
                    this.consonants = returnJSON;
                } else {
                    //console.log('reached it');
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
        document.querySelector('.transcribe').addEventListener('click', this.changeToSearch);
        document.querySelector('.search').addEventListener('click', this.changeToTranscribe);
        document.querySelector('.random').addEventListener('click', this.getRandomCharacter.bind(this));
    }

    getRandomCharacter() {
        let arr = this.consonants.concat(this.vowels);
        let rnd = Math.floor((Math.random() * 34) + 1) - 1;

        let display = document.querySelector('.display');
        display.innerHTML = '';
        let text = '';

        // text += `<h2 class="mt-4 text-primary">${arr[rnd].name}</h2>`;

        //text += '<div class="row">';
        text += '<article class="card my-4 mx-auto border border-primary">';
        text += `<h3 class="card-header">${arr[rnd].name}</h3>`;
        text += '<div class="card-body">';
        text += `<p>The ${arr[rnd].symbol} in ${arr[rnd].example}</p>`;
        if(arr[rnd].name.indexOf('vowel') !== -1 || arr[rnd].name === 'Schwa') {
            text += `<p>Height: ${arr[rnd].place}</p>`;
            text += `<p>Backness: ${arr[rnd].manner}</p>`;
        } else {
            text += `<p>Place: ${arr[rnd].place}</p>`;
            text += `<p>Manner: ${arr[rnd].manner}</p>`;
        }
        // text += `<p>${results[i].example}</p>`;
        text += '</div>';
        text += '</article>';
        //text += '</div>';

        display.insertAdjacentHTML('afterbegin', text);
    }

    changeToSearch(e) {
        let list = e.target.parentElement.parentElement;
        list.querySelector('li:first-of-type').classList.remove('active');
        list.querySelector('li:nth-of-type(2)').classList.add('active');
        document.querySelector('#searchForm').style.display = 'none';
        document.querySelector('#transcribeForm').style.display = 'block';
        document.querySelector('#transcribeForm').reset();
        document.querySelectorAll('input')[0].classList.remove('is-valid');
        document.querySelectorAll('input')[0].classList.remove('is-invalid');
        // document.querySelectorAll('input')[1].classList.remove('is-valid');
    }

    changeToTranscribe(e) {
        let list = e.target.parentElement.parentElement;
        list.querySelector('li:nth-of-type(2)').classList.remove('active');
        list.querySelector('li:first-of-type').classList.add('active');
        document.querySelector('#searchForm').style.display = 'block';
        document.querySelector('#transcribeForm').style.display = 'none';
        document.querySelector('#searchForm').reset();
        document.querySelectorAll('input')[1].classList.remove('is-valid');
        document.querySelectorAll('input')[1].classList.remove('is-invalid');
    }

    getTranscription(e) {
        e.preventDefault();
        let word = e.target.querySelector('input');
        if(this.validate(word.value, word)) {
            this.transcribeWord(word);
        }
    }

    transcribeWord(word) {
        let config = {
            method: 'GET'
        };
        let key = 'aa25a0f2-55f1-47ed-bf80-dccca1199bab';
        fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word.value}?key=${key}`, config) 
            .then(response => response.json())
            .then(responseAsJson => {
                let ipa = responseAsJson[0].hwi.prs[0].mw;
                //console.log(ipa);
                this.displayTransciption(ipa, word.value);
                word.value = '';
            })
            .catch(error => {
                console.log('Error occured: ', error);
                this.displayTransciptionError(word.value);
            });
    }

    displayTransciptionError(term) {
        let display = document.querySelector('.display');
        display.innerHTML = '';
        let text = '';

        text += '<div class="text-center">';
        text += `<h2 class="mt-5">No results for <span class="text-primary">${term}</span>!</h2><p>Try typing in "hello" !</p>`;
        text += '</div>';
        
        display.insertAdjacentHTML('afterbegin', text);
    }

    searchForCharacter(e) {
        e.preventDefault();
        let searchTerm = e.target.querySelector('input:first-child');
        let searchType = Number(e.target.querySelector('select').selectedIndex);
        if(this.validate(searchTerm.value, searchTerm)) {
            let searchResults = this.getSearchResults(searchTerm.value, searchType);
            this.displayResults(searchTerm.value, searchResults);
            searchTerm.value = '';
        }
    }

    displayResults(term, results) {
        let display = document.querySelector('.display');
        display.innerHTML = '';
        let textVowels = '';
        let textConsonants = '';
        let returnText = '';
        if(results.length !== 0) {
            returnText += `<h2 class="mt-4 text-primary">${term}</h2>`;
            for(let i = 0; i < results.length; i++) {
                // text += '<div class="row">';
                if(results[i].name.indexOf('vowel') !== -1 || results[i].name === 'Schwa') {
                    textVowels += '<article class="card my-4 mx-3 border border-primary">';
                    textVowels += `<h4 class="card-header">${results[i].name}</h4>`;
                    textVowels += '<div class="card-body">';
                    textVowels += `<p>The ${results[i].symbol} in ${results[i].example}</p>`;
                    textVowels += `<p>Height: ${results[i].place}</p>`;
                    textVowels += `<p>Backness: ${results[i].manner}</p>`;
                    // textVowels += `<p>${results[i].example}</p>`;
                    textVowels += '</div>';
                    textVowels += '</article>';
                } else {
                    textConsonants += '<article class="card my-4 mx-3 border border-primary">';
                    textConsonants += `<h4 class="card-header">${results[i].name}</h4>`;
                    textConsonants += '<div class="card-body">';
                    textConsonants += `<p>The ${results[i].symbol} in ${results[i].example}</p>`;
                    textConsonants += `<p>Place: ${results[i].place}</p>`;
                    textConsonants += `<p>Manner: ${results[i].manner}</p>`;
                    // textConsonants += `<p>${results[i].example}</p>`;
                    textConsonants += '</div>';
                    textConsonants += '</article>';
                }
                //text += '</div>';
            }
        } else {
            returnText += '<div class="text-center mt-5">';
            returnText += `<h2>No results for <span class="text-primary">${term}</span>!</h2><p>Try searching for "labial" under the Consonant Place search type!</p>`;
            returnText += '</div>'
        }
        if(textConsonants !== '') {
        returnText += '<h3>Consonant Sounds:</h3>';
        returnText += `<div class="d-lg-flex flex-row flex-wrap justify-content-around">${textConsonants}</div>`;
        } if(textVowels !== '') {
        returnText += '<h3>Vowel Sounds:</h3>';
        returnText += `<div class="d-lg-flex flex-row flex-wrap justify-content-around">${textVowels}</div>`;
        }

        display.insertAdjacentHTML('afterbegin', returnText);
    }

    displayTransciption(phonetics, term) {
        let display = document.querySelector('.display');
        display.innerHTML = '';
        let text = '';
        
        text += '<div class="row">';
        text += '<article class=" my-5 card mx-auto border border-primary">';
        text += '<h2 class="card-header">English to <span class="text-primary">IPA</span></h2>';
        text += `<p class="card-body"> ${term} becomes <span class="text-primary">\\ ${phonetics} \\</span></p> `;
        text += '</article>';
        text += '</div>';

        display.insertAdjacentHTML('afterbegin', text);
    }

    getSearchResults(term, type) {
        let results = [];
        if(type === 0) {
            for(let i = 0; i < this.consonants.length; i++) {
                if(this.consonants[i].name.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                    results.push(this.consonants[i]);
                }
            }
            for(let i = 0; i < this.vowels.length; i++) {
                if(this.vowels[i].name.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
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
        return results;
    }

    validate(term, inputForm) {
        if(term !== '') {
            inputForm.classList.add('is-valid');
            inputForm.classList.remove('is-invalid');
            return true;
        } else {
            inputForm.classList.add('is-invalid');
            inputForm.classList.remove('is-valid');
            return false;
        }
    }
}