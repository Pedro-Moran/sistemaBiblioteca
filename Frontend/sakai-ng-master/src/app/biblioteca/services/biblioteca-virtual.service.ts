import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Equipo } from '../../biblioteca/interfaces/biblioteca-virtual/equipo';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaVirtualService {
    private apisUrl = environment.apiUrl + '/api/equipos';
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) {
    this.apiUrl = environment.apiUrl;
  }
  api_equipos(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/biblioteca-virtual/equipos.json');
  }
  api_estados(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/biblioteca-virtual/estados.json');
  }

  crearEquipo(equipo: Equipo): Observable<any> {
      return this.http.post<any>(`${this.apisUrl}/create`, equipo);
    }

    actualizarEquipo(id: number, equipo: Equipo): Observable<any> {
      return this.http.put<any>(`${this.apisUrl}/update/${id}`, equipo);
    }

    eliminarEquipo(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apisUrl}/delete/${id}`);
    }

    listarEquipos(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/listWithoutEnProceso`);
    }

    listarEquiposEnProceso(): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/listEnProceso`);
    }

    filtrarPorSede(sedeId: number): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/filter?sedeId=${sedeId}`);
    }
    filtrarPorSedeEnProcesp(sedeId: number): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/filter/onlyEnProceso?sedeId=${sedeId}`);
    }

    cambiarEstado(id: number, estado: string): Observable<any> {
      return this.http.put<any>(`${this.apisUrl}/changeState/${id}?estado=${estado}`, {});
    }

    obtenerEquipo(id: number): Observable<any> {
      return this.http.get<any>(`${this.apisUrl}/${id}`);
    }

    listarEstados(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/equipos/estados`);
    }

    solicitar(req: any): Observable<any> {
        // antes: this.http.post('/auth/api/prestamos/solicitar', req)
        return this.http.post(
          `${this.apiUrl}/api/prestamos/solicitar`,
          req,
          { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
        );
    }

  listarPendientes(sedeId?: number) {
    let url = `${environment.apiUrl}/api/prestamos/pendientes`;
      if (sedeId && sedeId > 0) {
        url += `?sedeId=${sedeId}`;
      }
      return this.http.get<{status:string,data:any[]}>(url);
  }

  listarDevoluciones(sedeId?: number) {
      let url = `${this.apiUrl}/api/prestamos/devoluciones`;
      if (sedeId && sedeId !== 0) {
        url += `?sedeId=${sedeId}`;
      }
      return this.http.get<{status:string, data:any[]}>(url);
    }

    devolver(id: number) {
      return this.http.post<{status:string, data:any}>(`${this.apiUrl}/api/prestamos/devolver`, { id });
    }

    cancelar(id: number) {
    // Reusa el mismo endpoint de “procesar” pero con aprobar=false
    return this.http.post<{status:string,data:any}>(
      `${this.apiUrl}/procesar`,
      { id, aprobar: false }
    );
  }

}
