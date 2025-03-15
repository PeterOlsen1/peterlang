import { TokenType, Token } from "../lexer/token";
import { ExpressionParser } from "./expressionParser";
import { ExpressionEvaluator } from "../evaluator/expressionEvaluator";

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

        let evaluator = new ExpressionEvaluator(exp);
        let result = evaluator.evaluate();
        console.log(result);
    }

    //PEMDAS
    parseExpression(tokens: Token[]) {
        console.log(tokens);
        const parser = new ExpressionParser(tokens);
        return parser.parseExpression();
    }
}


export default Parser;