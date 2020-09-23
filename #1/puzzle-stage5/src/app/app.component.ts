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
      this.setStages(user.uid, data);
    } else {
      sessionStorage.setItem('user', 'none');
      this.route.navigate(['signin']);
    }
  }

  async setStages(uid, data) {
    let doc = await this.firestore
      .collection('users')
      .doc(uid)
      .get()
      .toPromise();
    if (!doc.exists) {
      alert(
        'You are not supposed to be here, complete previous stage  first!!'
      );
      sessionStorage.setItem('user', 'fraud');
      this.auth.signOut();
      window.open('google.com', '_self');
    } else {
      if (doc.data().stage4 != true) {
        alert(
          'You are not supposed to be here, complete previous stage first!!'
        );
        sessionStorage.setItem('user', 'fraud');
        this.auth.signOut();
        window.open('google.com', '_self');
      }
    }
    this.route.navigate(['puzzle']);
    data = JSON.stringify(data);
    sessionStorage.setItem('user', data);
  }
}
