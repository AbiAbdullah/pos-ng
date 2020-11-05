export class Square {
  private color = 'red';
  private x = 10;
  private y = 0;
  private z = 30;

  constructor(private ctx: CanvasRenderingContext2D) { }

  move(square: Square) {
    this.ctx.clearRect(square.x - 3, square.y - 3, square.z + 5, square.z + 5);
    this.ctx.strokeText("test", this.x + 5, this.y + 15);
    this.ctx.strokeRect(this.x, this.y, this.z, this.z);
  }

  draw(left) {
    this.x = (left * this.x) + (this.z * left);
    // this.ctx.fillStyle = this.color;
    this.ctx.strokeRect(this.x, this.z * this.y, this.z, this.z);
    this.ctx.strokeText("test", this.x + 5, this.y + 15);

  }

}
