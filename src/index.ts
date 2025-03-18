import { ExpressionEvaluator } from "./evaluator/expressionEvaluator";
import Lexer from "./lexer/lexer";
import Parser from "./parser/parser";
import Evaluator from "./evaluator/evaluator";

const args = process.argv.slice(2);

// if (args.length == 0) {
//     console.error("Please provide a file path");
//     console.log("Intended usage: node src/index.ts <file-path>");
// }

// const fname = args[2];
const fname = '../target.pt';

function interpret(fname: string) {
    let lexer = new Lexer(fname);
    let tokens = lexer.lex();
    console.log(tokens);

    let parser = new Parser(tokens);
    let res = parser.parse();
    console.log(res);
    
    let evaluator = new Evaluator(res);
    evaluator.evaluate();
}

interpret(fname);