import { Token } from "../lexer/token";
import { ExpressionTree } from "./expressionTree";

export class ASTNode {
    from: Token;

    constructor(from: Token) {
        this.from = from;
    }
}

export class FunctionNode extends ASTNode {
    name: string;
    children: ASTNode[];

    constructor(name: string, from: Token, children: ASTNode[]) {
        super(from);
        this.children = children;
        this.name = name;
    }
}

export class VariableNode extends ASTNode {
    name: string;
    value: Token;

    constructor(name: string, from: Token, value: Token) {
        super(from);
        this.name = name;
        this.value = value;
    }
}

export class ExpressionNode extends ASTNode {
    expressionTree: ExpressionTree;

    constructor(from: Token, exp: ExpressionTree) {
        super(from);
        this.expressionTree = exp;
    }
}