import Head from "next/head";
import { useState } from "react";
import * as wordle from "../lib/wordle";
import { Keyboard } from "./Keyboard";

enum GameState {
    NotStarted,
    Started,
    Won,
    Lost
}

type Guess = {
    word: string;
    result: string
}

const DICTIONARY = ['learn', 'build', 'stash', 'steal', 'stare', 'stamp', 'stare', 'steal', 'stash']

export default function Wordle() {

    const SOLUTION = "build";

    const [draft, setDraft] = useState('')
    const [guesses, setGuesses] = useState<Guess[]>([])
    const numBlankRows = 6 - guesses.length - 1
    
    const addGuess = (word: string) => {
        setGuesses(oldGuesses => [...oldGuesses, {word, result: wordle.assess(word, SOLUTION).join('')}])
    }

    const onSubmit = () => {
        if (draft.length != 5) return
        if (!DICTIONARY.includes(draft)) return
        addGuess(draft)
        setDraft('')
    }

    const guessedLetters = {}
    guesses.forEach(guess => {guess.word.split('').forEach((letter, i) => {guessedLetters[letter] = Math.max(parseInt(guess.result[i]), guessedLetters[letter] === undefined ? -1 : guessedLetters[letter])})})

    let gameState: GameState
    if (guesses.length && guesses[guesses.length - 1].result === '22222') {
        gameState = GameState.Won
    } else if (guesses.length >= 6) {
        gameState = GameState.Lost
    } else if (draft || guesses.length > 0) {
        gameState = GameState.Started
    } else {
        gameState = GameState.NotStarted
    } 

    return (
        <div className="bg-slate-100 h-screen flex flex-col items-center gap-4 py-2">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Bangers&text=NotWordle"
                    rel="stylesheet"
                />
            </Head>
            <h1 style={{fontFamily: 'Bangers'}} className="text-3xl p-2 transform -skew-y-3 bg-gradient-to-tr from-lime-600 to-green-700 text-transparent bg-clip-text">
                Not Wordle
            </h1>
            <div className="flex grow w-full max-w-xs">
                {/* <div className="outline outline-red-500 w-full"></div> */}
                <div className="grid grid-cols-5 grid-rows-6 gap-2 w-full max-h-96">
                    {/* {Array.from({length:20}).map(() => <div className="bg-white rounded shadow"></div>)} */}
                    {guesses.map(({word, result}, i) => <BoardRow key={i} word={word} result={result} />)}
                    <BoardRow word={draft + "_"} key={guesses.length} />
                    {Array.from({length: numBlankRows}).map((_, i) => <BoardRow key={i + guesses.length + 1} />)}
                </div>

            </div>
            <Keyboard value={draft} setValue={setDraft} onSubmit={onSubmit} />
        </div>
    );
}



function BoardRow({word = '', result = ''}) {
    word = word + (word.length < 5 ? ' '.repeat(5 - word.length) : '');
    word = word.slice(0,5)
    const results = result.split('').map(x => parseInt(x)) as wordle.LetterState[]
    results.push( ...Array.from({length: 5 - results.length}).map(x => wordle.LetterState.empty))
    return <>
        {word.split('').map((char, index) => <BoardBlock key={index} char={char} state={results[index]} />)} 
    </>;
}

function BoardBlock({char = '', state = wordle.LetterState.empty} : {char: string, state: wordle.LetterState}) {
    const stateClasses = {
        [wordle.LetterState.empty]: 'bg-white border-2 border-slate-300',
        [wordle.LetterState.miss]: 'bg-slate-500 text-white',
        [wordle.LetterState.present]: 'bg-amber-500 text-white',
        [wordle.LetterState.exact]: 'bg-lime-600 text-white',
    };
    const bg = char == ' ' ? 'bg-white' : stateClasses[state] || 'bg-pink-500 border border-pink-400';
    return <div className={`${bg} rounded flex items-center justify-center w-full shadow `}>
        <h1 className="text-2xl font-medium">{char.toUpperCase()}</h1>
    </div>;
}
    

