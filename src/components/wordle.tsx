import Head from "next/head";
import { useState } from "react";
import * as wordle from "../lib/wordle";
import { Keyboard } from "./Keyboard";
import dictionary from "@/lib/dictionary.json"
import { useWindowSize } from './../lib/useWindowSize';
import { Modal } from "./Modal";
import { BoardBlock } from "./BoardBlock";

const {solutions, rest} = dictionary

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

const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] 
const DICTIONARY = solutions.concat(rest)

export default function Wordle() {

    const FONT = 'Segoe UI'
    const FONTWEIGHT = 500

    const {height} = useWindowSize()

    const [solution, setSolution] = useState(randomElement(solutions));
    const [cheat, setCheat] = useState<boolean>(false);

    const [draft, setDraft] = useState('')
    const [guesses, setGuesses] = useState<Guess[]>([])
    
    const addGuess = (word: string) => {
        setGuesses(oldGuesses => [...oldGuesses, {word, result: wordle.assess(word, solution).join('')}])
    }

    const onSubmit = () => {
        if (draft.length != 5) return
        if (draft === 'xyzzy') {setCheat(x => !x); setDraft(''); return}
        if (!DICTIONARY.includes(draft)) return
        addGuess(draft)
        setDraft('')
    }

    const guessedLetters:{[key:string]: number} = {}
    guesses.forEach(guess => {guess.word.split('').forEach((letter, i) => {
        const result = parseInt(guess.result[i])
        const existing = guessedLetters[letter] || -1
        guessedLetters[letter] = Math.max(result, existing)
    })})

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

    const isDone = [GameState.Won, GameState.Lost].includes(gameState)

    const numBlankRows = 6 - guesses.length - (isDone ? 0 : 1)

    const resetGame = () => {
        setCheat(false)
        setSolution(randomElement(solutions))
        setGuesses([])
        // setSolution('turbo')
        // setGuesses([{word: 'rates', result: '10000'}, {word: 'pinky', result: '00200'}, {word: 'cough', result:'01102'}])
    }

    return (
        <div className="bg-slate-100 flex flex-col items-center gap-4 py-2" style={{height: `${height}px`}}>
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
                                <link
                    href={`https://fonts.googleapis.com/css2?family=${FONT}:wght@${FONTWEIGHT}&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ `}
                    rel="stylesheet"
                />
            </Head>
            {isDone ? <Modal onClick={resetGame} win={gameState === GameState.Won} solution={solution}/> : ''}
            {cheat ? <div className="fixed top-1 mx-auto px-2 py-1 bg-black rounded text-white font-mono uppercase shadow z-40">{solution}</div> : ''}
            <Header onDoubleClick={resetGame} />
            <div className="fixed  bg-gradient-to-b from-red-700 to-red-800 text-white shadow-lg font-medium tracking-widest flex p-0.5 items-center justify-center rotate-45 w-32 -right-8 top-4 ">BETA</div>
            <div  className="flex grow w-full max-w-xs items-center">
                {/* <div className="outline outline-red-500 w-full"></div> */}
                <div 
                className="grid grid-cols-5 grid-rows-6 gap-2 w-full max-h-96 h-full" 
                // style={{fontFamily: `'${FONT}', 'Segoe UI'`, fontWeight:FONTWEIGHT}}
                >
                    {/* {Array.from({length:20}).map(() => <div className="bg-white rounded shadow"></div>)} */}
                    {guesses.map(({word, result}, i) => <BoardRow key={i} word={word} result={result} />)}
                    {isDone ? '' : <BoardRow word={draft + "_"} key={guesses.length} />}
                    {Array.from({length: numBlankRows}).map((_, i) => <BoardRow key={i + guesses.length + 1} />)}
                </div>

            </div>
            <Keyboard value={draft} setValue={setDraft} onSubmit={onSubmit} guessedLetters={guessedLetters} />
        </div>
    );
}



function Header(props) {
    return <header className="relative border-b-2 border-slate-400 w-full text-center max-w-md pt-1 pb-2 " {...props} >
        <span style={{ fontFamily: 'Bangers' }} className="absolute -translate-x-14 text-4xl transform -skew-y-3 text-amber-500" >
            <span className="">N</span>
            <span className="inline-block transform translate-y-1 text-amber-500">o</span>
            <span className="inline-block transform -translate-y-0.5">t</span>
        </span>
        <span className="inline-flex gap-0.5 font-medium text-xl">

        <span className="h-8 aspect-square rounded-sm shadow-md transform bg-lime-600 text-white flex items-center justify-center -rotate-6 scale-105">W</span>
        <span className="h-8 aspect-square rounded-sm shadow-md transform bg-slate-600 text-white flex items-center justify-center rotate-3">O</span>
        <span className="h-8 aspect-square rounded-sm shadow-lg scale-105 transform border-slate-400 bg-amber-500 text-white flex items-center justify-center -rotate-6 -translate-y-1">R</span>
        <span className="h-8 aspect-square rounded-sm shadow-md transform border-slate-400 bg-lime-600 text-white flex items-center justify-center rotate-3">D</span>
        <span className="h-8 aspect-square rounded-sm shadow-md transform bg-slate-600 text-white flex items-center justify-center">L</span>
        <span className="h-8 aspect-square rounded-sm shadow-md transform border-2 border-slate-400 bg-slate-50 rotate-6 translate-y-1 flex items-center justify-center">E</span>
        </span>
    </header>;
}

function BoardRow({word = '', result = ''}) {
    word = word + (word.length < 5 ? ' '.repeat(5 - word.length) : '');
    word = word.slice(0,5)
    const results = result.split('').map(x => parseInt(x)) as wordle.LetterState[]
    results.push( ...Array.from({length: 5 - results.length}).map(x => wordle.LetterState.empty))
    return <>
        {word.split('').map((char, index) => <BoardBlock key={index} char={char} state={results[index]} index={index} />)} 
    </>;
}


