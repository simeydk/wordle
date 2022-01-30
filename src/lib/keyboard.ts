import { LetterState } from "./wordle"


type KBState = { [key: string]: LetterState }

function createKeyboardState(initialState: LetterState = LetterState.miss): KBState {
    return Object.fromEntries('abcdefghijklmnopqrstuvwxyz'.split('').map(x => [x, LetterState.miss]))
}

function updateKeyBoardState(currentState: KBState, word: string, result: LetterState[]) {
    const newState = { ...currentState }
    for (let i = 0; i < word.length; i++) {
        newState[word[i]] = result[i]
    }
    return newState
}

const QWERTY = "qwertyuiopasdfghjklzxcvbnm"