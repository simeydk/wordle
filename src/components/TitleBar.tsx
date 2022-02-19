export function TitleBar(props) {
    return (
        <header
            className="relative border-b-2 border-slate-400 w-full text-center max-w-md pt-1 pb-2 "
            {...props}
        >
            <span
                style={{ fontFamily: "Bangers" }}
                className="absolute -translate-x-14 text-4xl transform -skew-y-3 text-amber-500"
            >
                <span className="">N</span>
                <span className="inline-block transform translate-y-1 text-amber-500">
                    o
                </span>
                <span className="inline-block transform -translate-y-0.5">
                    t
                </span>
            </span>
            <span className="inline-flex gap-0.5 font-medium text-xl">
                <span className="h-8 aspect-square rounded-sm shadow-md transform bg-lime-600 text-white flex items-center justify-center -rotate-6 scale-105">
                    W
                </span>
                <span className="h-8 aspect-square rounded-sm shadow-md transform bg-slate-600 text-white flex items-center justify-center rotate-3">
                    O
                </span>
                <span className="h-8 aspect-square rounded-sm shadow-lg scale-105 transform border-slate-400 bg-amber-500 text-white flex items-center justify-center -rotate-6 -translate-y-1">
                    R
                </span>
                <span className="h-8 aspect-square rounded-sm shadow-md transform border-slate-400 bg-lime-600 text-white flex items-center justify-center rotate-3">
                    D
                </span>
                <span className="h-8 aspect-square rounded-sm shadow-md transform bg-slate-600 text-white flex items-center justify-center">
                    L
                </span>
                <span className="h-8 aspect-square rounded-sm shadow-md transform border-2 border-slate-400 bg-slate-50 rotate-6 translate-y-1 flex items-center justify-center">
                    E
                </span>
            </span>
        </header>
    );
}
