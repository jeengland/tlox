import {Expr, Binary, Grouping, Literal, Unary} from './expr';

export class AstPrinter {
  public print(expr: Expr): string {
    return expr.accept(this);
  }

  public visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
  }

  public visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize('group', expr.expression);
  }

  public visitLiteralExpr(expr: Literal): string {
    if (expr.value === null) return 'nil';
    return expr.value.toString();
  }

  public visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right);
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    let str = `(${name}`;
    for (const expr of exprs) {
      str += ` ${expr.accept(this)}`;
    }
    str += ')';
    return str;
  }
}
