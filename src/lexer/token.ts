export enum TokenType {
    //define single character tokens
    RIGHT_PAREN = ")",
    LEFT_PAREN = "(",
    RIGHT_BRACE = "{",
    LEFT_BRACE = "}",
    SEMICOLON = ";",
    COMMA = ",",
    DOT = ".",
    MINUS = "-",
    PLUS = "+",
    SLASH = "/",
    STAR = "*",
    EQUAL = "=",
    BANG = "!",
    GREATER = ">",
    LESS = "<",

    //multi character tokens
    EQUAL_EQUAL = "==",
    LESS_EQUAL = "<=",
    GREATER_EQUAL = ">=",
    BANG_EQUAL = "!=",
    AND = "&&",
    OR = "||",

    //literals
    NUMBER = "NUMBER",
    STRING = "STRING",
    IDENTIFIER = "IDENTIFIER",

    //define keywords
    IF = "IF",
    ELSE = "ELSE",
    FUNCTION = "FUNCTION",
    WHILE = "WHILE",
    FOR = "FOR",
    RETURN = "RETURN",
    CONST = "CONST",
    LET = "LET",

    SCOPE = "SCOPE",

    ERROR = "ERROR"
}   

export const keywords: any = {
    "if": TokenType.IF,
    "else": TokenType.ELSE,
    "function": TokenType.FUNCTION,
    "while": TokenType.WHILE,
    "for": TokenType.FOR,
    "return": TokenType.RETURN,
    "let": TokenType.LET,
    "const": TokenType.CONST
}

export class Token {
    type: TokenType;
    lexeme: string;
    literal: any;
    line: number;

    /**
     * Create a new token instance
     */
    constructor(
        type: TokenType,
        lexeme: string,
        literal: any,
        line: number
    ) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
}