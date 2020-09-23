import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private auth: AngularFireAuth,
    private route: Router,
    private firestore: AngularFirestore
  ) {
    this.auth.authState.subscribe((user) => {
      this.setUser(user);
    });
  }

  setUser(user: firebase.User) {
    if (user != null) {
      let data: any = {
        id: user.uid,
        email: user.email,
        name: user.displayName,
      };
      this.setStages(user.uid);
      data = JSON.stringify(data);
      sessionStorage.setItem('user', data);
      this.route.navigate(['puzzle']);
    } else {
      sessionStorage.setItem('user', 'none');
      this.route.navigate(['signin']);
    }
  }

  async setStages(uid) {
    let doc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();
    if (!doc.exists) {
      this.firestore.collection('users').doc(uid).set({
        stage1: false,
        stage2: false,
        stage3: false,
        stage4: false,
        stage5: false,
      });
    }
  }
}
