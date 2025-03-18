import { Token, TokenType } from "../lexer/token";
import { ScopeNode, ASTNode, IfNode, WhileNode, ExpressionNode, VariableNode } from "../parser/ast";
import { ExpressionTree } from "../parser/expressionTree";
import { Environment } from "./environment";
import { ExpressionEvaluator } from "./expressionEvaluator";

class Evaluator {
    scope: ScopeNode;
    current: number = 0;
    expressionEvaluator: ExpressionEvaluator = new ExpressionEvaluator();
    environment: Environment = new Environment();

    constructor(scope: ScopeNode) {
        this.scope = scope;
    }

    evaluate() {
        this.evaluateScope(this.scope);
    }

    evaluateScope(scope: ScopeNode) {
        while (!this.end()) {
            this.evaluateNode();
        }
    }

    // put the main logic for evaluation in here
    evaluateNode() {
        const n = this.advance();
        console.log(n);
    }

    advance() {
        return this.scope.children[this.current++];
    }

    end() {
        return this.current >= this.scope.children.length;
    }
}

export default Evaluator;