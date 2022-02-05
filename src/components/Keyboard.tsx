import React, { useEffect, useState } from "react";
import { BackspaceIcon, ArrowRightIcon } from "@heroicons/react/outline";
import Head from "next/head";
import * as wordle from "@/lib/wordle";

//  @ts-ignore
const INTERCEPTEDKEYS = ["backspace, enter", ..."abcdefghijklmnopqrstuvwxyz"];

export function Keyboard(props: {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: (word: string) => void;
    guessedLetters: { [key: string]: number };
}) {
    const { value, setValue } = props;

    const [isDown, setIsDown] = useState<{ [key: string]: boolean }>({});
    const setKey = (key: string, isDown: boolean) =>
        setIsDown((oldIsDown) => ({ ...oldIsDown, [key]: isDown }));

    const onClick = (e: React.MouseEvent) => {
        const name = e.target.name;
        if (name === "backspace") {
            setValue((value) => value.slice(0, -1));
        } else if (name === "enter") {
            props.onSubmit("onClick");
        } else if (INTERCEPTEDKEYS.includes(name)) {
            setValue((value) => value + name);
        }
    };

    const onKeyUp = (e) => {
        const key = e.key.toLowerCase();
        setKey(key, false);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        const key = e.key.toLowerCase();
        setKey(key, true);
        if (
            !e.altKey &&
            !e.ctrlKey &&
            !e.shiftKey &&
            INTERCEPTEDKEYS.includes(key)
        ) {
            console.log("preventDefault", key);
            e.preventDefault();
        }
        if (key === "backspace") {
            console.log("backspace", value);
            setValue((value) => value.slice(0, -1));
            return;
        } else if (key === "enter") {
            props.onSubmit();
            return;
        } else if ("abcdefghijklmnopqrstuvwxyz".includes(key)) {
            setValue((value) => value + e.key);
            return;
        } else {
        }
    };
    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [onKeyDown, onKeyUp]);

    const rowsRaw = ["qwertyuiop", "asdfghjkl", "zxcvbnm"].map((row) =>
        row.split("")
    );

    const rows = rowsRaw.map((row) =>
        row.map((char) => (
            <Key
                key={char}
                char={char}
                onClick={onClick}
                isDown={isDown[char]}
                state={props.guessedLetters[char]}
            />
        ))
    );
    rows[1] = [
        <div className="col-span-1" key="space1"></div>,
        ...rows[1],
        <div className="col-span-1" key="space2"></div>,
    ];
    rows[2] = [
        <EnterKey
            key="enter"
            isDown={isDown["enter"]}
            onClick={props.onSubmit}
        />,
        ...rows[2],
        <BackSpaceKey
            key="bs"
            onClick={() => setValue((x) => x.slice(0, -1))}
            isDown={isDown["backspace"]}
        />,
    ];
    const font = "IBM Plex Mono";
    return (
        <form
            onSubmit={(e) => e.preventDefault()}
            className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 items-center w-full max-w-[52rem] px-2 font-medium"
            style={{ fontFamily: font }}
            onKeyUp={onKeyUp}
        >
            <Head>
                <link
                    href={`https://fonts.googleapis.com/css2?family=${font}&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ`}
                    rel="stylesheet"
                />
            </Head>
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="hidden"
            />
            {rows.map((row, i) => (
                <>{row}</>
            ))}
        </form>
    );
}

const buttonStyle = { boxShadow: "0 2px 2px -1px #0006" };
const buttonClass =
    "h-[8vh] min-h-[3.5rem]  rounded rounded-b-md font-medium transition duration-100 hover:scale-105 active:scale-95  px-2 py-1 flex ";
const BackSpaceKey = ({ onClick, isDown }): JSX.Element => (
    <button
        style={buttonStyle}
        className={
            " bg-red-200 text-red-700 col-span-3 items-center justify-center " +
            buttonClass +
            (isDown ? "scale-75" : "")
        }
        name="backspace"
        onClick={onClick}
        type="button"
    >
        {<BackspaceIcon className="h-6 w-6" />}
    </button>
);
const EnterKey = ({ onClick, isDown }): JSX.Element => (
    <button
        style={buttonStyle}
        className={
            "bg-emerald-200 text-emerald-800 col-span-3 items-center justify-center " +
            buttonClass +
            (isDown ? "scale-75" : "")
        }
        name="enter"
        type="submit"
        onClick={onClick}
    >
        {<ArrowRightIcon className="h-6 w-6" />}
    </button>
);

function Key({
    char,
    onClick,
    isDown = false,
    state = wordle.LetterState.empty,
}: {
    char: string;
    onClick: (e: React.MouseEvent) => {};
    isDown: boolean;
    state?: wordle.LetterState;
}): JSX.Element {
    const stateClasses = {
        [wordle.LetterState.empty]: "bg-slate-300",
        [wordle.LetterState.miss]: "bg-slate-500 text-white",
        [wordle.LetterState.present]: "bg-amber-500 text-white",
        [wordle.LetterState.exact]: "bg-lime-600 text-white",
    };
    const bg =
        state !== undefined
            ? stateClasses[state] || "bg-slate-300"
            : "bg-slate-300";
    return (
        <button
            style={buttonStyle}
            className={
                bg + " col-span-2 " + buttonClass + (isDown ? "scale-75" : "")
            }
            name={char}
            onClick={onClick}
            type="button"
        >
            {char.toUpperCase()}
        </button>
    );
}
