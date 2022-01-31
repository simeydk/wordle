import React, { useEffect, useState } from "react"
import {BackspaceIcon, ArrowRightIcon} from "@heroicons/react/outline"
import Head from "next/head"

//  @ts-ignore
const INTERCEPTEDKEYS = ['backspace, enter', ...'abcdefghijklmnopqrstuvwxyz']

export function Keyboard(props: {value: string, setValue: React.Dispatch<React.SetStateAction<string>>, onSubmit: (word:string) => void}) {
    const {value, setValue} = props

    const [isDown, setIsDown] = useState<{[key:string]:boolean}>({})
    const setKey = (key: string, isDown: boolean) => setIsDown(oldIsDown => ({...oldIsDown, [key]: isDown}))

    const onClick = (e: React.MouseEvent) => {
        const name = e.target.name
        if (name === 'backspace') {
            setValue(value => value.slice(0, -1))
        } else if (name === 'enter') {
            props.onSubmit('onClick')
        } else if (INTERCEPTEDKEYS.includes(name)) {
            setValue(value => value + name)
        }
    }

    
    const onKeyUp = (e) => {
        const key = e.key.toLowerCase()
        setKey(key, false)
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        const key = e.key.toLowerCase()
        if (!e.altKey && !e.ctrlKey && !e.shiftKey && INTERCEPTEDKEYS.includes(key)) {
            setKey(key, true)
            console.log("preventDefault", key)
            e.preventDefault()
        }
        if (key === 'backspace') {
            console.log('backspace', value)
            setValue(value => value.slice(0, -1))
            return
        } else if (key === 'enter') {
            props.onSubmit()
            return
        } else if ('abcdefghijklmnopqrstuvwxyz'.includes(key)) {
            setValue(value => value + e.key)
            return
        } else {
            
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        window.addEventListener('keyup', onKeyUp)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            window.removeEventListener('keyup', onKeyUp)
        }
    }, [onKeyDown, onKeyUp])


    
    const rowsRaw = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map(row => row.split(''));
    
    const rows = rowsRaw.map(row => row.map((char) => <Key key={char} char={char} onClick={onClick} isDown={isDown[char]} />));
    rows[1] = [<div className="col-span-1" key="space1"></div>, ...rows[1], <div className="col-span-1" key="space2"></div>];
    rows[2] = [<BackSpaceKey key="bs" onClick={() => setValue(x => x.slice(0,-1))} isDown={isDown['backspace']} />, ...rows[2], <EnterKey key="enter" isDown={isDown['enter']} onClick={props.onSubmit} />];
    const font = "IBM Plex Mono"
    return (<form onSubmit={e => e.preventDefault()} className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1 items-center w-full max-w-lg px-2 font-medium" style={{fontFamily: font}} onKeyUp={onKeyUp}>
        <Head>
        <link
                    href={`https://fonts.googleapis.com/css2?family=${font}&text=ABCDEFGHIJKLMNOPQRSTUVWXYZ`}
                    rel="stylesheet"
                />
        </Head>
        <input value={value} onChange={e => setValue(e.target.value)} className="hidden"/>
        {rows.map((row, i) => <>{row}</>)}
    </form> 
    )

}

const BackSpaceKey = ({onClick, isDown}): JSX.Element => <button className={"bg-red-200 text-red-700 h-12 col-span-3 grow rounded rounded-b-md shadow bevel flex items-center justify-center p-0.5 hover:scale-105 active:scale-95 " + (isDown ? "scale-75" : "")} name="backspace" onClick={onClick} type="button">{<BackspaceIcon className="h-6 w-6"/>}</button>;
const EnterKey = ({onClick, isDown}): JSX.Element => <button className={"bg-emerald-200 text-emerald-700 h-12 col-span-3 grow rounded rounded-b-md shadow bevel flex items-center justify-center p-0.5  hover:scale-105 active:scale-95 " + (isDown ? "scale-75" : "")} name="enter" type="submit" onClick={onClick}>{<ArrowRightIcon className="h-6 w-6"  />}</button>;

const Key = ({char, onClick, isDown = false}: {char: string, onClick: (e: React.MouseEvent) => {}, isDown: boolean }): JSX.Element => <button className={"bg-slate-300 h-12 col-span-2 rounded rounded-b-md shadow bevel font-medium transition duration-100 hover:scale-105 active:scale-95  px-2 py-1 flex " + (isDown ? "scale-75" : "")} name={char} onClick={onClick} type="button">{char.toUpperCase()}</button>;
