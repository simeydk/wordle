import { AnimatePresence, motion } from "framer-motion";
import * as wordle from "../lib/wordle";

export function BoardBlock({
    char = "",
    state = wordle.LetterState.empty,
}: {
    char: string;
    state: wordle.LetterState;
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

            {char !== "_" && char !== " " && <motion.div
                animate={{y:state < 0 ? 0 : 70}}
                initial={{y:-70}}
                // exit={{y:10, opacity: 0.3}}
                transition={{duration: 0.2, ease: "easeInOut"}}
                className={`absolute inset-0 bg-white flex items-center justify-center`}
                >
                <h1 className={`text-2xl ${blink}`}>{char.toUpperCase()}</h1>
            </motion.div>}
            {state >= 0 && <motion.div
                animate={{y:0}}
                initial={{y:-70}}
                transition={{duration: 0.2, ease: "easeInOut", delay: 0.7}}
                className={`absolute inset-0 ${bg} flex items-center justify-center`}
                >
                <h1 className={`text-2xl ${blink}`}>{char.toUpperCase()}</h1>
            </motion.div>}
            </AnimatePresence>
            <div className="absolute inset-0 shadow-[inset_0px_2px_5px_0px_#0004,_inset_-2px_-2px_3px_-1px_#FFF5]"></div>
        </div>
    );
}
