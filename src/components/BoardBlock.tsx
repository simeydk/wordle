import { AnimatePresence, motion } from "framer-motion";
import * as wordle from "../lib/wordle";

const variants = {
    normal: {y: 0},
    up: {y: "-100%"},
    down: {y: "100%"},
}

export function BoardBlock({
    char = "",
    state = wordle.LetterState.empty,
    index = 0,
}: {
    char: string;
    state: wordle.LetterState;
    index: number;
}) {
    const stateClasses = {
        [wordle.LetterState.empty]: "bg-white  outline-slate-400",
        [wordle.LetterState.miss]: "bg-slate-500 text-white",
        [wordle.LetterState.present]: "bg-amber-500 text-white",
        [wordle.LetterState.exact]: "bg-lime-600 text-white",
    };
    const bg =
        char == " "
            ? ""
            : stateClasses[state] || "bg-pink-500 border border-pink-400";
    const blink = char == "_" ? "blink" : "";
    return (
        <div
            className={`relative bg-slate-200 rounded flex items-center justify-center w-full overflow-hidden`}
        >
            <AnimatePresence>

            {/* white block */}
            {char !== "_" && char !== " " && <motion.div
                variants={variants}
                animate={state >= 0 ? "down" : "normal"}
                initial={state >= 0 ? "normal" : "up"}
    
                transition={{duration: 0.15, ease: "easeInOut", delay:state >=0 ? 0.025 * index : 0}}
                className={`absolute inset-0 bg-white flex items-center justify-center`}
                >
                <h1 className={`text-2xl ${blink}`}>{char.toUpperCase()}</h1>
            </motion.div>}
            </AnimatePresence>
            <AnimatePresence>
            {/* colour block */}
            {state >= 0 && <motion.div
                variants={variants}
                animate="normal"
                initial="up"
                exit="up"
                transition={{duration: 0.15, ease: "easeInOut", delay: index * 0.25}}
                className={`absolute inset-0 ${bg} flex items-center justify-center`}
                >
                <h1 className={`text-2xl ${blink}`}>{char.toUpperCase()}</h1>
            </motion.div>}
            </AnimatePresence>
            <div className="absolute inset-0 shadow-[inset_0px_2px_5px_0px_#0004,_inset_-2px_-2px_3px_-1px_#FFF5]"></div>
        </div>
    );
}
