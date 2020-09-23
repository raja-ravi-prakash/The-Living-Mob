import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  constructor(private authFire: AngularFireAuth, private route: Router) {
    let user = sessionStorage.getItem('user');

    if (user != 'none') {
      this.route.navigate(['puzzle']);
    }
  }

  ngOnInit(): void {}

  async signIn() {
    let credential = await this.authFire.signInWithPopup(
      new auth.GoogleAuthProvider()
    );

    let user = credential.user;
  }
}
