import React, { useState } from "react"
import {BackspaceIcon, ArrowRightIcon} from "@heroicons/react/outline"

//  @ts-ignore
const INTERCEPTEDKEYS = ['backspace, enter', ...'abcdefghijklmnopqrstuvwxyz']

export function Keyboard(props) {``
    const [value, setValue] = useState<string>('')
    const onClick = (e: React.MouseEvent) => {
        const name = e.target.name
        if (name === 'backspace') {
            setValue(value => value.slice(0, -1))
        } else if (name === 'enter') {
            alert(value)
            setValue('')
        } else {
            setValue(value => value + name)
        }
    }
    const onSubmit = (e) => {
        e.preventDefault()
        alert("submit!")
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        const key = e.key.toLowerCase()

        if (!e.altKey && !e.ctrlKey && !e.shiftKey && INTERCEPTEDKEYS.includes(key)) {
            console.log("preventDefault", key)
            e.preventDefault()
        }
        if (key === 'backspace') {
            console.log('backspace', value)
            setValue(value => value.slice(0, -1))
            return
        } else if (key === 'enter') {
            alert(value)
            return
        } else if ('abcdefghijklmnopqrstuvwxyz'.includes(key)) {
            setValue(value => value + e.key)
            return
        } else {
            
        }
    }

    const onKeyUp = (e) => {}

    const rowsRaw = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map(row => row.split(''));
    
    const rows = rowsRaw.map(row => row.map((char) => <Key key={char} char={char} onClick={onClick}/>));
    rows[1] = [<div className="col-span-1" key="space1"></div>, ...rows[1], <div className="col-span-1" key="space2"></div>];
    rows[2] = [<BackSpaceKey key="bs" onClick={() => setValue(value => value.slice(0,-1))}/>, ...rows[2], <EnterKey key="enter" />];
    
    return (<form onSubmit={onSubmit} className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 items-center w-full max-w-lg" onKeyDown={onKeyDown} onKeyUp={onKeyUp}>
        <input value={value} onChange={e => setValue(e.target.value)} className="hidden"/>
        {rows.map((row, i) => <>{row}</>)}
    </form> 
    )

}

const BackSpaceKey = ({onClick}): JSX.Element => <button className="bg-red-200 text-red-700 h-12 col-span-3 grow rounded shadow bevel flex items-center justify-center p-0.5 hover:scale-105 active:scale-95" name="backspace" onClick={onClick} type="button">{<BackspaceIcon className="h-6 w-6"/>}</button>;
const EnterKey = (): JSX.Element => <button className="bg-emerald-200 text-emerald-700 h-12 col-span-3 grow rounded shadow bevel flex items-center justify-center p-0.5  hover:scale-105 active:scale-95" name="enter" type="submit">{<ArrowRightIcon className="h-6 w-6" />}</button>;

const Key = ({char, onClick}: {char: string, onClick: (e: React.MouseEvent) => {} }): JSX.Element => <button className="bg-slate-300 h-12 col-span-2 rounded shadow bevel font-medium transition duration-100 hover:scale-105 active:scale-95  px-2 py-1 flex" name={char} onClick={onClick} type="button">{char.toUpperCase()}</button>;
