import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcurrenciasService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) { 
    this.apiUrl = environment.apiUrl;
  }
  
  conf_event_get(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/data.json');
  }
  conf_event_post(request: any,modulo: any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
  conf_event_put(request: any,modulo: any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
  conf_event_delete(request: any,modulo: any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${modulo}`,
        {
            body: request, // Aquí especificas el cuerpo de la solicitud
            headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`)
        }
    );
  }

  api_ocurrencias_biblioteca(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/ocurrencias/ocurrencias-biblioteca.json');
  }
  api_ocurrencias_laboratorio(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/ocurrencias/ocurrencias-laboratorio.json');
  }
  api_autorizacion_regularizacion(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/ocurrencias/autorizacion.json');
  }

  api_ocurrencias_prestamos_lista(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/ocurrenciasPrestamos.json');
  }
  api_prestamos_lista(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/prestamos.json');
  }
  api_situacion_lista(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/situacionOcurrencia.json');
  }
  
  api_constancias(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/constancias/imprimir.json');
  }

}
