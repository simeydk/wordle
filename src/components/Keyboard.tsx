export function Keyboard(props) {
    const onClick = (e) => {
        const name = e.target.name
        alert(name)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        alert("submit!")
    }
    const rowsRaw = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map(row => row.split(''));
    
    const rows = rowsRaw.map(row => row.map(char => <Key char={char} onClick={onClick}/>));
    rows[2] = [<BackSpaceKey onClick={onClick}/>, ...rows[2], <EnterKey onClick={onClick}/>];
    return (<form onSubmit={onSubmit} className="flex flex-col gap-1 items-center">
        {rows.map(row => <div className="flex gap-1">{row}</div>)}

    </form> 
    )
    return <div className="flex flex-col gap-1 items-center">
        {rowsRaw.map(row => <div key={row.join('')} className="flex gap-1">
        {row.map(key => <button key={key} className="bg-slate-300 h-12 w-8 rounded shadow">{key.toUpperCase()}</button>)}
    </div>)}</div>;

}

const BackSpaceKey = ({onClick}) => <button className="bg-slate-300 h-12 w-12 grow rounded shadow" name={"backspace"} onClick={onClick}>{"<=="}</button>;
const EnterKey = ({onClick}) => <button className="bg-slate-300 h-12 w-12 grow rounded shadow" name={"enter"} onClick={onClick}>{"⏎"}</button>;

const Row = ({children}) => <div className="flex gap-1">{children}</div>;

const Key = ({char, onClick}) => <button className="bg-slate-300 h-12 w-8 rounded shadow" name={char} onClick={onClick} type="button">{char.toUpperCase()}</button>;
