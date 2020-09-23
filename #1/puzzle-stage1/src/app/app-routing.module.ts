import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { SigninComponent } from './signin/signin.component';

const routes: Routes = [
  { path: 'puzzle', component: PuzzleComponent },
  { path: 'signin', component: SigninComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
