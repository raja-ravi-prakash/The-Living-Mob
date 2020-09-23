import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss'],
})
export class PuzzleComponent implements OnInit {
  answer;
  given;
  userData;
  answerHint;

  dec2bin(dec) {
    return (dec >>> 0).toString(2);
  }

  reverse(str) {
    str = str.split('');
    str = str.reverse();
    str = str.join('');
    return str;
  }

  constructor(private route: Router, private firestore: AngularFirestore) {
    let user = sessionStorage.getItem('user');

    if (user == 'none') {
      this.route.navigate(['signin']);
    } else {
      this.userData = JSON.parse(user);
    }
    let number = parseInt((Math.random() * 1000).toString().split('.')[0]);
    this.answerHint = 'Find the answer for ' + number;
    this.given = number;
  }

  ngOnInit(): void {
    let inp: any = document.querySelector('.answer-given');

    inp.addEventListener('slInput', () => {
      this.answer = inp.value;
    });

    let dialog: any = document.querySelector('.dialog-no-overlay-dismiss');
    dialog.show();
  }

  go() {
    let temp = this.given;
    temp = this.dec2bin(temp);
    temp = this.reverse(temp);
    temp = parseInt(temp, 2).toString();

    if (temp == this.answer) {
      this.gothrough();
    } else {
      let dialog: any = document.querySelector('.dialog-wrong');
      dialog.show();
    }
  }

  async enteruser(id) {
    let doc = await this.firestore
      .collection('stage1')
      .doc(id)
      .get()
      .toPromise();

    if (!doc.exists) {
      this.firestore
        .collection('stage1')
        .doc(id)
        .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
    }
  }

  gothrough() {
    this.firestore.collection('users').doc(this.userData.id).update({
      stage1: true,
    });

    this.enteruser(this.userData.id);

    let dialog: any = document.querySelector('.dialog-win');
    dialog.show();
    dialog.addEventListener('slOverlayDismiss', event => event.preventDefault());
  }

  fly() {
    window.open('https://instagram.com/sudo.ronin', '_self');
  }
}
