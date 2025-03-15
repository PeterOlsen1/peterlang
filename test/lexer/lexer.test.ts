import Lexer from '../../src/lexer/lexer';
import { TokenType, Token } from '../../src/lexer/token';

describe('Lexer', () => {
    const lexer = new Lexer("");

    it('should tokenize an expression with no parenthesis', () => {
        const input = '3 * 2 + 5';
        const tokens = lexer.lexString(input);

        expect(tokens).toEqual([
            new Token(TokenType.NUMBER, '3', 3, 1),
            new Token(TokenType.STAR, '*', null, 1),
            new Token(TokenType.NUMBER, '2', 2, 1),
            new Token(TokenType.PLUS, '+', null, 1),
            new Token(TokenType.NUMBER, '5', 5, 1),
        ]);
    });

    it('should tokenize an expression with parenthesis', () => {
        const input = '3 * (2 + 5)';
        const tokens = lexer.lexString(input);

        expect(tokens).toEqual([
            new Token(TokenType.NUMBER, '3', 3, 1),
            new Token(TokenType.STAR, '*', null, 1),
            new Token(TokenType.LEFT_PAREN, '(', null, 1),
            new Token(TokenType.NUMBER, '2', 2, 1),
            new Token(TokenType.PLUS, '+', null, 1),
            new Token(TokenType.NUMBER, '5', 5, 1),
            new Token(TokenType.RIGHT_PAREN, ')', null, 1),
        ]);
    });
});