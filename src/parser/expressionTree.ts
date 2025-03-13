import { Token } from "../lexer/token";

/*
* Define base class Node to represent an ExpressionTree node
* Can either be a BinaryNode, UnaryNode, or MultiNode
* BinaryNode: Represents a binary operation, e.g. 1 + 2
* UnaryNode: Represents a unary operation, e.g. -1
* MultiNode: Represents a multi-node operation, e.g. a function call
*/
export class Node {
    token: Token;

    constructor(token: Token) {
        this.token = token;
    }
}

export class BinaryNode extends Node {
    left: Node;
    right: Node;

    constructor(token: Token, left: Node, right: Node) {
        super(token);
        this.left = left;
        this.right = right;
    }
}

export class UnaryNode extends Node {
    child: Node;

    constructor(token: Token, child: Node) {
        super(token);
        this.child = child;
    }
}

export class MultiNode extends Node {
    children: Node[];

    constructor(token: Token, children: Node[]) {
        super(token);
        this.children = children;
    }
}

export class ExpressionTree {
    root: Node;

    constructor(node: Node) {
        this.root = node;
    }
}