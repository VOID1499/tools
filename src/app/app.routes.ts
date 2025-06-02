import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GimnasioComponent } from './dashboard/gimnasio/gimnasio.component';
import { LavanderiaComponent } from './dashboard/lavanderia/lavanderia.component';
import { CalendarComponent } from './shared/calendar/calendar.component';
import { ReservasComponent } from './shared/reservas/reservas.component';

export const routes: Routes = [

    {
        path:"dashboard",
        component:DashboardComponent,
        children:[
            {
                path:"gimnasio",
                component:GimnasioComponent,
                children:[
                     {
                        path: "",
                        redirectTo: "reservas",
                        pathMatch: "full"
                    },
                    {
                        path:"calendario",
                        component:CalendarComponent,
                        pathMatch:"full"
                    },
                     {
                        path:"reservas",
                        component:ReservasComponent,
                        pathMatch:"full"
                    },
                    {
                        path:"reservas/:fecha",
                        component:ReservasComponent,
                        pathMatch:"full"
                    }
                ]
            },
            {
                path:"lavanderia",
                component:LavanderiaComponent
            }
        ]
    },

    {
        path:"",
        redirectTo:"dashboard",
        pathMatch:"full"
    }
    
];
