import { Dir, Metrics, Pos, Scenario } from './types';
import { MazeGenerator, DIRS } from './MazeGenerator';
import { BehaviorTracker } from './BehaviorTracker';

const SIZE = 15, CELL = 32;
const KEYMAP: Record<string, Dir> = {
  ArrowUp: 'U', w: 'U', ArrowDown: 'D', s: 'D', ArrowLeft: 'L', a: 'L', ArrowRight: 'R', d: 'R',
};
const key = (p: Pos) => `${p.x},${p.y}`;

export class MazeGame {
  private grid = MazeGenerator.generate(SIZE);
  private player: Pos = { x: 0, y: 0 };
  private exit: Pos = { x: SIZE - 1, y: SIZE - 1 };
  private goals: Pos[]; private bonusLeft: Set<string>; private bonus: Pos[];
  private doneGoals = new Set<number>();
  private tracker = new BehaviorTracker();
  private phase: 'preview' | 'playing' | 'done' = 'preview';
  private ctx: CanvasRenderingContext2D;
  private timer = 0;
  private optimal: number;
  private onKey = (e: KeyboardEvent) => this.handleKey(e);

  constructor(private canvas: HTMLCanvasElement, private sc: Scenario,
              private hud: HTMLElement, private onFinish: (m: Metrics) => void) {
    canvas.width = canvas.height = SIZE * CELL;
    this.ctx = canvas.getContext('2d')!;
    const cells = this.grid.flat()
      .filter(c => key(c) !== '0,0' && key(c) !== key(this.exit))
      .sort(() => Math.random() - 0.5)
      .map(c => ({ x: c.x, y: c.y }));
    this.goals = cells.slice(0, sc.goalCount);
    this.bonus = cells.slice(sc.goalCount, sc.goalCount + sc.bonusCount);
    this.bonusLeft = new Set(this.bonus.map(key));
    const route = [this.player, ...this.goals, this.exit];
    this.optimal = route.slice(1).reduce((s, p, i) => s + MazeGenerator.distance(this.grid, route[i], p), 0);
    this.tracker.startPlanning();
    this.draw(); this.updateHud();
  }

  /** Termina la fase de planificación (mapa visible) y empieza el juego. */
  beginPlay() {
    this.tracker.endPlanning();
    this.phase = 'playing';
    window.addEventListener('keydown', this.onKey);
    this.timer = window.setInterval(() => this.tick(), 250);
    this.updateHud();
  }

  move(d: Dir) { // público: sirve también para botones táctiles
    if (this.phase !== 'playing' || this.grid[this.player.y][this.player.x].walls[d]) return;
    this.player = { x: this.player.x + DIRS[d][0], y: this.player.y + DIRS[d][1] };
    this.tracker.recordMove(d, this.player.x, this.player.y);
    this.collect();
    this.draw(); this.updateHud();
    if (key(this.player) === key(this.exit) && this.doneGoals.size === this.goals.length) this.finish(true);
  }

  private collect() {
    if (this.bonusLeft.delete(key(this.player))) this.tracker.recordBonus();
    const i = this.goals.findIndex((g, n) => !this.doneGoals.has(n) && key(g) === key(this.player)
      && (!this.sc.ordered || n === this.doneGoals.size));
    if (i >= 0) this.doneGoals.add(i);
  }

  private handleKey(e: KeyboardEvent) {
    const d = KEYMAP[e.key];
    if (d) { e.preventDefault(); this.move(d); }
  }

  private tick() {
    this.updateHud();
    if (this.sc.timeLimit && this.tracker.elapsed() >= this.sc.timeLimit) this.finish(false);
  }

  private finish(completed: boolean) {
    clearInterval(this.timer);
    window.removeEventListener('keydown', this.onKey);
    this.phase = 'done';
    this.onFinish(this.tracker.snapshot(this.sc, this.optimal, completed));
  }

  private updateHud() {
    const t = this.phase === 'playing' ? Math.floor(this.tracker.elapsed()) : 0;
    const left = this.sc.timeLimit ? ` / ${this.sc.timeLimit}s` : '';
    this.hud.textContent = `⏱ ${t}s${left}   👣 ${this.tracker.steps}   ${this.sc.goalEmoji} ${this.doneGoals.size}/${this.goals.length}   ${this.sc.bonusEmoji} ${this.tracker.bonus}`;
  }

  private draw() {
    const c = this.ctx;
    c.fillStyle = this.sc.color; c.fillRect(0, 0, SIZE * CELL, SIZE * CELL);
    c.strokeStyle = '#2b2b3a'; c.lineWidth = 2; c.beginPath();
    for (const cell of this.grid.flat()) {
      const x = cell.x * CELL, y = cell.y * CELL;
      if (cell.walls.U) { c.moveTo(x, y); c.lineTo(x + CELL, y); }
      if (cell.walls.D) { c.moveTo(x, y + CELL); c.lineTo(x + CELL, y + CELL); }
      if (cell.walls.L) { c.moveTo(x, y); c.lineTo(x, y + CELL); }
      if (cell.walls.R) { c.moveTo(x + CELL, y); c.lineTo(x + CELL, y + CELL); }
    }
    c.stroke();
    c.font = '20px serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const at = (p: Pos, s: string) => c.fillText(s, p.x * CELL + CELL / 2, p.y * CELL + CELL / 2 + 1);
    at(this.exit, '🏁');
    this.bonus.filter(p => this.bonusLeft.has(key(p))).forEach(p => at(p, this.sc.bonusEmoji));
    this.goals.forEach((g, i) => { if (!this.doneGoals.has(i)) at(g, this.sc.ordered ? `${i + 1}` : this.sc.goalEmoji); });
    c.fillStyle = '#e63946'; c.beginPath();
    c.arc(this.player.x * CELL + CELL / 2, this.player.y * CELL + CELL / 2, CELL / 3, 0, Math.PI * 2); c.fill();
  }
}
