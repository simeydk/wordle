import Head from "next/head";
import { useState } from "react";
import * as wordle from "../lib/wordle";
import { Keyboard } from "./Keyboard";
import dictionary from "@/lib/dictionary.json";
import { useWindowSize } from "./../lib/useWindowSize";
import { Modal } from "./Modal";
import { BoardBlock } from "./BoardBlock";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { TitleBar } from "./TitleBar";



const { solutions, rest } = dictionary;

enum GameState {
    InProgress,
    Won,
    Lost,
}

type Guess = {
    word: string;
    result: string;
};

type Score = 0 | 1 | 2 | 3 | 4 | 5 | 6

type Scores = {
    [key in Score]: number;
};

type Stats = {
    played: number;
    won: number;
    lost: number;
    streak: number;
    allTimeStreak: number;
    scores: Scores
}

const NewStats = ():Stats => {
    return {
        played: 0,
        won: 0,
        lost: 0,
        streak: 0,
        allTimeStreak: 0,
        scores: {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
        }
    }
}

const useStats = (): [Stats, (score: Score) => void] => {
    const [stats, setStats] = useLocalStorage<Stats>("stats", NewStats());
    const submitResult = (result: Score) => {
        const won: number  = result === 0 ? 0 : 1;
        const streak = result === 0 ? 0 : stats.streak + 1;
        const allTimeStreak = Math.max(streak, stats.allTimeStreak);
        setStats({
            ...stats,
            played: stats.played + 1,
            won: stats.won + won,
            lost: stats.lost + (1 - won),
            streak,
            allTimeStreak,
            scores: {
                ...stats.scores,
                [result]: stats.scores[result] + 1
            }
        })
    }
    return [stats, submitResult];
}

const randomElement = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];
const DICTIONARY = solutions.concat(rest);

export default function Wordle() {

    const [stats, submitResult] = useStats();

    const { height } = useWindowSize();
    
    const [solution, setSolution] = useLocalStorage<string>("solution", randomElement(solutions));
    const [cheat, setCheat] = useState<boolean>(false);

    const [draft, setDraft] = useState("");
    const [guesses, setGuesses] = useLocalStorage<Guess[]>("guesses", []);

    const addGuess = (word: string) => {
        const newGuesses = [
            ...guesses,
            { word, result: wordle.assess(word, solution).join("") },
        ]
        setGuesses(newGuesses);
        const gameState = getGameState(guesses)
        const newGameState = getGameState(newGuesses)
        if ((newGameState == GameState.Won || newGameState == GameState.Lost) && gameState == GameState.InProgress) {
            const score: Score = newGameState == GameState.Won ? newGuesses.length as Score : 0;
            submitResult(score)
        }
        
    };

    const onSubmit = () => {
        if (draft.length != 5) return;
        if (draft === "xyzzy") {
            setCheat((x) => !x);
            setDraft("");
            return;
        }
        if (!DICTIONARY.includes(draft)) return;
        addGuess(draft);
        setDraft("");
    };

    const guessedLetters: { [key: string]: number } = {};
    guesses.forEach((guess) => {
        guess.word.split("").forEach((letter, i) => {
            const result = parseInt(guess.result[i]);
            const existing = guessedLetters[letter] || -1;
            guessedLetters[letter] = Math.max(result, existing);
        });
    });

    let gameState: GameState = getGameState(guesses, draft);

    const isDone = [GameState.Won, GameState.Lost].includes(gameState);

    const numBlankRows = 6 - guesses.length - (isDone ? 0 : 1);

    const resetGame = () => {
        setCheat(false);
        setSolution(randomElement(solutions));
        setGuesses([]);
    };

    const rowStates = [...guesses];
    if (!isDone) {
        rowStates.push({ word: draft });
    }
    rowStates.push(...Array.from({ length: numBlankRows }, () => ({})));

    return (
        <div
            className="bg-slate-100 flex flex-col items-center gap-4 py-2"
            style={{ height: `${height}px` }}
        >
            <WorldeHead />
            {isDone ? (
                <Modal
                    onClick={resetGame}
                    win={gameState === GameState.Won}
                    solution={solution}
                />
            ) : (
                ""
            )}
            {cheat ? (
                <div className="fixed top-1 mx-auto px-2 py-1 bg-black rounded text-white font-mono uppercase shadow z-40">
                    {solution}
                </div>
            ) : (
                ""
            )}
            <div className="absolute bottom-2 left-2 right-2 rounded bg-white shadow p-2">
                <form onSubmit={(e) => {e.preventDefault(); submitResult(Number(e.target.number.value) as Score) }}><input name="number" type="number" /><button type="submit">go</button></form>
                <pre>{JSON.stringify(stats, null, 2)}
                </pre>
            </div>
            <TitleBar onDoubleClick={resetGame} />
            <BetaBanner />
            <div className="flex grow w-full max-w-xs items-center">
                {/* <div className="outline outline-red-500 w-full"></div> */}
                <div className="grid grid-cols-5 grid-rows-6 gap-2 w-full max-h-96 h-full">
                    {rowStates.map((row, i) => (
                        <BoardRow key={i} {...row} />
                    ))}
                    {/* {Array.from({length:20}).map(() => <div className="bg-white rounded shadow"></div>)}
                    {guesses.map(({word, result}, i) => <BoardRow key={i} word={word} result={result} />)}
                    {isDone ? '' : <BoardRow word={draft + "_"} key={guesses.length} />}
                    {Array.from({length: numBlankRows}).map((_, i) => <BoardRow key={i + guesses.length + 1} />)} */}
                </div>
            </div>
            <Keyboard
                value={draft}
                setValue={setDraft}
                onSubmit={onSubmit}
                guessedLetters={guessedLetters}
            />
        </div>
    );
}

function getGameState(guesses: Guess[]) {
    let gameState: GameState;
    if (guesses.length && guesses[guesses.length - 1].result === "22222") {
        gameState = GameState.Won;
    } else if (guesses.length >= 6) {
        gameState = GameState.Lost;
    } else {
        gameState = GameState.InProgress;
    }
    return gameState;
}

function BetaBanner() {
    return (
        <div className="fixed  bg-gradient-to-b from-red-700 to-red-800 text-white shadow-lg font-medium tracking-widest flex p-0.5 items-center justify-center rotate-45 w-32 -right-8 top-4 ">
            BETA
        </div>
    );
}

function BoardRow({ word = "", result = "" }) {
    word = word + (word.length < 5 ? " ".repeat(5 - word.length) : "");
    word = word.slice(0, 5);
    const results = result
        .split("")
        .map((x) => parseInt(x)) as wordle.LetterState[];
    results.push(
        ...Array.from({ length: 5 - results.length }).map(
            (x) => wordle.LetterState.empty
        )
    );
    return (
        <>
            {word.split("").map((char, index) => (
                <BoardBlock
                    key={index}
                    char={char}
                    state={results[index]}
                    index={index}
                />
            ))}
        </>
    );
}

function WorldeHead() {
    return (
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
    );
}