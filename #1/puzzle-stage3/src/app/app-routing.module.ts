import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PuzzleComponent } from './puzzle/puzzle.component';
import { SiginComponent } from './sigin/sigin.component';

const routes: Routes = [
  { path: 'puzzle', component: PuzzleComponent },
  { path: 'signin', component: SiginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
