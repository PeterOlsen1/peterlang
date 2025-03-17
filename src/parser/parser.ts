import { TokenType, Token } from "../lexer/token";
import { ExpressionParser } from "./expressionParser";
import { ExpressionEvaluator } from "../evaluator/expressionEvaluator";
import { ASTNode } from "./ast";

/**
 * Build an AST from a list of tokens!!!
 * 
 * Expressions are evaluated before being added to the AST
 *  need this to take into account variables
 * 
 * Get trees of inner scopes recursively.
 * not necessary to add line number for scope
 */
class Parser {
    private tokens: Token[] = [];
    private scope: ASTNode = new ASTNode(new Token(TokenType.SCOPE, "0", 0, 0));
    private current: number = 0;
    private start: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    handleExpression(tokens: Token[]): Token {
        const parser = new ExpressionParser(tokens);
        const parsed = parser.parseExpression();
        const evaluator = new ExpressionEvaluator(parsed);
        const res = evaluator.evaluate();
        return new Token(TokenType.NUMBER, res.toString(), res, tokens[0].line);
    }

    parse() {
        while (!this.end()) {
            this.start = this.current;
            this.parseToken();
        }
    }

    //call recurisvely on {} blocks
    parseToken(): ASTNode | undefined {
        const t = this.advance();
        switch (t.type) {
            case TokenType.NUMBER:
            case TokenType.MINUS:
            case TokenType.PLUS:
                const expressionEnd = this.findNext(TokenType.SEMICOLON);
                if (expressionEnd === -1) {
                    console.error("No semicolon found!");
                    break;
                }
                const expression = this.tokens.slice(this.start, expressionEnd);
                const result = this.handleExpression(expression);
                this.tokens = this.tokens.slice(0, this.start)
                    .concat(result)
                    .concat(this.tokens.slice(expressionEnd + 1));
                return new ASTNode(result);
            case TokenType.IDENTIFIER:
                const next = this.advance();
                if (next.type === TokenType.EQUAL) {
                    const expressionEnd = this.findNext(TokenType.SEMICOLON);
                    if (expressionEnd === -1) {
                        console.error("No semicolon found!");
                        break;
                    }
                    const expression = this.tokens.slice(this.start, expressionEnd);
                    const result = this.handleExpression(expression);
                    this.tokens = this.tokens.slice(0, this.start)
                        .concat(result)
                        .concat(this.tokens.slice(expressionEnd + 1));
                    return new ASTNode(result);
                }
                break;
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