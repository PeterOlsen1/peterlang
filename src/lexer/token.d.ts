import { TokenType } from "./token.ts" 

export class Token {
    type: TokenType;
    lexeme: string;
    literal: any;
    line: number;

    constructor(
        type: TokenType,
        lexeme: string,
        literal: any,
        line: number
    )
}

/**
 * here is the process:
 * scan the file and look for lexemes
 * [a-zA-Z_][a-zA-Z_0-9]* -> variable
 * [0-9]+ -> integer
 * [0-9]+\.[0-9]+ -> float
 * 
 * 1. read the file
 * 2. scan the file
 * 3. look for lexemes
 * 4. return the lexemes
 */
