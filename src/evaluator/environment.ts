import { Token } from "../lexer/token";

/**
 * Use this for lookups within the evaluator
 */
export class Environment {
    env: any = {};

    constructor() {
        this.env = {};
    }

    get(name: string): Token {
        return this.env[name];
    }

    set(name: string, value: Token) {
        this.env[name] = value;
    }

    /**
     * In the case of an inner scope, duplicate the environment
     * so that changes within the block don't affect the
     * outer scope 
     */
    dup(): Environment {
        const newEnv = new Environment();
        newEnv.env = Object.assign({}, this.env);
        return newEnv;
    }
}