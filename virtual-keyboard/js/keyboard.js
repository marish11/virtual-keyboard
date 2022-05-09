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
    this.isCapsLock = false;
    this.shiftPressed = false;
    this.altPressed = false;
  }

  init(langID) {
    this.language = language[langID];
    this.main = document.createElement('main');
    this.header = document.createElement('h1');
    this.header.classList.add('header');
    this.header.innerHTML = 'Virtual Keyboard';
    this.output = document.createElement('textarea');
    this.keysContainer = document.createElement('div');
    this.keysContainer.classList.add('keyboard');
    this.output.classList.add('output');
    this.keysContainer.appendChild(this.createLayout());
    this.info = document.createElement('div');
    this.info.classList.add('info');
    this.OS = document.createElement('p');
    this.hotKeys = document.createElement('p');
    this.OS.innerHTML = 'This keyboard was created in Windows';
    this.hotKeys.innerHTML = 'Press left <code>Alt + Ctrl</code> to change language';
    this.info.appendChild(this.OS);
    this.info.appendChild(this.hotKeys);
    this.main.appendChild(this.header);
    this.main.appendChild(this.output);
    this.main.appendChild(this.keysContainer);
    this.main.appendChild(this.info);
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

    this.keysContainer.addEventListener('mousedown', this.handleMouse);
    this.keysContainer.addEventListener('mouseup', this.handleMouse);

    return fragment;
  }

  handle = (event) => {
    event.preventDefault();
    const key = this.keyElements.find((key) => key.dataset.code === event.code);
    if (!key) return;
    this.output.focus();

    if (event.type === 'keydown') {
      if (event.code === 'AltLeft') this.altPressed = true;
      if (event.code === 'ControlLeft' && this.altPressed) this.changeLanguage();

      if (key.dataset.code === 'CapsLock' && !this.isCapsLock) {
        this.isCapsLock = true;
        this.toggleUpperCase();
        key.classList.add('caps-active');
      } else if (this.isCapsLock && key.dataset.code === 'CapsLock') {
        this.isCapsLock = false;
        this.toggleLowerCase();
        key.classList.remove('caps-active');
      }

      if (event.shiftKey && !this.isCapsLock) {
        this.shiftPressed = true;
        this.toggleUpperCase();
        this.toggleShiftKey();
      } else if (event.shiftKey && this.isCapsLock) {
        this.shiftPressed = true;
        this.toggleLowerCase();
        this.toggleShiftKey();
      }
    }

    if (event.type === 'keyup' && !event.shiftKey && !this.isCapsLock) {
      this.shiftPressed = false;
      this.toggleLowerCase();
      this.removeShiftKey();
    } else if (event.type === 'keyup' && !event.shiftKey && this.isCapsLock) {
      this.shiftPressed = false;
      this.toggleUpperCase();
      this.removeShiftKey();
    }

    this.language.forEach(el => {
      if (el.code === event.code) {
        let position = this.output.selectionStart;
        const positionFromLeft = this.output.value.slice(0, position);
        const positionFromRight = this.output.value.slice(position);

        if (event.type === 'keydown') {
          key.classList.add('active');

          if (event.code.match(/Caps|Alt|Control|Shift|MetaLeft|Backspace|Space|Tab|Arrow|Enter|Del/)) return;

          if (this.isCapsLock && !this.shiftPressed) {
            if (this.getFromLocalStorage('lang') === 'ru') {
              if (key.dataset.func === 'false' && !key.dataset.code.match(/Digit|Backslash|Slash|Minus|Equal/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              } else if (key.dataset.func === 'false' && key.dataset.code.match(/Digit|Backslash|Slash|Minus|Equal/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              }
            } else if (this.getFromLocalStorage('lang') === 'en') {
              if (key.dataset.func === 'false' && !key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              } else if (key.dataset.func === 'false' && key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              }
            }
          }

          if (this.shiftPressed && !this.isCapsLock) {
            position += 1;
            this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
          } else if (this.shiftPressed && this.isCapsLock) {
            if (this.getFromLocalStorage('lang') === 'ru') {
              if (key.dataset.func === 'false' && key.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              } else if (key.dataset.func === 'false' && !key.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              }
            } else if (this.getFromLocalStorage('lang') === 'en') {
              if (key.dataset.func === 'false' && !key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              } else if (key.dataset.func === 'false' && key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              }
            }
          }

          if (!this.isCapsLock && !this.shiftPressed) {
            position += 1;
            this.output.value = positionFromLeft + el.lowercase + positionFromRight;
          }
        } else if (event.type === 'keyup') {
          key.classList.remove('active');
        }

        switch (event.code) {
          case 'Tab':
            position += 1;
            this.output.value = positionFromLeft + '\t' + positionFromRight;
            break;
          case 'Enter':
            position += 1;
            this.output.value = positionFromLeft + '\n' + positionFromRight;
            break;
          case 'Space':
            position += 1;
            this.output.value = positionFromLeft + ' ' + positionFromRight;
            break;
          case 'ArrowLeft':
            position = position - 1 >= 0 ? position - 1 : 0;
            break;
          case 'ArrowRight':
            position += 1;
            break;
          case 'Delete':
            this.output.value = positionFromLeft + positionFromRight.slice(1);
            break;
          case 'Backspace':
            this.output.value = positionFromLeft.slice(0, -1) + positionFromRight;
            break;
        }

        this.output.setSelectionRange(position, position);
      }
    })
  }

  handleMouse = (event) => {
    event.stopPropagation();
    const key = event.target.closest('.keyboard-key');
    if (!key) return;

    if (event.type === 'mousedown') {
      if (key.dataset.code === 'CapsLock' && !this.isCapsLock) {
        this.isCapsLock = true;
        this.toggleUpperCase();
        key.classList.add('caps-active');
      } else if (this.isCapsLock && key.dataset.code === 'CapsLock') {
        this.isCapsLock = false;
        this.toggleLowerCase();
        key.classList.remove('caps-active');
      }

      if (key.dataset.code.match(/Shift/) && !this.isCapsLock) {
        this.shiftPressed = true;
        this.toggleUpperCase();
        this.toggleShiftKey();
      } else if (key.dataset.code.match(/Shift/) && this.isCapsLock) {
        this.shiftPressed = true;
        this.toggleLowerCase();
        this.toggleShiftKey();
      }
    }

    if (event.type === 'mouseup' && this.shiftPressed && !this.isCapsLock) {
      this.shiftPressed = false;
      this.toggleLowerCase();
      this.removeShiftKey();
    } else if (event.type === 'mouseup' && this.shiftPressed && this.isCapsLock) {
      this.shiftPressed = false;
      this.toggleUpperCase();
      this.removeShiftKey();
    }

    this.language.forEach(el => {
      if (el.code === key.dataset.code) {
        let position = this.output.selectionStart;
        const positionFromLeft = this.output.value.slice(0, position);
        const positionFromRight = this.output.value.slice(position);

        if (event.type === 'mousedown') {
          key.classList.add('active');

          if (key.dataset.code.match(/Caps|Alt|Control|Shift|MetaLeft|Backspace|Space|Tab|Arrow|Enter|Del/)) return;

          if (this.isCapsLock && !this.shiftPressed) {
            if (this.getFromLocalStorage('lang') === 'ru') {
              if (key.dataset.func === 'false' && !key.dataset.code.match(/Digit|Backslash|Slash|Minus|Equal/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              } else if (key.dataset.func === 'false' && key.dataset.code.match(/Digit|Backslash|Slash|Minus|Equal/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              }
            } else if (this.getFromLocalStorage('lang') === 'en') {
              if (key.dataset.func === 'false' && !key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              } else if (key.dataset.func === 'false' && key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              }
            }
          }

          if (this.shiftPressed && !this.isCapsLock) {
            position += 1;
            this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
          } else if (this.shiftPressed && this.isCapsLock) {
            if (this.getFromLocalStorage('lang') === 'ru') {
              if (key.dataset.func === 'false' && key.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              } else if (key.dataset.func === 'false' && !key.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              }
            } else if (this.getFromLocalStorage('lang') === 'en') {
              if (key.dataset.func === 'false' && !key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.shiftKey + positionFromRight;
              } else if (key.dataset.func === 'false' && key.dataset.code.match(/Key/)) {
                position += 1;
                this.output.value = positionFromLeft + el.lowercase + positionFromRight;
              }
            }
          }

          if (!this.isCapsLock && !this.shiftPressed) {
            position += 1;
            this.output.value = positionFromLeft + el.lowercase + positionFromRight;
          }
        } else if (event.type === 'mouseup') {
          key.classList.remove('active');
        }

        switch (key.dataset.code) {
          case 'Tab':
            position += 1;
            this.output.value = positionFromLeft + '\t' + positionFromRight;
            break;
          case 'Enter':
            position += 1;
            this.output.value = positionFromLeft + '\n' + positionFromRight;
            break;
          case 'Space':
            position += 1;
            this.output.value = positionFromLeft + ' ' + positionFromRight;
            break;
          case 'ArrowLeft':
            position = position - 1 >= 0 ? position - 1 : 0;
            break;
          case 'ArrowRight':
            position += 1;
            break;
          case 'Delete':
            this.output.value = positionFromLeft + positionFromRight.slice(1);
            break;
          case 'Backspace':
            this.output.value = positionFromLeft.slice(0, -1) + positionFromRight;
            break;
        }

        this.output.setSelectionRange(position, position);
      }
    })
  }

  changeLanguage() {
    const langID = Object.keys(language);
    let index = langID.indexOf(this.keysContainer.dataset.language);
    this.language = index + 1 < langID.length ? language[langID[index += 1]] : language[langID[index -= index]];

    this.keysContainer.dataset.language = langID[index];
    this.setToLocalStorage('lang', langID[index]);

    this.keyElements.forEach((keyEl) => {
      const key = this.language.find((key) => key.code === keyEl.dataset.code);
      if (!key) return;
      keyEl.firstElementChild.innerHTML = key.shiftKey;
      keyEl.lastElementChild.innerHTML = key.lowercase;
    });

    if (this.isCapsLock) this.toggleUpperCase();
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
      if (this.getFromLocalStorage('lang') === 'ru') {
        if (keyEl.dataset.func === 'false' && keyEl.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
          shiftChar.classList.remove('hidden');
          char.classList.add('hidden');
        }
      } else if (this.getFromLocalStorage('lang') === 'en') {
        if (keyEl.dataset.func === 'false' && !keyEl.dataset.code.match(/Key/)) {
          shiftChar.classList.remove('hidden');
          char.classList.add('hidden');
        }
      }
    })
  }

  removeShiftKey() {
    this.keyElements.forEach(keyEl => {
      const shiftChar = keyEl.firstElementChild;
      const char = keyEl.lastElementChild;
      if (this.getFromLocalStorage('lang') === 'ru') {
        if (keyEl.dataset.func === 'false' && keyEl.dataset.code.match(/Digit|Minus|Equal|Backslash|Slash/)) {
          shiftChar.classList.add('hidden');
          char.classList.remove('hidden');
        }
      } else if (this.getFromLocalStorage('lang') === 'en') {
        if (keyEl.dataset.func === 'false' && !keyEl.dataset.code.match(/Key/)) {
          shiftChar.classList.add('hidden');
          char.classList.remove('hidden');
        }
      }
    })
  }

  setToLocalStorage(name, value) {
    window.localStorage.setItem(name, value);
  }
  
  getFromLocalStorage(name, value = null) {
    return window.localStorage.getItem(name) || value;
  }
}