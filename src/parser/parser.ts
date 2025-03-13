import { TokenType, Token } from "../lexer/token";

class Parser {
    private tokens: Token[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse() {
        const expressions = [];
        let curExp = [];
        for (let token of this.tokens) {
            if (token.type === TokenType.SEMICOLON) {
                expressions.push(curExp);
                curExp = [];
            } else {
                curExp.push(token);
            }
        }

        console.log(expressions);
    }
}

export default Parser;