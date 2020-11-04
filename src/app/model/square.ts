export class Square {
  private color = 'red';
  private x = 10;
  private y = 0;
  private z = 30;

  constructor(private ctx: CanvasRenderingContext2D) { }

  move(square: Square) {

    this.ctx.clearRect(square.x, square.y, square.z, square.z);
    this.ctx.fillStyle = this.color;
    // this.ctx.fillRect(this.x, this.y, this.z, this.z);
    //  this.ctx.setTransform(1, 0, 0, 1, this.x, this.z * this.y);
    // this.ctx.strokeText("test", this.x + 5, this.z * this.y + 15);
    // this.ctx.translate(square.x, this.y);
    this.ctx.fillRect(this.x, this.y, this.z, this.z);
  }

  draw(left) {
    this.x = (left * this.x) + (this.z * left);
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x, this.z * this.y, this.z, this.z);
    // this.ctx.strokeText("test", this.x + 5, this.y + 15);

  }

}
