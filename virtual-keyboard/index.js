import Keyboard from './js/keyboard.js';

const app = new Keyboard();

const langID = app.getFromLocalStorage('lang', 'en');

app.init(langID);
