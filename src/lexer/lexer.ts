import { TokenType, Token, keywords } from "./token";
import fs from 'fs';

function isNumber(c: string): boolean {
    return c >= '0' && c <= '9';
}

function isAlphaNumeric(c: string): boolean {
    const isString = !!c.match(/[a-zA-Z_]/);
    return isString || isNumber(c);
}

// credit to https://craftinginterpreters.com/scanning.html for the tutorial
class Lexer {
    private filename: string;
    private contents: string = "";
    private tokens: Token[];
    private start: number = 0;
    private current: number = 0;
    private line: number = 1;

    /**
     * Initialize a lexer with the file to examine
     */
    constructor(filename: string) {
        this.filename = filename;
        this.tokens = [];
        if (filename) {
            this.readFile();
        }
    }

    /**
     * read the contents of the given filename and assign them to contents
     */
    readFile(): void {
        const data = fs.readFileSync(this.filename, 'utf-8');
        this.contents = data;
    }

    lex(): Token[] {
        if (!this.contents) {
            this.readFile();
        }

        while (!this.end()) {
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens;
    }

    lexString(input: string): Token[] {
        this.contents = input;
        while (!this.end()) {
            this.start = this.current;
            this.scanToken();
        }
        return this.tokens;
    }

    scanToken() {
        const c = this.advance();
        switch (c) {
            //single character tokens
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case '/': this.addToken(TokenType.SLASH); break;
            case '*': this.addToken(TokenType.STAR); break;

            //possible multi-character tokens
            case '=': 
                this.addToken(this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); 
                break;
            case '!': 
                this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '>': 
                this.addToken(this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '<': 
                this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '&':
                this.addToken(this.match('&') ? TokenType.AND : TokenType.ERROR);
                break;
            case '|':
                this.addToken(this.match('|') ? TokenType.OR : TokenType.ERROR);
                break;
            case '/':
                if (this.match('/')) { //comment
                    while (this.peek() != '\n' && !this.end()) this.advance();
                } else {
                    this.addToken(TokenType.SLASH);
                }
                break;

            //ignore whitespace
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            default:
                if (isNumber(c)) {
                    this.handleNumber();
                    break;
                }
                else if (isAlphaNumeric(c)) {
                    this.handleIdentifier();
                    break;
                }
                this.debug();
                console.error("Unexpected token!!!");
                break;
        }
    }

    /**
     * Add a token to token list
     */
    addToken(type: TokenType, literal: any = null) {
        const text = this.contents.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }

    handleNumber() {
        //advance to the end of the number (or decimal point)
        while (isNumber(this.peek())) this.advance();

        //look for a decimal
        if (this.peek() == '.' && isNumber(this.peekNext())) {
            // Consume the "."
            this.advance();
      
            while (isNumber(this.peek())) this.advance();
        }

        this.addToken(TokenType.NUMBER, parseFloat(this.contents.substring(this.start, this.current)));
    }

    /**
     * First character was a ", go until we find the end or it is not closed
     */
    handleString() {
        while (this.peek() !=  '"' && !this.end()) {
            if (this.peek() == '\n') this.line++;
            this.advance();
        }

        if (this.end()) {
            console.error("Unterminated string!!!");
        }

        this.advance();

        const value = this.contents.slice(this.start + 1, this.current - 1);
        this.addToken(TokenType.STRING, value);
    }

    /**
     * We found an identifier, check it out and see if it's a keyword
     * or an identifier
     */
    handleIdentifier() {
        while (isAlphaNumeric(this.peek()) && !this.end()) this.advance();
        
        const substring = this.contents.slice(this.start, this.current);

        if (keywords[substring]) {
            this.addToken(keywords[substring], substring);
            return;
        }
        //warn the user if they use a reserve keyword, but caps is different
        else if (keywords[substring.toLowerCase()]) {
            console.error("Variable uses substring names");
        }

        this.addToken(TokenType.IDENTIFIER, substring);
    }

    //=========================================================================
    // Helper Functions
    
    debug() {
        console.log("Lexer debug:");
        console.log(`Current: ${this.peek()} (${this.current})`);
    }

    /**
     * Return contents at current index and advance it once
     */
    advance(): string {
        return this.contents[this.current++];
    }

    /**
     * determine if we are at end of file
     */
    end(): boolean {
        return this.current >= this.contents.length;
    }

    /**
     * Like a conditional advance that only moves forward if we find what we are looking for
     */
    match(c: string): boolean {
        if (this.end()) return false;
        if (this.contents[this.current] != c) return false;
        this.current++;
        return true;
    }

    /**
     * Check out the character but DONT CONSUME IT
     */
    peek(): string {
        if (this.end()) return '\0';
        return this.contents[this.current];
    }

    peekNext(): string {
        if (this.current + 1 >= this.contents.length) return '\0';
        return this.contents[this.current + 1];
    }
}

export default Lexer;