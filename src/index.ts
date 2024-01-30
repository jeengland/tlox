const fs = require('fs');
const readline = require('readline');

interface Lox {
  main(args: string[]): void;
  runFile(path: string): void;
  runPrompt(): void;
  run(source: string): void;
}

class Lox {
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
        } catch (e) {
          console.error(e);
        }
      }

      rl.prompt();
    });
  }

  private static run(source: string) {
    console.log(source);
  }
}

Lox.main(process.argv.slice(2));
