import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-targil',
  templateUrl: './targil.component.html',
  styleUrls: ['./targil.component.css'],
})
export class TargilComponent implements OnInit {
  combinationArr: string[] = [];
  form: FormGroup;

  ngOnInit(): void {
    const inputArray = [2, 4, 6, 3, 7, 5, 2, 9];
    const targetNumber = 10;
    // const result = this.AllCombinationOfNumber(inputArray, -10);
    // this.findAllCombinationLength(inputArray, 5);
    // console.log(result);
    this.form = new FormGroup({
      arrayNum: new FormControl('1 2 3 4 5', [Validators.required]),
      sum: new FormControl(''),
      combination: new FormControl(''),
    });
  }

  submit() {
    let arr: string, sum, combination;
    arr = this.form.controls['arrayNum'].value;
    sum = this.form.controls['sum'].value;
    combination = this.form.controls['combination'].value;

    let newArr: any = arr.split(' ');
    for (let i = 0; i < newArr.length; i++) {
      newArr[i] = Number(newArr[i]);
    }

    console.log(newArr);

    this.combinationArr = [];
    console.log(sum);
    if (!sum) {
      for (let i = 2; i <= newArr.length; i++) {
        this.findAllCombinationLength(newArr, i);
      }
    }
    if (sum) {
      this.AllCombinationOfNumber(newArr, sum);
    }
  }

  AllCombinationOfNumber(r: number[], number?: number) {
    let array = r;
    for (let i = 0; i < r.length; i++) {
      this.findAllCombinationLength(array, i + 2, number);
    }
  }
  // log all the sums of 5
  findAllCombinationLength(
    r: number[],
    sumNumberLength: number,
    shum?: number
  ) {
    let array = r;

    if (sumNumberLength > r.length || sumNumberLength <= 1) {
      console.log('dosnt have');
      return;
    }
    if (sumNumberLength == 2) {
      this.f(array, 0, shum);
      return;
    }
    for (let i = 0; i <= r.length; i++) {
      this.f(array, sumNumberLength - 2, shum);
      // console.log(array)
      //array = array.slice(1);
      array.splice(0, 1);
    }
  }

  f(r: number[], start: number, shum?: number) {
    // start=2;
    let next = start;
    for (let i = 0; i < r.length - start - 1; i++) {
      // str+=r[i]+' ';
      this.f2(r, start, next, shum);
      console.log('------------');
      next++;
    }
  }
  f2(r: number[], sum: number, next: number, chekShum?: number) {
    let add = next + 1;
    while (true) {
      let str = '';
      let shum = 0;
      if (add >= r.length) break;

      for (let i = 0; i < sum; i++) {
        str += r[i] + '+';
        shum += r[i];
      }

      str += r[next] + '+';
      shum += r[next];

      str += r[add];
      shum += r[add];

      add++;

      if (chekShum) {
        if (chekShum === shum) {
          console.log(str + ' = ' + shum);
          this.combinationArr.push(str + ' = ' + shum);
          // console.log(str);
        }
      } else {
        console.log(str + '= ' + shum);
        this.combinationArr.push(str + ' = ' + shum);
      }
    }
  }
}
