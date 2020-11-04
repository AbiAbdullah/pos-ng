import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Square } from './model/square';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'pos-floor-plan';
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  requestId;
  interval;
  squares: Square[] = [];
  squareLeft = 0;
  api_key = "c647d43d-375a-4b5b-a602-2ef0a0507a6b";
  gpBaseUrl = "https://passwordless.gazepass.com";
  constructor(private ngZone: NgZone) { }

  ngOnInit() {
    const elem = document.getElementById('myCanvas');
    const elemLeft = elem.offsetLeft + elem.clientLeft;
    const elemTop = elem.offsetTop + elem.clientTop;
    this.ctx = this.canvas.nativeElement.getContext('2d');
    // this.ngZone.runOutsideAngular(() => this.tick());
    // setInterval(() => {
    //   this.tick();
    // }, 200);
    // Add event listener for `click` events.
    let isDrag = false;
    let offset = { x: 0, y: 0, x0: 0, y0: 0 };
    let dragNode = null;
    let dragNodeId = null;
    // this.handleMouseDrag(elem, this.squares);
    elem.addEventListener(
      'mousedown',
      event => {
        const x = event.pageX - elemLeft;
        const y = event.pageY - elemTop;
        this.squares.some((element: any, index) => {
          if (
            y > element.y && y < element.y + element.z &&
            x > element.x &&
            x < element.x + element.z
          ) {
            console.log('clicked an element' + JSON.stringify(element));
            isDrag = true;
            dragNode = element;
            dragNodeId = index;
            offset = { x: dragNode.x, y: dragNode.y, x0: x, y0: y };

            return true;
          }
        });
      },
      false
    );
    elem.addEventListener("mousemove", (e) => {
      if (isDrag) {
        const square = { ...dragNode };
        dragNode.x = e.offsetX - offset.x0 + offset.x;
        dragNode.y = e.offsetY - offset.y0 + offset.y;
        // this.ctx.fillStyle = 'red';
        // this.ctx.fillRect(dragNode.x, dragNode.y, dragNode.z, dragNode.z);
        // if (dragNode.x >= -1 && dragNode.y >= -1 &&
        //   dragNode.x + dragNode.z < this.ctx.canvas.width
        //   && dragNode.y + dragNode.z < this.ctx.canvas.height) {
        this.ngZone.runOutsideAngular(() => {
          this.squares[dragNodeId].move(square);
          this.squares[dragNodeId] = dragNode;
        }
        );
      }
    });
    elem.addEventListener("mouseup", function (e) {
      isDrag = false;
    });
    elem.addEventListener("mouseleave", function (e) {
      isDrag = false;
    });

  }

  tick() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.squares.forEach((square: Square, index) => {
      // square.moveRight();
    });
    this.requestId = requestAnimationFrame(() => this.tick);
  }

  play() {
    const square = new Square(this.ctx);
    square.draw(this.squareLeft);
    this.squareLeft++;
    this.squares = this.squares.concat(square);

  }

  ngOnDestroy() {
    clearInterval(this.interval);
    cancelAnimationFrame(this.requestId);
  }
  handleMouseDrag(canvas, nodes) {
    var isDrag = false;
    var offset = { x: 0, y: 0, x0: 0, y0: 0 };
    var dragNode = undefined;
    canvas.addEventListener("mousedown", function (e) {
      var x = e.offsetLeft, y = e.offsetTop;
      for (var i in nodes) {
        if (Math.pow(x - nodes[i].x, 2) + Math.pow(y - nodes[i].y, 2) < Math.pow(nodes[i].r, 2)) {
          isDrag = true;
          dragNode = nodes[i];
          offset = { x: dragNode.x, y: dragNode.y, x0: x, y0: y };
          return;
        }
      }
    });
    canvas.addEventListener("mousemove", function (e) {
      if (isDrag) {
        dragNode.x = e.offsetLeft - offset.x0 + offset.x;
        dragNode.y = e.offsetTop - offset.y0 + offset.y;
      }
    });
    canvas.addEventListener("mouseup", function (e) {
      isDrag = false;
    });
    canvas.addEventListener("mouseleave", function (e) {
      isDrag = false;
    });
  }

  login() {
    this.getAccessToken().then(val => {
      console.log('====================================');
      console.log(val);
      console.log('====================================');
    }).catch(err => {
      console.log(err);

    })
  }
  getAccessToken() {
    return new Promise((resolve, reject) => {
      let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,status=no,resizable=no,
              width=1080,height=720`;
      var popupUrl = this.gpBaseUrl + "/?api_key=" + encodeURIComponent(this.api_key);
      var openedWindow = window.open(popupUrl, "Passwordless Sign In", params);
      var closed = false;

      if (openedWindow) {
        openedWindow.onbeforeunload = () => {
          if (!closed) {
            console.log("Useererr");

            reject("USER_CANCELLED");
          }
        }
      }

      var cb = async (event) => {
        try {
          var data = JSON.parse(event.data);
          console.log(data);
        } catch (e) {
          return;
        }

        if (!("gazePassAccessId" in data)) {
          return;
        }

        resolve(data["gazePassAccessId"]);

        closed = true;
        openedWindow.close();
        try {
          window.removeEventListener("message", cb);
        } catch (e) { }
      };

      window.addEventListener(
        "message",
        cb
      );
    });
  }

}
