import { Token } from "../lexer/token";

export class ASTNode {
    from: Token;
    children: ASTNode[];

    constructor(from: Token, children: ASTNode[] = []) {
        this.from = from;
        this.children = children;
    }
}

export class FunctionNode extends ASTNode {
    name: string;

    constructor(name: string, from: Token, children: ASTNode[]) {
        super(from, children);
        this.name = name;
    }
}

export class VariableNode extends ASTNode {
    name: string;
    value: Token;

    constructor(name: string, from: Token, value: Token) {
        super(from, []);
        this.name = name;
        this.value = value;
    }
}