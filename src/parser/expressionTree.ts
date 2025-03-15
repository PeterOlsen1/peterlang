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
    left: Node|ExpressionTree;
    right: Node|ExpressionTree;

    constructor(token: Token, left: Node|ExpressionTree, right: Node|ExpressionTree) {
        super(token);
        this.left = left;
        this.right = right;
    }
}

export class UnaryNode extends Node {
    child: Node|ExpressionTree;

    constructor(token: Token, child: Node|ExpressionTree) {
        super(token);
        this.child = child;
    }
}

export class MultiNode extends Node {
    children: Node|ExpressionTree[];

    constructor(token: Token, children: Node|ExpressionTree[]) {
        super(token);
        this.children = children;
    }
}

/**
 * Model expressions with a tree structure
 * 
 * This way, we can evaluate expressions recursively
 * and from the bottom up
 */
export class ExpressionTree {
    children: ExpressionTree[] = [];
    token: Token;

    constructor(token: Token, ...children: ExpressionTree[]) {
        this.token = token;
        if (children) {
            this.children = children;
        }
    }
}