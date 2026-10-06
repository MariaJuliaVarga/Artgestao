import { Routes } from '@angular/router';

import { Temas } from './pages/temas/temas';

export const routes: Routes = [

{
path: '',
redirectTo: 'temas',
pathMatch: 'full'
},

{
path: 'temas',
component: Temas
}

];
