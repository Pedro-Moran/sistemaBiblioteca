import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Notificacion } from '../interfaces/notificacion';
import { DetallePrestamo } from '../interfaces/detalle-prestamo';
import { map } from 'rxjs/operators';
import { UsuarioPrestamosDTO } from '../interfaces/reportes/usuario-prestamos';
import { EquipoUsoTiempoDTO } from '../interfaces/reportes/equipo-uso-tiempo';
import { UsuarioPrestamosDTO } from '../interfaces/reportes/usuario-prestamos';
import { VisitanteBibliotecaVirtualDTO } from '../interfaces/reportes/visitante-biblioteca-virtual';

@Injectable({
    providedIn: 'root'
})
export class PrestamosService {
    private apiUrl: string;
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.apiUrl = environment.apiUrl;
    }
    api_prestamos_material_bibliografico(modulo: any): Observable<any> {
        /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
        return this.http.get<any[]>('assets/demo/biblioteca/prestamos/prestamos.json');
    }
    api_prestamos_tipos(modulo: any): Observable<any> {
        /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
        return this.http.get<any[]>('assets/demo/biblioteca/prestamos/tipo.json');
    }

    api_prestamos_biblioteca_virtual(modulo: any): Observable<any> {
        /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
        return this.http.get<any[]>('assets/demo/biblioteca/devoluciones/devoluciones.json');
    }

    //   procesarPrestamo(dto: { id: number; aprobar: boolean; }) {
    //       return this.http.post<any>(
    //           `${this.apiUrl}/api/prestamos/procesar`,
    //           dto,
    //           { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
    //         );
    //     }
    procesarPrestamo(id: number, aprobar: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/api/prestamos/procesar`, { id, aprobar });
    }

    getPendientes(sedeId?: string) {
        const url = sedeId ? `${this.apiUrl}/api/prestamos/pendientes?sedeId=${sedeId}` : `${this.apiUrl}/api/prestamos/pendientes`;
        return this.http.get<{ status: string; data: any[] }>(url);
    }

    listarNoLeidas(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.apiUrl}/api/prestamos/no-leidas`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }

    marcarLeida(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/api/prestamos/${id}/leer`, {});
    }

    getMisPrestamos() {
        return this.http.get<{ status: string; data: any[] }>(`${this.apiUrl}/api/prestamos/mis-prestamos`);
    }
    getNotificacionesNoLeidas(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.apiUrl}/api/prestamos/no-leidas`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }

    getNotificaciones(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.apiUrl}/api/prestamos/notificaciones`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }
    listar(sede?: number, tipoUsuario?: string, tipoPrestamo?: string, escuela?: string, programa?: string, ciclo?: string, fechaInicio?: string, fechaFin?: string): Observable<DetallePrestamo[]> {
        let params = new HttpParams();

        if (sede != null) params = params.set('sede', sede.toString());
        if (tipoUsuario) params = params.set('tipoUsuario', tipoUsuario);
        if (tipoPrestamo) params = params.set('estado', tipoPrestamo);
        if (escuela) params = params.set('escuela', escuela);
        if (programa) params = params.set('programa', programa);
        if (ciclo) params = params.set('ciclo', ciclo);
        if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
        if (fechaFin) params = params.set('fechaFin', fechaFin);

        return this.http.get<{ status: string; data: DetallePrestamo[] }>(`${this.apiUrl}/api/prestamos/reporte`, { params }).pipe(map((resp) => resp.data ?? []));
    }

    listarEstados(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/equipos/estados`);
    }

    /** Obtiene el total de préstamos por usuario */
    reporteEstudiantesAtendidos(): Observable<UsuarioPrestamosDTO[]> {
        return this.http.get<{ status: string; data: UsuarioPrestamosDTO[] }>(`${this.apiUrl}/api/prestamos/reporte/estudiantes-atendidos`).pipe(map((r) => r.data ?? []));
    }

    /** Obtiene los usuarios atendidos de biblioteca virtual */
    reporteUsuariosAtendidosBiblioteca(): Observable<UsuarioPrestamosDTO[]> {
        return this.http
            .get<{ status: string; data: UsuarioPrestamosDTO[] }>(
                `${this.apiUrl}/api/prestamos/reporte/usuarios-atendidos-biblioteca`
            )
            .pipe(map((r) => r.data ?? []));
    }

    /** Obtiene el uso de tiempo de los equipos de biblioteca virtual */
    reporteUsoTiempoBiblioteca(fechaInicio?: string, fechaFin?: string): Observable<EquipoUsoTiempoDTO[]> {
        let params = new HttpParams();
        if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
        if (fechaFin) params = params.set('fechaFin', fechaFin);

        return this.http
            .get<{ status: number; data: EquipoUsoTiempoDTO[] }>(`${this.apiUrl}/api/prestamos/reporte/uso-tiempo-biblioteca`, {
                headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`),
                params
            })
            .pipe(map((resp) => resp.data ?? []));
    }

    /** Obtiene los visitantes de biblioteca virtual */
    reporteVisitantesBibliotecaVirtual(): Observable<VisitanteBibliotecaVirtualDTO[]> {
        return this.http
            .get<{ status: string; data: VisitanteBibliotecaVirtualDTO[] }>(
                `${this.apiUrl}/api/prestamos/reporte/visitantes-biblioteca-virtual`
            )
            .pipe(map((resp) => resp.data ?? []));
    }
}
