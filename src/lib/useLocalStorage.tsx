import { Dispatch, SetStateAction, useState } from "react";

const STORAGE: Storage | undefined = typeof window !== 'undefined' ? window?.localStorage : undefined

export function useLocalStorage<T>(key:string, initialValue:T):[T, Dispatch<SetStateAction<T>>] { 
    
    console.log('key', key, initialValue)
    const [value, setValue] = useState(getInitialValue(initialValue))
    
    const  setter: Dispatch<SetStateAction<T>> = (x:SetStateAction<T>) => {
        
        const xToStore = x instanceof Function ? x(value) : x;
        STORAGE?.setItem(key, JSON.stringify(xToStore))
        setValue(xToStore)
    }

    function getInitialValue(initialValue: T): T {
        if (!STORAGE) return initialValue
        const item = STORAGE?.getItem(key)
        if (typeof item == 'string') {
            return JSON.parse(item)
        } else { 
            setter(initialValue)
            return initialValue
        }
    }
    
    return [value, setter] 
}
