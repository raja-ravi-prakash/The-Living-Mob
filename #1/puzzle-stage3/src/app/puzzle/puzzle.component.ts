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
  ok = false;
  puzzle = false;
  userData;
  constructor(private route: Router, private firestore: AngularFirestore) {
    let user = sessionStorage.getItem('user');

    if (user == 'none') {
      this.route.navigate(['signin']);
    } else if (user == 'fraud') {
      window.open('google', '_self');
    } else {
      this.ok = true;
      this.userData = JSON.parse(user);
    }
  }

  closeHint() {
    let dialog: any = document.querySelector('.dialog-hint');
    dialog.hide();
  }

  puz() {
    this.ok = false;
    this.puzzle = true;

    let dialog: any = document.querySelector('.dialog-hint');
    dialog.show();

    this.firestore
      .collection('stage2')
      .doc(this.userData.id)
      .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
    this.firestore
      .collection('stage3')
      .doc(this.userData.id)
      .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
    this.firestore
      .collection('users')
      .doc(this.userData.id)
      .update({ stage2: true, stage3: true });
  }

  ngOnInit(): void {}
}
