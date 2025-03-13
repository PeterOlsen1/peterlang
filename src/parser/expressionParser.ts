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

    parseExpression(): ExpressionTree | Node {
        //check if the expression contains parentheses
        const paren = this.findNext(TokenType.LEFT_PAREN);
        if (paren !== -1) {
            const sliced = this.tokens.slice(paren + 1, this.findCorrespondingParen());
            const parser = new ExpressionParser(sliced);
            const inner = parser.parseExpression();

            //replace parenthesis with the expression tree
            this.tokens = this.tokens.slice(0, paren).concat(inner).concat(this.tokens.slice(this.findCorrespondingParen() + 1));
        }

        const operator = this.findNextOperator();
        if (operator == -1) {
            //no operator was found
            const token = this.advance();
            return new Node(token);
        }

        let left = this.tokens.slice(0, operator);
        let right = this.tokens.slice(operator + 1);

        const parser = new ExpressionParser(left);
        let leftTree = parser.parseExpression();
        parser.reset(right);
        let rightTree = parser.parseExpression();  

        const op = this.tokens[operator];
        const node = new BinaryNode(op, leftTree, rightTree);
        return node;
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
     * Find the next operator in the order of presedence
     */
    findNextOperator(): number {
        let multi = this.findNext(TokenType.STAR);
        if (multi) {
            return multi;
        }
        let slash = this.findNext(TokenType.SLASH);
        if (slash) {
            return slash;
        }
        let plus = this.findNext(TokenType.PLUS);
        if (plus) {
            return plus;
        }
        let minus = this.findNext(TokenType.MINUS);
        if (minus) {
            return minus;
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