import { motion } from "framer-motion";

const bgVariants = {
    hide: {
        opacity: 0,
    },
    show: {
        opacity: 1,
    }
}

export function Modal({ onClick = () => { alert('Play Again!'); }, win = true }) {
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
            <motion.div initial={{scale: 0.7, opacity: 0.3}} animate={{scale:1, opacity:1}} className="relative z-20 bg-white rounded-lg shadow-lg p-4 w-full max-w-sm m-4">
                <h2 className="text-3xl py-4">
                    {win ? "You Won!" : "Better Luck next time"}
                </h2>
                <button onClick={onClick} className=" ml-auto p-2 bg-lime-600 font-medium text-white px-4 rounded shadow">Play Again</button>
            </motion.div>
            <motion.div initial={{opacity: 0}} animate={{opacity:1}} transition={{duration: 0.2}} className="fixed inset-0 z-10 bg-slate-600/30 flex justify-center items-center backdrop-blur-[2px]"></motion.div>
        </div>

    );
}
