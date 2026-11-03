import { Cell, Dir, Pos } from './types';

export const DIRS: Record<Dir, [number, number]> = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
const OPP: Record<Dir, Dir> = { U: 'D', D: 'U', L: 'R', R: 'L' };
const KEYS = Object.keys(DIRS) as Dir[];

export class MazeGenerator {
  /** Laberinto perfecto (DFS con backtracking): siempre hay un único camino entre dos celdas. */
  static generate(n: number): Cell[][] {
    const g: Cell[][] = Array.from({ length: n }, (_, y) =>
      Array.from({ length: n }, (_, x) => ({ x, y, walls: { U: true, D: true, L: true, R: true } })));
    const seen = new Set(['0,0']);
    const stack = [g[0][0]];
    while (stack.length) {
      const c = stack[stack.length - 1];
      const opts = KEYS.filter(d => {
        const nx = c.x + DIRS[d][0], ny = c.y + DIRS[d][1];
        return g[ny]?.[nx] && !seen.has(`${nx},${ny}`);
      });
      if (!opts.length) { stack.pop(); continue; }
      const d = opts[Math.floor(Math.random() * opts.length)];
      const nb = g[c.y + DIRS[d][1]][c.x + DIRS[d][0]];
      c.walls[d] = false; nb.walls[OPP[d]] = false;
      seen.add(`${nb.x},${nb.y}`); stack.push(nb);
    }
    return g;
  }

  /** Pasos mínimos entre dos celdas (BFS). */
  static distance(g: Cell[][], a: Pos, b: Pos): number {
    const q: [Pos, number][] = [[a, 0]];
    const seen = new Set([`${a.x},${a.y}`]);
    while (q.length) {
      const [p, d] = q.shift()!;
      if (p.x === b.x && p.y === b.y) return d;
      for (const k of KEYS) {
        if (g[p.y][p.x].walls[k]) continue;
        const n = { x: p.x + DIRS[k][0], y: p.y + DIRS[k][1] };
        const key = `${n.x},${n.y}`;
        if (!seen.has(key)) { seen.add(key); q.push([n, d + 1]); }
      }
    }
    return 0;
  }
}
