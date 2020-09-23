import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
})
export class PuzzleComponent implements AfterViewInit {
  ipAddress;
  ok;
  answer;
  final;
  userData;

  constructor(
    private http: HttpClient,
    private route: Router,
    private firestore: AngularFirestore
  ) {
    let user = sessionStorage.getItem('user');

    if (user == 'none') {
      this.route.navigate(['signin']);
    } else if (user == 'fraud') {
      window.open('', '_self');
    } else {
      this.ok = true;
      this.userData = JSON.parse(user);
    }
  }

  async getIp() {
    let { ip }: any = await this.http.get('https://ipapi.co/json/').toPromise();

    ip = ip.split('.');
    this.ipAddress = ip;
  }

  k(a) {
    if (a > 255) return a % 255;
    return a;
  }

  rgbToHex(r, g, b) {
    r = this.k(r);
    g = this.k(g);
    b = this.k(b);
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
  }

  setAnswer() {
    let r = parseInt((Math.random() * 1000).toString());
    let g = parseInt((Math.random() * 1000).toString());
    let b = parseInt((Math.random() * 1000).toString());

    document.getElementById('oneq').style.backgroundColor = this.rgbToHex(
      r,
      g,
      b
    );
    this.final = this.rgbToHex(b, g, r);
  }

  go() {
    console.log(this.answer + ' ' + this.final);
    if (this.answer.toLowerCase() == this.final.toLowerCase()) {
      this.firestore
        .collection('users')
        .doc(this.userData.id)
        .update({ stage4: true });

      this.firestore
        .collection('stage4')
        .doc(this.userData.id)
        .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
      let dialog: any = document.querySelector('.dialog-win');
      dialog.show();
    } else {
      let dialog: any = document.querySelector('.dialog-wrong');
      dialog.show();
      this.answer = '';
    }
  }

  fly() {
    window.open('https://thefinalstage5.herokuapp.com', '_self');
  }

  setColors() {
    let r = parseInt((Math.random() * 1000).toString());
    let g = parseInt((Math.random() * 1000).toString());
    let b = parseInt((Math.random() * 1000).toString());

    document.getElementById('one').style.backgroundColor = this.rgbToHex(
      r,
      g,
      b
    );
    document.getElementById('two').style.backgroundColor = this.rgbToHex(
      b,
      g,
      r
    );

    this.setAnswer();
  }

  ngAfterViewInit(): void {
    let dialog: any = document.querySelector('.dialog-hint');

    let inputthing: any = document.querySelector('.hexcode-input');

    inputthing.addEventListener('slInput', () => {
      this.answer = inputthing.value;
    });

    dialog.show();
    this.getIp();
    this.setColors();
  }
}
