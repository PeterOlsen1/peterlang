import { Token } from "../lexer/token";

export class ParserError extends Error {
    token: Token;

    constructor(message: string, token: Token) {
        message = `${message} Line: ${token.line}`;
        super(message);
        this.token = token;
    }
}