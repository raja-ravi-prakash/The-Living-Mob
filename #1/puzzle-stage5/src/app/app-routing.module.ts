import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MorseComponent } from './morse/morse.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: 'puzzle', component: MorseComponent },
  { path: 'signin', component: SigninComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
