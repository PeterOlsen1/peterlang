import { Token, TokenType } from "../lexer/token";
import { ExpressionTree } from "../parser/expressionTree";

/**
 * Evaluate an expression tree.
 * 
 * Different from an AST, an expression tree
 * will just hold an expression, whereas an AST is meant
 * to represent the entire program.
 * 
 * For the purposes of comparison operators, we will
 * treat all nonzero numbers as true, and zero as false.
 */
export class ExpressionEvaluator {
    tree: ExpressionTree = new ExpressionTree(new Token(TokenType.SCOPE, "", null, 0));

    constructor() {}

    evaluate(tree: ExpressionTree) {
        this.tree = tree;
        return this.evaluateTree(this.tree);
    }

    evaluateTree(tree: ExpressionTree): number {
        if (tree.children.length === 0) {
            return this.evaluateToken(tree.token);
        }

        if (tree.children.length === 1) {
            return this.evaluateUnary(tree);
        }

        return this.evaluateBinary(tree);
    }

    evaluateToken(token: Token): number {
        if (token.type === "NUMBER") {
            return parseFloat(token.literal);
        }

        throw new Error("Invalid token");
    }

    evaluateUnary(tree: ExpressionTree): number {
        const child = tree.children[0];
        switch (tree.token.type) {
            case TokenType.MINUS:
                return -this.evaluateTree(child);
            case TokenType.PLUS:
                return this.evaluateTree(child);
            default:
                throw new Error("Invalid unary operator");
        }
    }

    evaluateBinary(tree: ExpressionTree): number {
        const left = this.evaluateTree(tree.children[0]);
        const right = this.evaluateTree(tree.children[1]);

        switch (tree.token.type) {
            case TokenType.PLUS:
                return left + right;
            case TokenType.MINUS:
                return left - right;
            case TokenType.STAR:
                return left * right;
            case TokenType.SLASH:
                return left / right;
            default:
                throw new Error("Invalid operator");
        }
    }
}