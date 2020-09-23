import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-morse',
  templateUrl: './morse.component.html',
  styleUrls: ['./morse.component.scss'],
})
export class MorseComponent implements AfterViewInit {
  ipaddress: string;
  audio;
  answer: string;
  userData;
  isplaying = false;

  constructor(
    private http: HttpClient,
    private route: Router,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    let user = sessionStorage.getItem('user');

    if (user == 'none') {
      this.route.navigate(['signin']);
    } else if (user == 'fraud') {
      this.auth.signOut();
      window.open('google.com', '_self');
    } else {
      this.userData = JSON.parse(user);
    }
    this.startTheMusic();
  }

  async startTheMusic() {
    let { ip }: any = await this.http
      .get('https://api.ipify.org?format=json')
      .toPromise();

    ip = ip.split('.').join('').split('');

    for (let i = 0; i < ip.length; i++) {
      for (let j = 0; j < ip.length - 1; j++) {
        if (ip[j] < ip[j + 1]) {
          let temp = ip[j];
          ip[j] = ip[j + 1];
          ip[j + 1] = temp;
        }
      }
    }

    this.ipaddress = ip.join('');

    let data: any = await this.http
      .get(
        '//api.funtranslations.com/translate/morse/audio.json?text=' +
          this.ipaddress
      )
      .toPromise();
    this.audio = data.contents.translated.audio;
  }

  play() {
    if (!this.isplaying) {
      let audioBuffer = new Audio(this.audio);
      let temp = audioBuffer.play();
      this.isplaying = true;

      audioBuffer.addEventListener('ended', () => {
        this.isplaying = false;
      });

      if (temp !== undefined) {
        temp
          .then(function () {})
          .catch(function (error) {
            console.log(error);
            this.isplaying = false;
          });
      }
      let dialog: any = document.querySelector('.dialog-trap');

      dialog.show();
    }
  }

  go() {
    if (this.answer == this.ipaddress) {
      new Audio('assets/ed.mp3').play();
      this.firestore
        .collection('stage5')
        .doc(this.userData.id)
        .set({ time: firebase.firestore.FieldValue.serverTimestamp() });
      this.firestore
        .collection('users')
        .doc(this.userData.id)
        .update({ stage5: true });

      let dialog: any = document.querySelector('.dialog-winner');
      dialog.addEventListener('slOverlayDismiss', (event) =>
        event.preventDefault()
      );
      dialog.show();
    } else {
      let dialog: any = document.querySelector('.dialog-wrong');
      dialog.show();
    }
  }

  ngAfterViewInit(): void {
    let dialog: any = document.querySelector('.dialog-hint');
    dialog.show();

    let inp: any = document.querySelector('.answer-in');

    inp.addEventListener('slInput', () => {
      this.answer = inp.value;
    });
  }
}
