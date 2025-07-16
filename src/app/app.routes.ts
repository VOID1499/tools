import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GimnasioComponent } from './dashboard/gimnasio/gimnasio.component';
import { LavanderiaComponent } from './dashboard/lavanderia/lavanderia.component';
import { CalendarComponent } from './shared/calendar/calendar.component';
import { ReservasComponent } from './shared/reservas/reservas.component';
import { ConfigComponent } from './dashboard/config/config.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { CallbackComponent } from './auth/callback/callback.component';
import { PerfilComponent } from './dashboard/perfil/perfil.component';

export const routes: Routes = [

    {

        path:"dashboard",
        component:DashboardComponent,
        children:[
            {
                path:"",
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
            },
            {
                path:"perfil",
                component:PerfilComponent
            },
            {
                path:"configuracion",
                component:ConfigComponent
            }
        ]
    },
    {
        path:"auth",
        component:AuthComponent,
        children:[
            {
                path:"login",
                component:LoginComponent
            },
             {
                path:"singup",
                component:LoginComponent
            },
             {
                path:"callback",
                component:CallbackComponent
            }
        ],
     
    },

       {
            path:"",
            redirectTo:"dashboard",
            pathMatch:"full"
        }
];
