import { ExpressionTree, BinaryNode, UnaryNode, MultiNode, Node } from "./expressionTree";
import { TokenType, Token } from "../lexer/token";
import { ExpressionEvaluator } from "../evaluator/expressionEvaluator";

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

    parseExpression(): ExpressionTree {
        // Check if the expression contains parentheses
        const paren = this.findNext(TokenType.LEFT_PAREN);
        if (paren !== -1) {
            const sliced = this.tokens.slice(paren + 1, this.findCorrespondingParen(paren));
            const parser = new ExpressionParser(sliced);
            const inner = parser.parseExpression();

            //evaluate the inner expression tree and turn it into a token
            const evaluator = new ExpressionEvaluator(inner);
            const result = evaluator.evaluate();
            const resultToken = new Token(TokenType.NUMBER, result.toString(), result, inner.token.line);

            // replace the parenthesized expression with the result
            this.tokens = this.tokens.slice(0, paren)
                .concat(resultToken)
                .concat(this.tokens.slice(this.findCorrespondingParen(paren) + 1));
        }

        const operator = this.findNextOperator();
        if (operator == -1) {
            // no operator was found, so return the leaf node
            const token = this.advance();
            return new ExpressionTree(token);
        }

        let left = this.tokens.slice(0, operator);
        let right = this.tokens.slice(operator + 1);

        const parser = new ExpressionParser(left);
        let leftTree = parser.parseExpression();
        parser.reset(right);
        let rightTree = parser.parseExpression();

        const op = this.tokens[operator];
        return new ExpressionTree(op, leftTree, rightTree);
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

    /**
     * Find the next operator in the order of precedence
     * 
     * We want to build the tree with the lowest presedence at the
     * bottom so we can evaluate from there up
     */
    findNextOperator(): number {
        const precedence = [
            TokenType.STAR,
            TokenType.SLASH,
            TokenType.PLUS,
            TokenType.MINUS
        ];

        for (let type of precedence.reverse()) {
            const index = this.findNext(type);
            if (index !== -1) {
                return index;
            }
        }
        return -1;
    }

    findCorrespondingParen(idx: number = this.current): number {
        let i = idx;
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