import { TokenType, Token } from "../lexer/token";
import { ExpressionTree, BinaryNode, UnaryNode, MultiNode, Node } from "./expressionTree";
import { ExpressionParser } from "./expressionParser";

class Parser {
    private tokens: Token[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    parse() {
        const lines = [];
        let curExp = [];
        for (let token of this.tokens) {
            if (token.type === TokenType.SEMICOLON) {
                lines.push(curExp);
                curExp = [];
            } else {
                curExp.push(token);
            }
        }

        const exp = this.parseExpression(lines[0]);
        console.log(exp);
    }

    //PEMDAS
    parseExpression(tokens: Token[]) {
        console.log(tokens);
        const parser = new ExpressionParser(tokens);
        parser.parseExpression();
    }
}


export default Parser;