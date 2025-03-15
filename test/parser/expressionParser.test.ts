import { ExpressionParser } from "../../src/parser/expressionParser";
import { Token, TokenType } from "../../src/lexer/token";
import { ExpressionTree } from "../../src/parser/expressionTree";

describe('ExpressionParser', () => {
    it('should parse an expression with no parenthesis', () => {
        const tokens = [
            new Token(TokenType.NUMBER, '3', 3, 1),
            new Token(TokenType.STAR, '*', null, 1),
            new Token(TokenType.NUMBER, '2', 2, 1),
            new Token(TokenType.PLUS, '+', null, 1),
            new Token(TokenType.NUMBER, '5', 5, 1),
        ];

        const parser = new ExpressionParser(tokens);
        const tree = parser.parseExpression();

        expect(tree.token).toEqual(tokens[3]);
        expect(tree.children[0].token).toEqual(tokens[0]);
        expect(tree.children[1].token).toEqual(tokens[4]);
    });

    it('should parse an expression with parenthesis', () => {
        const tokens = [
            new Token(TokenType.NUMBER, '3', 3, 1),
            new Token(TokenType.STAR, '*', null, 1),
            new Token(TokenType.LEFT_PAREN, '(', null, 1),
            new Token(TokenType.NUMBER, '2', 2, 1),
            new Token(TokenType.PLUS, '+', null, 1),
            new Token(TokenType.NUMBER, '5', 5, 1),
            new Token(TokenType.RIGHT_PAREN, ')', null, 1),
        ];

        const parser = new ExpressionParser(tokens);
        const tree = parser.parseExpression();

        expect(tree.token).toEqual(tokens[1]);
        expect(tree.children[0].token).toEqual(tokens[0]);
        expect(tree.children[1].token).toEqual(tokens[5]);
    });
});