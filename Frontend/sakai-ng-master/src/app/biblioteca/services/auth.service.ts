import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Authentication, LoginRequest, LoginResponse } from '../interfaces/Authentication';
import { Usuario } from '../interfaces/usuario';

import { catchError } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';




const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private TOKEN_NAME:string = 'upsjb_reserva';
  private helper:JwtHelperService;/*
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;*/
  private currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;
  public currentUsuario: Usuario | undefined;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private msalService: MsalService) {

    this.helper = new JwtHelperService();
    this.currentUserSubject = new BehaviorSubject<Usuario>(
        JSON.parse(localStorage.getItem('currentUser') || '{}')
      );

    this.currentUser = this.currentUserSubject.asObservable();


  }
  public get currentUserValue(): Usuario {
      return this.currentUserSubject.value;
    }

  pruebaConexionBackend() {
    return this.http.get<any[]>(`${environment.apiUrl}/prueba`
    );
  }
  loginServer(authentication:Authentication) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/login`, authentication, httpOptions)
      .pipe(
        map((user) => {
          if(user.success){
            this.setAuthentication(user.token);
            // Emitir el usuario actualizado
            this.currentUserSubject.next(this.getUser());
          }
          return user;
        })
      );
  }
  registerServer(authentication:Authentication) {
    return this.http
      .post<any>(`${environment.apiUrl}/register`, authentication, httpOptions)
      .pipe(
        map((user) => {
          /*if(user.status==1){
            this.setAuthentication(user.accessToken);
          }*/
          return user;
        })
      );
  }


//   logout() {
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem(this.TOKEN_NAME);
//     this.router.navigate(['/']);
//     return of({ success: false });
//   }

  setAuthentication(token:string){
    localStorage.setItem(this.TOKEN_NAME, token);
      const decoded = this.helper.decodeToken(token);

      const isExpired = this.helper.isTokenExpired(token);

      if (isExpired) {
        this.logout();
      } else {
        const roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
        // Si ya no tienes 'user' y 'idrol', usa directamente 'sub' y 'role'
       const user: Usuario = {
         id: 0, // Asigna un valor predeterminado o el valor real si está disponible
         email: decoded.sub,
         roles: roles
       };// O guarda más datos si tienes


        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("role", JSON.stringify(roles));
        // Emite el usuario incluyendo los roles
        this.currentUserSubject.next({ ...user, roles });
      }
  }
  getToken(): string {
    return localStorage.getItem(this.TOKEN_NAME) || '';
  }

  setToken(token: string) {
      localStorage.setItem(this.TOKEN_NAME, token);
    }


  getUser(){
    const decoded = this.helper.decodeToken(this.getToken());
    console.log('decoded token:', decoded);
    return decoded;
  }

  getRoles(): string[] {
       const role = localStorage.getItem("role");
       return role ? JSON.parse(role) : [];
    }

  idAuthenticated():boolean{
    const token = this.getToken();
    if(_.isNil(token) || token=='null') {
      return false;
    }
    return !this.helper.isTokenExpired(token);
  }

// Login con Office 365: se espera recibir el token de Microsoft (obtenido con MSAL, por ejemplo)
// loginMicrosoft(msToken: string): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(`${this.apiUrl}/login-microsoft`, { token: msToken });
// }

loginMicrosoft() {
    this.msalService.loginPopup().subscribe({
      next: (result: AuthenticationResult) => {
        console.log('Inicio de sesión exitoso', result);
        // Establece la cuenta activa y continua con la obtención del token
        this.msalService.instance.setActiveAccount(result.account);
        this.msalService.acquireTokenSilent({
            scopes: ['user.read'],
          }).pipe(
            catchError(error => {
              // Si el token silencioso falla, intenta obtener el token con un popup
              return this.msalService.acquireTokenPopup({
                scopes: ['user.read'],
              });
            })
          ).subscribe({
          next: (tokenResponse) => {
            console.log('Token de Microsoft:', tokenResponse.accessToken);
            this.http.post<LoginResponse>(`${this.apiUrl}/login-microsoft`, { token: tokenResponse.accessToken })
              .subscribe({
                next: (backendResponse) => {
                  if (backendResponse.token) {
                    this.setAuthentication(backendResponse.token);
                    this.currentUserSubject.next(this.getUser());
                    this.router.navigate(['/main']); // Redirige a la vista principal
                  }
                },
                error: (error) => {
                  console.error('Error en autenticación con backend:', error);
                  // Cierra el popup (MSAL lo debería cerrar automáticamente) y muestra tu alerta
                  alert(this.obtenerMensajeError(error));
                }
              });
          },
          error: (error) => {
            console.error('Error obteniendo el token de Microsoft:', error);
            alert(this.obtenerMensajeError(error));
          },
        });
      },
      error: (error) => {
        console.error('Error en la autenticación con Microsoft:', error);
        alert(this.obtenerMensajeError(error));
      },
    });
  }

 // Método para personalizar el mensaje de error
     private obtenerMensajeError(error: any): string {
       if (error.error && error.error.indexOf('AADSTS50020') !== -1) {
         return 'Usuario no registrado en el tenant. Por favor, utiliza una cuenta válida o contacta a tu administrador.';
       }
       return `Error de autenticación: ${error.message || error}`;
     }

  // Login manual: envía las credenciales y espera una respuesta con mensaje y token.
  loginManual(credentials: { email: string; password: string }): Observable<any> {
      return this.http.post<{ message: string; token: string }>(`${this.apiUrl}/login`, credentials)
        .pipe(
          tap(response => {
            if (response.token) {
              localStorage.setItem('upsjb_reserva', response.token);
              console.log('Token almacenado en localStorage:', response.token);
              this.scheduleAutoLogout();
            }
          })
        );
    }

// Registro manual: envía los datos del usuario
register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
}

// Llama a esta función después de un login exitoso para programar el cierre de sesión automático.
scheduleAutoLogout(): void {
  const token = localStorage.getItem(this.TOKEN_NAME);
  if (token) {
    try {
        const helper = new JwtHelperService();
        const decoded = helper.decodeToken(token);
      const expirationTime = decoded.exp * 1000; // Convertir de segundos a milisegundos
      const currentTime = Date.now();
      const timeout = expirationTime - currentTime;

      console.log('⏳ Tiempo restante para logout automático (ms):', timeout);

      if (timeout > 0) {
        setTimeout(() => {
          console.log('🔒 Token expirado. Cerrando sesión automáticamente...');
          this.logout();
        }, timeout);
      } else {
        this.logout();
      }
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      this.logout();
    }
  }
}


  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.TOKEN_NAME);
    // Redirige a la página de login o principal según tu flujo
    this.router.navigate(['/login']);
    return;
  }

  getEmail(): string {
      const token = localStorage.getItem(this.TOKEN_NAME) ?? '';
      if (!token || this.helper.isTokenExpired(token)) return '';
      const decoded = this.helper.decodeToken(token);
      // tu email está en `sub`
      return decoded.sub || '';
    }

}
