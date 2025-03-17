import { TokenType, Token } from "../lexer/token";
import { ExpressionParser } from "./expressionParser";
import { ExpressionEvaluator } from "../evaluator/expressionEvaluator";
import { ASTNode, ExpressionNode, ScopeNode, VariableNode, WhileNode } from "./ast";

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
    private scope: ScopeNode = new ScopeNode(new Token(TokenType.SCOPE, "0", 0, 0), []);
    private current: number = 0;
    private start: number = 0;

    constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    handleExpression(tokens: Token[]): ExpressionNode {
        const parser = new ExpressionParser(tokens);
        const parsed = parser.parseExpression();
        return new ExpressionNode(tokens[0], parsed);
    }

    parse(): ScopeNode {
        while (!this.end()) {
            this.start = this.current;
            this.parseToken();
        }

        return this.scope;
    }

    //call recurisvely on {} blocks
    parseToken() {
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
                this.current = expressionEnd;
                this.scope.add(result);
                break;
            case TokenType.LET:
            case TokenType.CONST:
                //make sure there is an identifier after a let/const
                const tIdentifier = this.advance();
                if (tIdentifier.type !== TokenType.IDENTIFIER) {
                    console.error("Expected identifier after let/const!");
                    break;
                }

                //ensure equal sign after identifier
                const next = this.advance();
                if (next.type === TokenType.EQUAL) {
                    const expressionEnd = this.findNext(TokenType.SEMICOLON);
                    if (expressionEnd === -1) {
                        console.error("No semicolon found!");
                        break;
                    }

                    const expression = this.tokens.slice(this.start, expressionEnd);
                    const result = this.handleExpression(expression);
                    const varNode = new VariableNode(tIdentifier.lexeme, tIdentifier, result);
                    this.current = expressionEnd;
                    this.scope.add(varNode);
                }
                else {
                    //uninitialized varaible
                    const varNode = new VariableNode(tIdentifier.lexeme, tIdentifier, null);
                    this.scope.add(varNode);
                }
                break;
            case TokenType.LEFT_BRACE:
                const end = this.findCorrespondingBrace(this.current - 1);
                if (end === -1) {
                    console.error("No corresponding brace found!");
                    break;
                }
                const innerScope = new Parser(this.tokens.slice(this.current, end)).parse();
                this.scope.add(innerScope);
                this.current = end;
                break;
            case TokenType.WHILE:
                //find the while loop condition
                const startParen = this.advance();
                if (startParen.type !== TokenType.LEFT_PAREN) {
                    console.error("Expected '(' after while!");
                    break;
                }

                const endParen = this.findCorrespondingParen(this.current);
                if (endParen === -1) {
                    console.error("No corresponding ')' found!");
                    break;
                }

                const tokenSlice = this.tokens.slice(this.current, endParen);
                const condition = this.handleExpression(tokenSlice);
                this.current = endParen;

                const startBrace = this.advance();
                if (startBrace.type !== TokenType.LEFT_BRACE) {
                    console.error("Expected '{' after while!");
                    break;
                }

                const endBrace = this.findCorrespondingBrace(this.current);
                if (endBrace === -1) {
                    console.error(`No corresponding '}' found for while on line ${startParen.line}!`);
                    break;
                }

                const innerWhile = new Parser(this.tokens.slice(this.current, endBrace)).parse();
                this.current = endBrace;
                const whileNode = new WhileNode(t, condition, innerWhile);
                this.scope.add(whileNode);
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

    advanceTo(pos: number) {
        this.current = pos;
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

    findCorrespondingParen(paren: number) {
        let count = 1;
        for (let i = paren + 1; i < this.tokens.length; i++) {
            if (this.tokens[i].type === TokenType.LEFT_PAREN) {
                count++;
            } else if (this.tokens[i].type === TokenType.RIGHT_PAREN) {
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