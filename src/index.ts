const fs = require('fs');
const readline = require('readline');

class Lox {
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
    console.log(source);
  }

  static error(line: number, message: string) {
    this.report(line, '', message);
  }

  private static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }
}

Lox.main(process.argv.slice(2));
