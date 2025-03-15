import { TokenType, Token } from "../lexer/token";
import { ExpressionParser } from "./expressionParser";
import { ExpressionEvaluator } from "../evaluator/expressionEvaluator";

/**
 * Build an AST from a list of tokens!!!
 */
class Parser {
    private tokens: Token[] = [];
    private current: number = 0;
    private start: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parseExpression(tokens: Token[]) {
        const parser = new ExpressionParser(tokens);
        return parser.parseExpression();
    }

    parse() {
        // const lines = [];
        // let curExp = [];
        // for (let token of this.tokens) {
        //     if (token.type === TokenType.SEMICOLON) {
        //         lines.push(curExp);
        //         curExp = [];
        //     } else {
        //         curExp.push(token);
        //     }
        // }

        while (!this.end()) {
            this.start = this.current;
            this.parseToken();
        }
    }

    parseToken() {
        const t = this.advance();
        switch (t.type) {
            case TokenType.NUMBER:
            case TokenType.MINUS:
            case TokenType.PLUS:
                console.log("Expression found!");
                const expressionEnd = this.findNext(TokenType.SEMICOLON);
                if (expressionEnd === -1) {
                    console.error("No semicolon found!");
                    break;
                }
                const expression = this.tokens.slice(this.start, expressionEnd);
                const result = this.parseExpression(expression);

            default:
                console.error("Token type is not recognized!");
                break;
        }
    }

    advance() {
        return this.tokens[this.current++];
    }

    end() {
        return this.current >= this.tokens.length;
    }

    /**
     * Find the next token of the given type from the
     * current index
     * 
     * @param type TokenType to find
     * @returns 
     */
    findNext(type: TokenType) {
        for (let i = this.current; i < this.tokens.length; i++) {
            if (this.tokens[i].type === type) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Find the location of a corresponding brace
     * 
     * @param brace index of a given brace
     * @returns corresponding index, else -1 if not found
     */
    findCorrespondingBrace(brace: number) {
        let count = 1;
        for (let i = brace + 1; i < this.tokens.length; i++) {
            if (this.tokens[i].type === TokenType.LEFT_BRACE) {
                count++;
            } else if (this.tokens[i].type === TokenType.RIGHT_BRACE) {
                count--;
            }

            if (count === 0) {
                return i;
            }
        }

        return -1;
    }
}


export default Parser;