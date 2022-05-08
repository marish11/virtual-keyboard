import language from '../layouts.js';

export const keyLayout = [
  ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
  ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash', 'Delete'],
  ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
  ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'ControlRight']
];

export default class Keyboard {
  constructor() {
    this.keyLayout = keyLayout;
    this.keyElements = [];
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
    shiftChar.classList.add('hidden');
    const char = document.createElement('div');
    char.classList.add('char');
    char.innerHTML = lowercase;

    if (code) keyElement.dataset.code = code;
    if (Boolean(code.match(/Backspace|Tab|Del|Caps|Enter|Shift|Control|Alt|Meta|Arrow/))) {
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
              case 'ShiftLeft':
                keyElement.classList.add('keyboard-key-shift');
                break;
              case 'ShiftRight':
                keyElement.classList.add('keyboard-key-shift');
                break;
              case 'Enter':
                keyElement.classList.add('keyboard-key-enter');
                break;
              case 'Space':
                keyElement.classList.add('keyboard-key-space');
                break;
            }
            this.keyElements.push(keyElement);
          }
        })
      })
      fragment.appendChild(keyRow);
    })

    document.addEventListener('keydown', this.handle);
    document.addEventListener('keyup', this.handle);

    return fragment;
  }

  handle = (event) => {
    event.preventDefault();
    const key = this.keyElements.find((key) => key.dataset.code === event.code);
    if (!key) return;
    this.output.focus();

    if (event.type === 'keydown') {
      if (event.getModifierState('CapsLock')) this.toggleUpperCase();
      else if (event.getModifierState('CapsLock') && event.code === 'CapsLock') this.toggleLowerCase();

      if (event.shiftKey && !event.getModifierState('CapsLock')) {
        this.toggleUpperCase();
        this.toggleShiftKey();
      } else if (event.shiftKey && event.getModifierState('CapsLock')) {
        this.toggleLowerCase();
        this.toggleShiftKey();
      }
    }

    if (event.type === 'keyup' && !event.shiftKey && !event.getModifierState('CapsLock')) {
      this.toggleLowerCase();
      this.removeShiftKey();
    } else if (event.type === 'keyup' && !event.shiftKey && event.getModifierState('CapsLock')) {
      this.toggleUpperCase();
      this.removeShiftKey();
    }

    this.language.forEach(el => {
      if (el.code === event.code) {
        if (event.type === 'keydown') {
          key.classList.add('active');

          if (event.getModifierState('CapsLock') && event.code === 'CapsLock') key.classList.add('caps-active');
          else key.classList.remove('caps-active');

          if (event.code.match(/Caps|Alt|Control|Shift|MetaLeft|Backspace|Space|Tab/)) return;

          if (event.getModifierState('CapsLock') && !event.shiftKey) {
            if (key.dataset.func === 'false' && !key.dataset.code.match(/Digit/)) {
              this.output.value += el.shiftKey;
            } else if (key.dataset.func === 'false' && key.dataset.code.match(/Digit/)) {
              this.output.value += el.lowercase;
            }
          }

          if (event.shiftKey && !event.getModifierState('CapsLock')) {
            this.output.value += el.shiftKey;
          } else if (event.shiftKey && event.getModifierState('CapsLock')) {
            if (key.dataset.func === 'false' && key.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
              this.output.value += el.shiftKey;
            } else if (key.dataset.func === 'false' && !key.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
              this.output.value += el.lowercase;
            }
          }

          if (!event.getModifierState('CapsLock') && !event.shiftKey) this.output.value += el.lowercase;

        } else if (event.type === 'keyup') {
          key.classList.remove('active');
        }
      }
    })
  }

  toggleUpperCase() {
    this.keyElements.forEach(keyEl => {
      const char = keyEl.lastElementChild.innerHTML;
      if (keyEl.dataset.func === 'false') {
        keyEl.lastElementChild.innerHTML = char.toUpperCase();
      }
    })
  }

  toggleLowerCase() {
    this.keyElements.forEach(keyEl => {
      const char = keyEl.lastElementChild.innerHTML;
      if (keyEl.dataset.func === 'false') {
        keyEl.lastElementChild.innerHTML = char.toLowerCase();
      }
    })
  }

  toggleShiftKey() {
    this.keyElements.forEach(keyEl => {
      const shiftChar = keyEl.firstElementChild;
      const char = keyEl.lastElementChild;
      if (keyEl.dataset.func === 'false' && keyEl.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
        shiftChar.classList.remove('hidden');
        char.classList.add('hidden');
      }
    })
  }

  removeShiftKey() {
    this.keyElements.forEach(keyEl => {
      const shiftChar = keyEl.firstElementChild;
      const char = keyEl.lastElementChild;
      if (keyEl.dataset.func === 'false' && keyEl.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
        shiftChar.classList.add('hidden');
        char.classList.remove('hidden');
      }
    })
  }
}