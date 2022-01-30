import Head from "next/head";
import { useState } from "react";
import * as wordle from "../lib/wordle";
import { Keyboard } from "./Keyboard";



export default function Wordle() {

    const [draft, setDraft] = useState('wat')
    const [guesses, setGuesses] = useState([{word:'spoon', result:'01200'}, {word: 'pinky', result : '12010'}])
    const numBlankRows = 6 - guesses.length - 1
    const onSubmit = () => {
        setGuesses(oldGuesses => [...oldGuesses, {word: 'fluff', result: '02012'}])
    }

    return (
        <div className="bg-slate-100 min-h-screen flex flex-col items-center justify-center gap-2">
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
            <h1 style={{fontFamily: 'Bangers'}} className="text-4xl p-4 transform -skew-y-3 bg-gradient-to-tr from-lime-600 to-green-700 text-transparent bg-clip-text">
                Not Wordle
            </h1>
            {guesses.map(({word, result}, i) => <BoardRow key={i} word={word} result={result} />)}
            <BoardRow word={draft} key={guesses.length} />
            {Array.from({length: numBlankRows}).map((_, i) => <BoardRow key={i + guesses.length + 1} />)}
            {/* <BoardRow word="" />
            <BoardRow word="" />
            <BoardRow word="" />
            <BoardRow word="" /> */}
            
            

            <Keyboard onEnter={onSubmit} onBackSpace={() => setDraft(draft => draft.slice(0,-1))} />
        </div>
    );
}



function BoardRow({word = '', result = ''}) {
    word = word + ' '.repeat(5 - word.length);
    const results = result.split('').map(x => parseInt(x)) as wordle.LetterState[]
    results.push( ...Array.from({length: 5 - results.length}).map(x => wordle.LetterState.empty))
    return <div className="flex gap-2">
        {word.split('').map((char, index) => <BoardBlock char={char} state={results[index]} />)}
       
    </div>;
}

function BoardBlock({char = '', state = wordle.LetterState.empty} : {char: string, state: wordle.LetterState}) {
    const stateClasses = {
        [wordle.LetterState.empty]: 'bg-white',
        [wordle.LetterState.miss]: 'bg-slate-500 text-white',
        [wordle.LetterState.present]: 'bg-amber-500 text-white',
        [wordle.LetterState.exact]: 'bg-lime-600 text-white',
    };
    return <div className={`w-12 h-12 ${stateClasses[state] || 'bg-white'} rounded shadow flex items-center justify-center`}>
        <h1 className="text-2xl font-medium">{char.toUpperCase()}</h1>
    </div>;
}
    

