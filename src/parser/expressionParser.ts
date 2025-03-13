import { ExpressionTree, BinaryNode, UnaryNode, MultiNode, Node } from "./expressionTree";
import { TokenType, Token } from "../lexer/token";

export class ExpressionParser {
    tokens: Token[] = [];
    current: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    reset(tokens: Token[]) {
        this.tokens = tokens;
        this.current = 0;
    }

    parseExpression() {
        //check if the expression contains parentheses
        const paren = this.findNext(TokenType.LEFT_PAREN);
        if (paren !== -1) {
            const parser = new ExpressionParser(this.tokens.slice(paren + 1, this.findCorrespondingParen()));
            parser.parseExpression();
        }

        // const ast = new Ast();

        console.log(this.findCorrespondingParen());
    }

    end() {
        return this.current >= this.tokens.length;
    }

    advance() {
        return this.tokens[this.current++];
    }

    peek() {
        return this.tokens[this.current];
    }

    findNext(type: TokenType): number {
        let i = this.current;
        while (i < this.tokens.length) {
            if (this.tokens[i].type === type) {
                return i;
            }
            i++;
        }
        return -1;
    }

    findCorrespondingParen(): number {
        let i = this.current;
        let count = 0;
        while (i < this.tokens.length) {
            if (this.tokens[i].type === TokenType.LEFT_PAREN) {
                count++;
            } else if (this.tokens[i].type === TokenType.RIGHT_PAREN) {
                count--;
                if (count === 0) {
                    return i;
                }
            }
            i++;
        }
        return -1;
    }
}