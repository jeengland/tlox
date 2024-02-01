import * as fs from 'fs';
import * as readline from 'readline';
import {Scanner} from './scanner';
import {Token, TokenType} from './token';
import {AstPrinter} from './astPrinter';
import {Parser} from './parser';

export class Lox {
  static hadError = false;

  static main(args: string[]) {
    if (args.length > 1) {
      console.error('Usage: lox [script]');
      // exit codes from https://man.freebsd.org/cgi/man.cgi?query=sysexits&apropos=0&sektion=0&manpath=FreeBSD+4.3-RELEASE&format=html
      process.exitCode = 64;
    } else if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  // File runner
  private static runFile(path: string) {
    const bytes = fs.readFileSync(path, {
      encoding: 'utf8',
    });

    this.run(bytes);
    if (this.hadError) {
      process.exitCode = 65;
    }
  }

  // REPL runner
  private static runPrompt() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '[tlox] > ',
    });

    // Need to call prompt or REPL will start with a blank line
    rl.prompt();
    rl.on('line', (rawLine: string) => {
      const line = rawLine.trim();

      if (line === 'exit' || line === 'quit') {
        rl.close();
        return;
      }

      if (line) {
        try {
          this.run(line);
          this.hadError = false;
        } catch (e) {
          console.error(e);
        }
      }

      rl.prompt();
    });
  }

  private static run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens);
    const expression = parser.parse();

    if (this.hadError) {
      return;
    }

    if (expression === null) {
      this.error(0, 'Failed to parse expression');
      return;
    }

    console.log(new AstPrinter().print(expression));
  }

  static error(line: number, message: string) {
    this.report(line, '', message);
  }

  static tokenError(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.report(token.line, ' at end', message);
    } else {
      this.report(token.line, ` at '${token.lexeme}'`, message);
    }
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
}

Lox.main(process.argv.slice(2));
