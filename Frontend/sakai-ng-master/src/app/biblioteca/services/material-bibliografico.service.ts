import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { BibliotecaDTO } from '../../biblioteca/interfaces/material-bibliografico/biblioteca.model';
import { Ciudad } from '../../biblioteca/interfaces/material-bibliografico/ciudad';
import { OcurrenciaDTO } from '../interfaces/ocurrenciaDTO';
import { map } from 'rxjs/operators';
import { DetallePrestamo } from '../interfaces/detalle-prestamo';
import { Usuario } from '../interfaces/usuario';
import { Equipo } from '../interfaces/biblioteca-virtual/equipo';
import { OcurrenciaUsuario } from '../interfaces/OcurrenciaUsuario';
import { OcurrenciaMaterialDTO } from '../interfaces/OcurrenciaMaterialDTO';
import { DetalleBibliotecaDTO } from '../interfaces/material-bibliografico/DetalleBibliotecaDTO';
@Injectable({
  providedIn: 'root'
})
export class MaterialBibliograficoService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) {
    this.apiUrl = environment.apiUrl;
  }


  conf_event_delete(request: any,modulo: any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${modulo}`,
        {
            body: request, // Aquí especificas el cuerpo de la solicitud
            headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`)
        }
    );
  }
  api_libros_lista(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
    /*return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/libros.json');*/
  }
  filtros(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/opcionFiltroBiblioteca.json');
  }

  lista_opciones_libro(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/opciones-libro.json');
  }
  lista_especialidad(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/especialidad.json');
  }
  lista_pais(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/pais.json');
  }
  lista_ciudad(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/ciudad.json');
  }
  lista_idioma(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/data.json');
  }
  lista_descripcion_fisica(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/data.json');
  }
  lista_anio_publicacion(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/data.json');
  }
  lista_ejemplares(modulo: any):Observable<any>{
      console.log("aqui");
    return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/ejemplar.json');
  }
  lista_tipo_material(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/${modulo}`
            ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
            );
  }
  lista_tipo_adquisicion(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/api/${modulo}`
        ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
        );
  }

  search_get(url: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${url}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
    });
  }

    lista_estados(url: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/api/${url}`, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
      });
    }

  api_revistas_lista(modulo: string):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/revistas.json');
  }
  lista_periodicidad(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/data.json');
  }
  api_otros_lista(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/otro.json');
  }
  api_aceptaciones(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/aceptaciones.json');
  }
  api_aceptaciones_equipos(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/material-bibliografico/aceptaciones-equipos.json');
  }

  registrarMaterial(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/material-bibliografico/register`, data, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
    });
  }

  actualizarMaterial(materialCompleto: any): Observable<any> {
    // Se asume que la información del libro contiene el id
    const id = materialCompleto.informacionLibro.id;
    return this.http.put<any>(`${this.apiUrl}/api/material-bibliografico/update/${id}`, materialCompleto, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
    });
  }

  eliminarMaterial(id: number): Observable<any> {
      const url = `${this.apiUrl}/api/material-bibliografico/delete/${id}`;
      return this.http.delete<any>(url, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
      });
    }

registrarEspecialidad(especialidad: any): Observable<any> {
    const url = `${this.apiUrl}/registrar/especialidad`;
    return this.http.post<any>(url, especialidad, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
    });
  }

      list(): Observable<BibliotecaDTO[]> {
        return this.http.get<any>(`${this.apiUrl}/list`).pipe(map(r => r.data));
      }
      get(id: number): Observable<BibliotecaDTO> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
      }
      create(dto: BibliotecaDTO): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/api/biblioteca/register`, dto);
      }
      update(id: number, dto: BibliotecaDTO): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/api/biblioteca/update/${id}`, dto);
      }
      delete(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/api/biblioteca/delete/${id}`);
      }
      listCiudades(): Observable<Ciudad[]> {
        return this.http.get<any>(`${this.apiUrl}/ciudades`).pipe(map(r => r.data));
      }
    listarTodas(): Observable<Ciudad[]> {
      return this.http.get<Ciudad[]>(`${environment.apiUrl}/api/biblioteca/listciudades`);
    }

    listarPorPais(paisId: string): Observable<Ciudad[]> {
      return this.http.get<Ciudad[]>(
        `${environment.apiUrl}/api/biblioteca/by-pais`, { params: { paisId } }
      );
    }

    listarMateriales(): Observable<BibliotecaDTO[]> {
      return this.http
        .get<{ status: number; data: BibliotecaDTO[] }>('http://localhost:8080/auth/api/material-bibliografico/list')
        .pipe(
          map(resp => resp.data)    // extrae SOLO el array
        );
    }

catalogo(
    valor?: string,
    sedeId?: number,
    tipoMaterial?: number,
    opcion?: string
  ): Observable<BibliotecaDTO[]> {
    let params = new HttpParams();
    if (valor)          params = params.set('valor', valor);
    if (sedeId != null) params = params.set('sedeId', sedeId.toString());
    if (tipoMaterial!=null) params = params.set('tipoMaterial', tipoMaterial.toString());
    if (opcion)         params = params.set('opcion', opcion);

    return this.http
      .get<{ status: number; data: BibliotecaDTO[] }>(
        `${this.apiUrl}/api/biblioteca/catalogo`,
        { params }
      )
      .pipe(map(resp => resp.data));
  }
    private get headers(): HttpHeaders {
      return new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.authService.getToken()}`
      );
    }

crearOcurrencia(dto: OcurrenciaDTO): Observable<OcurrenciaDTO> {
  return this.http.post<OcurrenciaDTO>(
    `${this.apiUrl}/api/ocurrencias-biblio`,
    dto,
    { headers: this.headers }
  );
}

  api_ocurrencias_laboratorio(): Observable<OcurrenciaDTO[]> {
    return this.http.get<OcurrenciaDTO[]>(
      `${this.apiUrl}/api/ocurrencias-biblio`,
      { headers: this.headers }
    );
  }

  getOcurrenciaById(id: number): Observable<OcurrenciaDTO> {
    return this.http.get<OcurrenciaDTO>(
      `${this.apiUrl}/api/ocurrencias-biblio/${id}`,
      { headers: this.headers }
    );
  }

  getDetallePrestamo(id: number): Observable<DetallePrestamo> {
    return this.http
      .get<{status:string, data: DetallePrestamo}>(`${this.apiUrl}/api/prestamos/${id}`, { headers: this.headers })
      .pipe(map(resp => resp.data));
  }

    /** Lista usuarios; si pasas `search` filtra por código o email */
    listarUsuarios(search?: string): Observable<Usuario[]> {
      let params = new HttpParams();
      if (search && search.trim().length) {
        params = params.set('search', search.trim());
      }
      return this.http
        .get<{ status: string; data: Usuario[] }>(
          `${this.apiUrl}/api/prestamos/usuarios`,
          { headers: this.headers, params }
        )
        .pipe(map(resp => resp.data));
    }

    /** Lista equipos; si pasas `search` filtra por id, nombre o ip */
    listarEquipos(search?: string): Observable<Equipo[]> {
      let params = new HttpParams();
      if (search && search.trim().length) {
        params = params.set('search', search.trim());
      }
      return this.http
        .get<{ status: string; data: Equipo[] }>(
          `${this.apiUrl}/api/prestamos/equipos`,
          { headers: this.headers, params }
        )
        .pipe(map(resp => resp.data));
    }

    addInvolucrado(idOcurrencia: number, usuario: {codigoUsuario:string,tipoUsuario:number}) {
      return this.http.post(
        `${this.apiUrl}/api/ocurrencias-biblio/${idOcurrencia}/usuarios`,
        usuario,
        { headers: this.headers }
      );
    }

    addMaterial(idOcurrencia: number, material: {idEquipo:number,cantidad:number}) {
      return this.http.post(
        `${this.apiUrl}/api/ocurrencias-biblio/${idOcurrencia}/materiales`,
        material,
        { headers: this.headers }
      );
    }

listarUsuariosOcurrencia(id: number): Observable<OcurrenciaUsuario[]> {
  return this.http.get<OcurrenciaUsuario[]>(
    `${this.apiUrl}/api/ocurrencias-biblio/${id}/usuarios`,
    { headers: this.headers }
  );
}


  listarMaterialesOcurrencia(idOcurrencia: number): Observable<OcurrenciaMaterialDTO[]> {
    return this.http.get<OcurrenciaMaterialDTO[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/${idOcurrencia}/materiales`
    );
  }

  costearMateriales(
    idOcurrencia: number,
    payload: { idMaterial: number; costoUnitario: number }[]
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/ocurrencias-biblio/${idOcurrencia}/costos`,
      payload
    );
  }

    listarDetallesReservados(): Observable<DetalleBibliotecaDTO[]> {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${this.authService.getToken()}`);
      return this.http
        .get<{ status: number; data: DetalleBibliotecaDTO[] }>(
          `${this.apiUrl}/api/biblioteca/detalles/reservados`,
          { headers }
        )
        .pipe(map(resp => resp.data));
    }

  listarDetallesPorBiblioteca(bibliotecaId: number): Observable<DetalleBibliotecaDTO[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    return this.http
      .get<{ status: number; data: DetalleBibliotecaDTO[] }>(
        `${this.apiUrl}/api/biblioteca/${bibliotecaId}/detalles`,
        { headers }
      )
      .pipe(map(resp => resp.data));
  }

  listarBibliotecasReservadas(): Observable<BibliotecaDTO[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );

    return this.http
      .get<{ status: number; data: BibliotecaDTO[] }>(
        `${this.apiUrl}/api/biblioteca/reservados`,
        { headers }
      )
      .pipe(map(resp => resp.data));
  }

    listarTodosDetallesReservados(): Observable<DetalleBibliotecaDTO[]> {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.authService.getToken()}`
      );

      return this.http
        .get<{ status: number; data: DetalleBibliotecaDTO[] }>(
          `${this.apiUrl}/api/biblioteca/detalles/reservados`,
          { headers }
        )
        .pipe(map(resp => resp.data));
    }
  /**
   * Llama al endpoint para marcar un detalle como “prestado”.
   * Equivale a DELETE /auth/api/prestamos/prestar con body { id }.
   */
  prestarDetalle(idDetalle: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.delete<any>(
      `${this.apiUrl}/api/prestamos/prestar`,
      {
        body: { id: idDetalle },
        headers
      }
    );
  }

  /**
   * Llama al endpoint para cancelar la reserva de un detalle.
   * Equivale a DELETE /auth/api/prestamos/cancelar con body { id }.
   */
  cancelarDetalle(idDetalle: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.delete<any>(
      `${this.apiUrl}/api/prestamos/cancelar`,
      {
        body: { id: idDetalle },
        headers
      }
    );
  }


}
