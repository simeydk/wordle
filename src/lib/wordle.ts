
export enum LetterState {
    empty = -1,
    miss = 0,
    present = 1,
    exact = 2
  }
  
export function assess(word: string, solution: string): LetterState[] {
    const w = word.toLocaleLowerCase().split('');
    const sol = solution.toLocaleLowerCase().split('');
    const result: LetterState[] = w.map(() => LetterState.miss)
    
    // knock off exact matches
    for (let i = 0; i < w.length; i++) {
        if (w[i] === sol[i]) {
            result[i] = LetterState.exact
            sol[i] = null
        }
    }
    
    // knock off present matches
    for (let i = 0; i < w.length; i++) {
        if (result[i] === LetterState.exact) {continue};
        for (let j = 0; j < sol.length; j++) {
            if ((w[i] === sol[j]) && sol[i]) {
                result[i] = LetterState.present
                sol[j] = null
                break
            }
        }
    }
    
    return result

}

export function testAssess(word:string, solution:string, expectedResult: string) {
    const assessResult = assess(word, solution)
    let result = true
    assessResult.forEach((x,i) => {
        if(x.toString() != expectedResult[i]) {
            result = false
        }
    })
    if (!result) {
        // raise an error
        throw new Error(`Assessment failed for word ${word} and solution ${solution}. Expected ${expectedResult} but got ${assessResult.join('')}`)
    }
    return `(${word}, ${solution}) => ${assessResult.join('')} | ${expectedResult} => ${result}`
}


