import { motion } from "framer-motion";
import { useState } from "react";

const mainVariants = {
    off: {  },
    on: {
        // background: "white",
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const liVariants = {
    off: { y: -10, opacity:0.5 },
    on: { y: 0, opacity:1, duration: 1 },
};

export default () => {
    const [isOn, setIsOn] = useState(false);
    const variant = isOn ? "on" : "off";
    return (
        <motion.div
            variants={mainVariants}
            animate={variant}
            onClick={() => setIsOn((x) => !x)}
            className="h-screen flex items-center justify-center bg-slate-200"
        >
            <motion.ul className="grid grid-cols-5 gap-2 w-64 h-12">
                {Array(5).fill(0).map((_, i) =>(
                    <motion.li
                        animate={false}
                        variants={liVariants}
                        className=" bg-white rounded shadow flex items-center justify-center"
                    ></motion.li>
                ))}
            </motion.ul>
        </motion.div>
    );
};

function repeat(x, n) {
    return Array(n).fill(x);
}
