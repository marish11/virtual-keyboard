import language from '../layouts.js';

export const keyLayout = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'LetterQ', 'LetterW', 'LetterE', 'LetterR', 'LetterT', 'LetterY', 'LetterU', 'LetterI', 'LetterO', 'LetterP', 'OpenBracket', 'CloseBracket', 'Backslash', 'Delete'],
  ['CapsLock', 'LetterA', 'LetterS', 'LetterD', 'LetterF', 'LetterG', 'LetterH', 'LetterJ', 'LetterK', 'LetterL', 'Semicolon', 'Quote', 'Enter'],
  ['LeftShift', 'LetterZ', 'LetterX', 'LetterC', 'LetterV', 'LetterB', 'LetterN', 'LetterM', 'Comma', 'Period', 'ForwardSlash', 'ArrowUp', 'RightShift'],
  ['LeftCtrl', 'Win', 'LeftAlt', 'Space', 'RightAlt', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'RightCtrl']
];

export default class Keyboard {
  constructor() {
    this.keyLayout = keyLayout;
  }

  init(langID) {
    this.language = language[langID];
    this.main = document.createElement('main');
    this.output = document.createElement('textarea');
    this.keysContainer = document.createElement('div');
    this.keysContainer.classList.add('keyboard');
    this.output.classList.add('output');
    this.keysContainer.appendChild(this.createLayout());
    this.main.appendChild(this.output);
    this.main.appendChild(this.keysContainer);
    document.body.prepend(this.main);

    return this;
  }

  createKey(lowercase, shiftKey, code) {
    const keyElement = document.createElement('div');
    keyElement.classList.add('keyboard-key');
    keyElement.setAttribute('data-code', '');
    keyElement.setAttribute('data-func', '');
    const shiftChar = document.createElement('div');
    shiftChar.classList.add('char-shift');
    const char = document.createElement('div');
    char.classList.add('char');
    char.innerHTML = lowercase;

    if (code) keyElement.dataset.code = code;
    if (Boolean(code.match(/Back|Tab|Del|Caps|Enter|Shift|Ctrl|Alt|Win|Arrow/))) {
      keyElement.dataset.func = 'true';
    } else {
      keyElement.dataset.func = 'false';
    }

    if (shiftKey && shiftKey.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      shiftChar.innerHTML = shiftKey;
      keyElement.classList.add('key-shift');
    } else {
      shiftChar.innerHTML = '';
    }

    keyElement.appendChild(shiftChar);
    keyElement.appendChild(char);

    return keyElement;
  }

  createLayout() {
    const fragment = document.createDocumentFragment();

    keyLayout.forEach((row, i) => {
      const keyRow = document.createElement('div');
      keyRow.classList.add('keyboard-row');
      keyRow.setAttribute('data-row', `${i + 1}`);
      keyRow.style.gridTemplateColumns = `repeat(${row.length}, 1fr)`;

      this.language.forEach(key => {
        this.code = key.code;
        this.shiftKey = key.shiftKey;
        this.lowercase = key.lowercase;

        row.forEach(key => {
          if (key === this.code) {
            const keyElement = this.createKey(this.lowercase, this.shiftKey, this.code);
            keyRow.appendChild(keyElement);

            switch (key) {
              case 'Backspace':
                keyElement.classList.add('keyboard-key-wide');
                break;
              case 'Tab':
                keyElement.classList.add('keyboard-key-wide');
                break;
              case 'CapsLock':
                keyElement.classList.add('keyboard-key-wide');
                break;
              case 'LeftShift':
                keyElement.classList.add('keyboard-key-shift');
                break;
              case 'RightShift':
                keyElement.classList.add('keyboard-key-shift');
                break;
              case 'Enter':
                keyElement.classList.add('keyboard-key-enter');
                break;
              case 'Space':
                keyElement.classList.add('keyboard-key-space');
                break;
            }
          }
        })
      })
      fragment.appendChild(keyRow);
    })

    return fragment;
  }
}