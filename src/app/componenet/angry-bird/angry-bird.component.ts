import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { fromEvent, debounceTime } from 'rxjs';

@Component({
  selector: 'app-angry-bird',
  templateUrl: './angry-bird.component.html',
  styleUrls: ['./angry-bird.component.css'],
})
export class AngryBirdComponent implements OnInit, AfterViewInit {
  @ViewChild('dot') dot: ElementRef;
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('down') down: ElementRef;
  isHovered: boolean;
  intervalId:any;
  // @HostListener('click', ['$event'])
  // onMouseEnter(event: any) {
  //   console.log(event);
  // }

  path: mikum[] = [];

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const nativeElement = this.dot.nativeElement;
    const nativeScreenElement = this.screen.nativeElement;

    let screenHeight = this.screen.nativeElement.clientHeight;
    let screenWidth = this.screen.nativeElement.offsetWidth;
    let leftDot = 0;
    nativeScreenElement.id = 'screen';

    nativeElement.style.top = screenHeight + 'px';
    console.log(this.down);

    nativeElement.style.top = nativeElement.style.clientHeight + '10px';
    // this.startMove(screenHeight,)
    // this.intervalId = setInterval(() => {
    //   leftDot++;
    //   nativeElement.style.left = leftDot + 'px';
    //   // nativeElement.style.top = screenHeight-- + 'px';
    //   let y = this.y(screenHeight, screenHeight -screenHeight+100, screenWidth, leftDot);
    //   nativeElement.style.top = y + 'px';
    //   if (y > screenHeight) {
    //     leftDot = 0;
    //   }
    // }, 1);

    // console.log(this.path);

    const mouseMove$=fromEvent<MouseEvent>(this.screen.nativeElement,'mousemove');
    mouseMove$.pipe(debounceTime(1)).subscribe((e:any)=>{
      // console.log(e.target.id);
      if(e.target.id!='screen')
        return;
      this.path=[];
      const lengthX=e.offsetX*2;
      const lengthY=screenHeight- e.offsetY;
      // console.log(` x:${e.offsetX} , y:${e.offsetY}`);
      // console.log(lengthY);
      const ballsPath=7;
      const space=(e.offsetX*9/10)/ballsPath;
      let x=space;;
      for (let i = 0; i<ballsPath; i++) {
        let y=this.y(screenHeight,lengthY,lengthX,x);
        this.path.push({ x: x, y: y });
        // console.log(x);
        x+=space;
        // console.log({ x: x, y: y });
      }
      // console.log('================');
    });

    this.screen.nativeElement.addEventListener('click',(e:any)=>{
      if(e.target.id!='screen' || e.offsetX<150)
        return;

      if(this.intervalId>0)
        this.stopMove();

        console.log(` x:${e.offsetX} , y:${e.offsetY}`);
      console.log(this.intervalId);
      this.startMove(screenHeight,screenWidth,screenHeight- e.offsetY,e.offsetX*2);


      // this.startMove()
    });
  }



  startMove(screenHeight:number,screenWidth:number,lengthY:number,lengthX:number) {
    const nativeElement = this.dot.nativeElement;
    const nativeElementDown = this.down.nativeElement;
    let leftDot=0;
    // lengthY=screenHeight- e.offsetY;

    this.intervalId = setInterval(() => {
      leftDot++;
      // if(lengthX>screenWidth || (lengthX<screenWidth && lengthY<screenHeight/2))
        leftDot++;
      nativeElement.style.left = leftDot + 'px';
      // nativeElement.style.top = screenHeight-- + 'px';
      let y = this.y(screenHeight, lengthY, lengthX, leftDot);
      nativeElement.style.top = y + 'px';

      // console.log(nativeElementDown)
      // console.log(nativeElement)
      if(nativeElementDown.offsetLeft-nativeElementDown.offsetWidth-1<nativeElement.offsetLeft){
        this.stopMove();
        console.log('pppp');
      }

      if (y > screenHeight) {
        leftDot = 0;
      }
    }, 1);
  }

  stopMove(){
    console.log('stopping');
    clearInterval(this.intervalId);
  }

  createElement(name: string, id: string, clas: string, fatherId: string) {
    // console.log(clas);
    let elemnt = document.createElement(name);
    elemnt.id = id;
    // elemnt.classList.add(clas);
    document.getElementById(fatherId).appendChild(elemnt);
    return elemnt;
  }

  y(screenY: number, h: number, screenX: number, x: number) {
    let a = (-4 * h * x * x) / (screenX * screenX);
    let b = (4 * h * x) / screenX;
    let y = screenY - (a + b);
    // console.log(screenX,h,x);
    // console.log(a,b);
    // console.log(y);
    return y;
  }
}

interface mikum {
  x: number;
  y: number;
}
