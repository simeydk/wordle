import { BoardBlock } from "@/components/BoardBlock";
import { LetterState } from "@/lib/wordle";
import { useState } from 'react';

const states = [
    { char: " ", },
    { char: "a", state:LetterState.empty, },
    { char: "a", state:LetterState.exact, },
];

export default () => {
    const [index, setIndex] = useState(2)

    return (
        <div className="h-screen bg-slate-200 flex items-center justify-center" onClick={() => setIndex(i => (i + 1) % states.length)}>
            <div className="bg-slate-300 border-2 border-dashed h-16 w-16 overflow-hidden">
                <div className="w-full h-full hover:translate-y-[-100%] transition-transform duration-200">
                    <div className="bg-white w-full h-full"></div>
                    <div className="bg-pink-500 w-full h-full"></div>
                </div>
            </div>
            <div className="h-12 w-12 outline-pink-300 bg-blue-300 grid">
                <BoardBlock {...states[index]} index={3} />
            </div>
            <div className="h-24 w-24 m-8 bg-lime-600 rounded text-6xl font-[Arial] font-bold text-white flex justify-center items-center">W</div>
        </div>
    );
};
