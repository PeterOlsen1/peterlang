import { TokenType, Token } from "../lexer/token";
import { ExpressionParser } from "./expressionParser";
import { ExpressionNode, IfNode, ScopeNode, VariableNode, WhileNode } from "./ast";
import { ParserError } from "./error";

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

    constructor(tokens: Token[], scope: number = 0) {
        this.tokens = tokens;
        this.scope.from.line = scope;
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
                    throw new ParserError("No semicolon found!", t);
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
                    throw new ParserError("Expexted identifier after let/const!", t);
                }

                //ensure equal sign after identifier
                const next = this.advance();
                if (next.type === TokenType.EQUAL) {
                    const expressionEnd = this.findNext(TokenType.SEMICOLON);
                    if (expressionEnd === -1) {
                        throw new ParserError("No semicolon found!", t);
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
                    throw new ParserError("No corresponding brace found!", t);
                }
                const innerScope = new Parser(this.tokens.slice(this.current, end), t.line).parse();
                this.scope.add(innerScope);
                this.current = end;
                break;
            case TokenType.WHILE:
                //find the while loop condition
                const startParen = this.advance();
                if (startParen.type !== TokenType.LEFT_PAREN) {
                    throw new ParserError("Expected '(' after while!", t);
                }

                const endParen = this.findCorrespondingParen(this.current);
                if (endParen === -1) {
                    throw new ParserError("No corresponding ')' found!", startParen);
                }

                //make expression node out of the condition
                const tokenSlice = this.tokens.slice(this.current, endParen);
                const condition = this.handleExpression(tokenSlice);
                this.current = endParen;

                const startBrace = this.advance();
                if (startBrace.type !== TokenType.LEFT_BRACE) {
                    throw new ParserError("Expected '{' after while!", t);
                }

                const endBrace = this.findCorrespondingBrace(this.current);
                if (endBrace === -1) {
                    throw new ParserError("No corresponding '}' found!", startBrace);
                }

                const innerWhile = new Parser(this.tokens.slice(this.current, endBrace), t.line).parse();
                this.current = endBrace;
                const whileNode = new WhileNode(t, condition, innerWhile);
                this.scope.add(whileNode);
                break;
            case TokenType.IF:
                //find the if condition and parenthesis locations
                const lParen = this.advance();
                if (lParen.type !== TokenType.LEFT_PAREN) {
                    throw new ParserError("Expected '(' after if!", t);
                }

                const rParen = this.findCorrespondingParen(this.current);
                if (rParen === -1) {
                    throw new ParserError("No corresponding ')' found!", lParen);
                }

                //handle the expression
                const exp = this.tokens.slice(this.current, rParen);
                const conditionNode = this.handleExpression(exp);
                this.current = rParen;

                //find the body of the if statement
                const lBrace = this.advance();
                if (lBrace.type !== TokenType.LEFT_BRACE) {
                    throw new ParserError("Expected '{' after if!", t);
                }

                const rBrace = this.findCorrespondingBrace(this.current);
                if (rBrace === -1) {
                    throw new ParserError("No corresponding '}' found!", lBrace);
                }

                //parse the scope
                const ifBlock = this.tokens.slice(this.current, rBrace);
                const ifScope = new Parser(ifBlock, t.line).parse();
                this.current = rBrace;

                //check out the else. if it doesn't exist, just add the if scope
                let elseScope: ScopeNode | null = null;
                const elseToken = this.advance();
                if (elseToken.type === TokenType.ELSE) {
                    const elseBrace = this.advance();
                    if (elseBrace.type !== TokenType.LEFT_BRACE) {
                        throw new ParserError("Expected '{' after else!", elseToken);
                    }
                    const elseEndBrace = this.findCorrespondingBrace(this.current);
                    if (elseEndBrace === -1) {
                        throw new ParserError("No corresponding '}' found!", elseBrace);
                    }
                    const elseBlock = this.tokens.slice(this.current, elseEndBrace);
                    elseScope = new Parser(elseBlock, t.line).parse();
                    this.current = elseEndBrace;
                }

                //add the node to the scope
                const ifNode = new IfNode(t, conditionNode, ifScope, elseScope);
                this.scope.add(ifNode);
                break;
            case TokenType.IDENTIFIER:
                //do other stuff if this is a function
                const eq = this.advance();
                if (eq.type === TokenType.EQUAL) {
                    const expressionEnd = this.findNext(TokenType.SEMICOLON);
                    if (expressionEnd === -1) {
                        throw new ParserError("No semicolon found!", t);
                    }

                    const expression = this.tokens.slice(this.start, expressionEnd);
                    const result = this.handleExpression(expression);
                    const varNode = new VariableNode(t.lexeme, t, result);
                    this.current = expressionEnd;
                    this.scope.add(varNode);
                }
                break;
            case TokenType.SEMICOLON:
                break;
            case TokenType.RIGHT_BRACE:
                if (this.scope.from.line === 0) {
                    throw new ParserError("Unexpected '}'!", t);
                }
                else {
                    break;
                }
            default:
                throw new ParserError("Token type is not recognized!", t);
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
                return i + 1;
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
                return i + 1;
            }
        }

        return -1;
    }
}


export default Parser;