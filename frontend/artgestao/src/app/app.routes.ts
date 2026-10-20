import { Routes } from '@angular/router';

import { Temas } from './pages/temas/temas';
import { Produtos } from './pages/produtos/produtos';
import { Agenda } from './pages/agenda/agenda';

export const routes: Routes = [

{
path: '',
redirectTo: 'temas',
pathMatch: 'full'
},

{
path: 'temas',
component: Temas
},

{
path: 'produtos',
component: Produtos
},

{
path: 'agenda',
component: Agenda
}

];
