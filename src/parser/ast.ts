import { Token } from "../lexer/token";
import { ExpressionTree } from "./expressionTree";

export class ASTNode {
    from: Token;

    constructor(from: Token) {
        this.from = from;
    }
}

/**
 * A special type of AST node that denotes a scope.
 * 
 * It contains a list of children that are within said scope and it
 * should contain the same environment as the parent scope.
 * (worry about this in evaluator)
 */
export class ScopeNode extends ASTNode {
    children: ASTNode[];

    constructor(from: Token, children: ASTNode[]) {
        super(from);
        this.children = children;
    }

    add(node: ASTNode) {
        this.children.push(node);
    }
}

export class FunctionNode extends ASTNode {
    name: string;
    body: ScopeNode;

    constructor(name: string, from: Token, body: ScopeNode) {
        super(from);
        this.body = body;
        this.name = name;
    }
}

export class VariableNode extends ASTNode {
    name: string;
    value: ASTNode | null;
    constant: boolean;

    constructor(name: string, from: Token, value: ASTNode | null, constant: boolean = false) {
        super(from);
        this.name = name;
        this.value = value;
        this.constant = constant;
    }
}

export class ExpressionNode extends ASTNode {
    expressionTree: ExpressionTree;

    constructor(from: Token, exp: ExpressionTree) {
        super(from);
        this.expressionTree = exp;
    }
}

export class WhileNode extends ASTNode {
    condition: ExpressionNode;
    body: ScopeNode;

    constructor(from: Token, condition: ExpressionNode, body: ScopeNode) {
        super(from);
        this.condition = condition;
        this.body = body;
    }
}

export class IfNode extends ASTNode {
    condition: ExpressionNode;
    body: ScopeNode;
    elseBody: ScopeNode | null;

    constructor(from: Token, condition: ExpressionNode, body: ScopeNode, elseBody: ScopeNode | null) {
        super(from);
        this.condition = condition;
        this.body = body;
        this.elseBody = elseBody;
    }
}