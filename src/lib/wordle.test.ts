import * as wordle from './wordle'

const ls = wordle.LetterState

const scenarios = [
    ['abcde','lmnop','00000'],
    ['abcde','xxxxa','10000'],
    ['abcde','abcde','22222'],
    ['pizzaz','pizzaz','222222'],
    ['wizzaz','pizzaz','022222'],
    ['wipzaz','pizzaz','021222'],
    ['ebxda','abcde','12021'],
    ['aa__a','xxxaa','10002'],
    ['arise','wards','11010'],
    ['xab','yab','022'],
    ['aabxx','babyy','02200'],
    // ['aabbx','babay','12210'],
    ["abc", "123", "000"],
    ["abc", "abc", "222"],
    ["abc", "axc", "202"],
    ["abc", "cab", "111"],
    ["ccx", "aac", "100"],
    ["bobba","xxxbb", "10020"],
    ["bba","xxb", "100"],
    ["bbbaa","xxxbb", "11000"],
    ["rates","rehab", "21010"]
]
scenarios.forEach(([word, solution, expectedResult]) => {
    test(`assess(${word}, ${solution}) = ${expectedResult}`, () => {
        expect(wordle.assess(word, solution).join('')).toEqual(expectedResult)
    })
})