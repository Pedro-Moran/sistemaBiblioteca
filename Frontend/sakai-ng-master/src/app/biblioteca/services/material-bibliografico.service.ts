import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { EjemplarPrestadoDTO } from '../interfaces/reportes/ejemplar-prestado';
import { EjemplarNoPrestadoDTO } from '../interfaces/reportes/ejemplar-no-prestado';
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
import { DetalleBibliotecaDTO } from '../interfaces/material-bibliografico/biblioteca.model';
import { Tesis } from '../../biblioteca/interfaces/material-bibliografico/tesis';
import { Libro } from '../../biblioteca/interfaces/material-bibliografico/libro';
import { Revista } from '../../biblioteca/interfaces/material-bibliografico/revista';
import { Otro } from '../../biblioteca/interfaces/material-bibliografico/otro';
import { Detalle } from '../../biblioteca/interfaces/material-bibliografico/detalle';
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

  deleteBulk(ids: number[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/material-bibliografico/delete-bulk`,
      ids,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }

  deleteBulkBiblioteca(ids: number[]): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/biblioteca/delete-bulk`,
      ids,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
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
      create(dto: BibliotecaDTO, file?: File): Observable<any> {
        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
        if (file) {
          formData.append('portada', file, file.name);
        }
        return this.http.post<any>(`${this.apiUrl}/api/biblioteca/register`, formData);
      }
      update(id: number, dto: BibliotecaDTO, file?: File): Observable<any> {
        const formData = new FormData();
        formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
        if (file) {
          formData.append('portada', file, file.name);
        }
        return this.http.put<any>(`${this.apiUrl}/api/biblioteca/update/${id}`, formData);
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

    /** Obtiene todos los registros de biblioteca en estado disponible */
  listarDisponibles(): Observable<BibliotecaDTO[]> {
      return this.http
        .get<{ status: number; data: BibliotecaDTO[] }>(
          `${this.apiUrl}/api/biblioteca/disponibles`
        )
        .pipe(map(resp => resp.data));
  }

  /** Lista los registros disponibles filtrando por tipo de material */
  listarDisponiblesPorTipoMaterial(tipo: number): Observable<BibliotecaDTO[]> {
    return this.http
      .get<{ status: number; data: BibliotecaDTO[] }>(
        `${this.apiUrl}/api/biblioteca/disponibles-by-tipo`,
        { params: { tipoMaterial: tipo } }
      )
      .pipe(map(resp => resp.data));
  }

    /**
     * Lista los materiales de tipo Tesis.
     * Se filtra por el identificador del tipo de material correspondiente a las
     * tesis (actualmente 3).
     */
    listarTesis(sedeId?: number): Observable<Tesis[]> {
      return this.catalogo(undefined, sedeId, 3, 'disponibles')
        .pipe(
          map(lista => lista.map(b => new Tesis({
            id: b.id ?? 0,
            codigo: b.codigoLocalizacion ?? '',
            titulo: b.titulo ?? '',
            autorPrincipal: b.autorPersonal ?? '',
            pais: (b as any).pais ?? (b.paisId ? { descripcion: b.paisId } as any : null),
            ciudad: (b as any).ciudad ?? (b.ciudadCodigo ? { descripcion: b.ciudadCodigo } as any : null),
            numeroPaginas: b.numeroPaginas ?? null,
            cantidad: b.existencias ?? 0,
            anioPublicacion: b.anioPublicacion ?? null,
            anio: b.anioPublicacion?.toString() ?? '',
            especialidad: (b as any).especialidad ?? (b.idEspecialidad ? { idEspecialidad: b.idEspecialidad, descripcion: String(b.idEspecialidad) } as any : null),
            formatoDigital: b.fladigitalizado ?? false,
            urlPublicacion: b.linkPublicacion ?? '',
            descriptores: b.descriptor ?? '',
            notasTesis: b.notaContenido ?? '',
            notasGeneral: b.notaGeneral ?? '',
            detalle: (b as any).detalles?.map((d: any) => this.mapDetalle(d)) ?? []
        })))
      );
    }

    /**
     * Lista los materiales disponibles filtrando por el tipo de material.
     * Si no se especifica un tipo, devuelve todos los registros disponibles.
     */
    listarPorTipoMaterial(tipo?: number, sedeId?: number): Observable<BibliotecaDTO[]> {
      return this.catalogo(undefined, sedeId, tipo, 'disponibles');
    }

    /**
     * Lista los materiales cuya cabecera no está en proceso (aprobados).
     * Utiliza el endpoint de búsqueda general con el parámetro `soloEnProceso=false`.
     */
    listarAprobadosPorTipoMaterial(tipo?: number, sedeId?: number): Observable<BibliotecaDTO[]> {
      let params = new HttpParams().set('soloEnProceso', 'false');
      if (tipo != null) params = params.set('tipoMaterial', String(tipo));
      if (sedeId != null) params = params.set('sedeId', String(sedeId));
      return this.http
        .get<{ status: number; data: BibliotecaDTO[] }>(
          `${this.apiUrl}/api/biblioteca/search`,
          { params }
        )
        .pipe(map(resp => resp.data));
    }

    /** Devuelve la lista de materiales ya mapeados según el tipo especificado */
    listarColeccionDetalle(tipo: number, sedeId?: number): Observable<(Libro|Revista|Tesis|Otro)[]> {
      return this.listarPorTipoMaterial(tipo, sedeId).pipe(
        map(lista => lista.map(b => {
          switch (tipo) {
            case 1: return this.mapToLibro(b);
            case 2: return this.mapToRevista(b);
            case 3: return new Tesis({
              id: b.id ?? 0,
              codigo: b.codigoLocalizacion ?? '',
              titulo: b.titulo ?? '',
              autorPrincipal: b.autorPersonal ?? '',

              pais: (b as any).pais ?? (b.paisId ? { descripcion: b.paisId } as any : null),
              ciudad: (b as any).ciudad ?? (b.ciudadCodigo ? { descripcion: b.ciudadCodigo } as any : null),
              descripcionFisica: (b as any).descripcionFisica ?? null,
              numeroPaginas: b.numeroPaginas ?? null,
              cantidad: b.existencias ?? 0,
              anioPublicacion: b.anioPublicacion ?? null,
              anio: b.anioPublicacion?.toString() ?? '',
              especialidad: (b as any).especialidad ?? (b.idEspecialidad ? { idEspecialidad: b.idEspecialidad, descripcion: String(b.idEspecialidad) } as any : null),
              formatoDigital: b.fladigitalizado ?? false,
              urlPublicacion: b.linkPublicacion ?? '',
              descriptores: b.descriptor ?? '',
              notasTesis: b.notaContenido ?? '',
              notasGeneral: b.notaGeneral ?? '',
              portada: b.nombreImagen ? true : false,
              detalle: (b as any).detalles?.map((d: any) => this.mapDetalle(d)) ?? []

            });
            default: return this.mapToOtro(b);
          }
        }))
      );
    }

    private mapToLibro(b: BibliotecaDTO): Libro {
      return new Libro({
        id: b.id ?? 0,
        codigo: b.codigoLocalizacion ?? '',
        titulo: b.titulo ?? '',
        autorPrincipal: b.autorPersonal ?? '',
        autorSecundario: b.autorSecundario ?? '',
        autorInstitucional: b.autorInstitucional ?? '',
        coordinador: b.coordinador ?? '',
        director: b.director ?? '',
        editorialPublicacion: b.editorialPublicacion ?? '',
        pais: (b as any).pais ?? null,
        ciudad: (b as any).ciudad ?? null,
        numeroPaginas: b.numeroPaginas ?? null,
        edicion: b.edicion ?? null,
        reimpresion: b.reimpresion ?? null,
        anioPublicacion: b.anioPublicacion ?? null,
        serie: b.serie ?? '',
        isbn: b.isbn ?? null,
        idioma: (b as any).idioma ?? null,
        numeroDeIngreso: b.numeroDeIngreso ?? null,
        rutaImagen: b.rutaImagen ?? undefined,
        nombreImagen: b.nombreImagen ?? undefined,
        especialidad: (b as any).especialidad ?? null,
        enSilabo: b.flasyllabus ?? false,
        cicloI: (b as any).cicloI ?? null,
        cicloII: (b as any).cicloII ?? null,
        cicloIII: (b as any).cicloIII ?? null,
        cicloIV: (b as any).cicloIV ?? null,
        cicloV: (b as any).cicloV ?? null,
        cicloVI: (b as any).cicloVI ?? null,
        cicloVII: (b as any).cicloVII ?? null,
        cicloVIII: (b as any).cicloVIII ?? null,
        cicloIX: (b as any).cicloIX ?? null,
        cicloX: (b as any).cicloX ?? null,
        cicloXI: (b as any).cicloXI ?? null,
        cicloXII: (b as any).cicloXII ?? null,
        cicloXIII: (b as any).cicloXIII ?? null,
        cicloXIV: (b as any).cicloXIV ?? null,
        formatoDigital: b.fladigitalizado ?? false,
        urlPublicacion: b.linkPublicacion ?? '',
        descriptores: b.descriptor ?? '',
        notasContenido: b.notaContenido ?? '',
        notasGeneral: b.notaGeneral ?? '',
        editorial: (b as any).editorial ?? null,
        detalle: (b as any).detalles?.map((d: any) => new Detalle(d)) ?? []
      });
    }

    private mapToRevista(b: BibliotecaDTO): Revista {
      return new Revista({
        id: b.id ?? 0,
        codigo: b.codigoLocalizacion ?? '',
        director: b.director ?? '',
        institucion: b.autorInstitucional ?? '',
        especialidad: (b as any).especialidad ?? null,
        titulo: b.titulo ?? '',
        tituloAnterior: b.tituloAnterior ?? '',
        editorialPublicacion: b.editorialPublicacion ?? '',
        periodicidad: (b as any).periodicidad ?? null,
        pais: (b as any).pais ?? null,
        ciudad: (b as any).ciudad ?? null,
        descripcionFisica: (b as any).descripcionFisica ?? null,
        cantidad: b.existencias ?? 0,
        anioPublicacion: b.anioPublicacion ?? null,
        anio: b.anioPublicacion?.toString() ?? '',
        isbn: b.isbn ?? null,
        formatoDigital: b.fladigitalizado ?? false,
        urlPublicacion: b.linkPublicacion ?? '',
        descriptores: b.descriptor ?? '',
        portada: b.nombreImagen ? true : false,
        detalle: (b as any).detalles?.map((d: any) => new Detalle(d)) ?? []
      });
    }


  private mapToOtro(b: BibliotecaDTO): Otro {
    return new Otro({
      id: b.id ?? 0,
        tituloArticulo: b.titulo ?? '',
        tituloRevista: b.editorialPublicacion ?? '',
        autorPrincipal: b.autorPersonal ?? '',
        descripcionRevista: b.tituloAnterior ?? '',
        descripcionFisica: (b as any).descripcionFisica ?? null,
        cantidad: b.existencias ?? 0,
        formatoDigital: b.fladigitalizado ?? false,
        urlPublicacion: b.linkPublicacion ?? '',
        descriptores: b.descriptor ?? '',
        notasGeneral: b.notaGeneral ?? '',
        portada: b.nombreImagen ? true : false,

      detalle: (b as any).detalles?.map((d: any) => new Detalle(d)) ?? []
    });
  }

  /**
   * Crea un objeto Detalle asegurando que existan subobjetos
   * para sede y tipo de adquisición a partir de los códigos
   * recibidos desde el backend.
   */
  private mapDetalle(d: any): Detalle {
    const det = new Detalle(d);
    if (!det.sede && det.codigoSede != null) {
      det.sede = { id: Number(det.codigoSede), descripcion: String(det.codigoSede), activo: true } as any;
    }
    if (!det.tipoAdquisicion && det.tipoAdquisicionId != null) {
      const id = typeof det.tipoAdquisicionId === 'number' ? det.tipoAdquisicionId : (det.tipoAdquisicionId as any).id;
      det.tipoAdquisicion = { id, descripcion: String(id), activo: true } as any;
    }
    if (d.estadoDescripcion && !det.estadoDescripcion) {
      det.estadoDescripcion = d.estadoDescripcion;
    }
    return det;
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

  /** Ocurrencias ligadas a equipos de cómputo */
  api_ocurrencias_laboratorio(): Observable<OcurrenciaDTO[]> {
    return this.http.get<OcurrenciaDTO[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/equipos`,
      { headers: this.headers }
    );
  }

  /** Ocurrencias ligadas a material bibliográfico */
  api_ocurrencias_biblioteca(): Observable<OcurrenciaDTO[]> {
    return this.http.get<OcurrenciaDTO[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/materiales`,
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

  /** Obtiene un detalle de biblioteca por su ID */
  getDetalleBiblioteca(id: number): Observable<DetalleBibliotecaDTO> {
    return this.http.get<DetalleBibliotecaDTO>(
      `${this.apiUrl}/api/biblioteca/detalles/${id}`,
      { headers: this.headers }
    );
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

    addMaterial(idOcurrencia: number, material: {idEquipo:number,cantidad:number,esBiblioteca?:boolean}) {
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
      `${this.apiUrl}/api/ocurrencias-biblio/${idOcurrencia}/materiales`,
      { headers: this.headers }
    );
  }

  costearMateriales(
    idOcurrencia: number,
    payload: { idMaterial: number; costoUnitario: number }[]
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/api/ocurrencias-biblio/${idOcurrencia}/costos`,
      payload,
      { headers: this.headers }
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

  listarDetallesPorBiblioteca(
    bibliotecaId: number,
    soloEnProceso: boolean = false
  ): Observable<DetalleBibliotecaDTO[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    const params = new HttpParams().set(
      'soloEnProceso', String(soloEnProceso)
    );

    return this.http
      .get<{ status: number; data: DetalleBibliotecaDTO[] }>(
        `${this.apiUrl}/api/biblioteca/${bibliotecaId}/detalles`,
        { headers, params }
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

  /** Lista los ejemplares prestados (pendientes de devolución) */
  listarDetallesPrestados(): Observable<DetalleBibliotecaDTO[]> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http
      .get<{ status: number; data: DetalleBibliotecaDTO[] }>(
        `${this.apiUrl}/api/biblioteca/prestados`,
        { headers }
      )
      .pipe(map(resp => resp.data));
  }
  /**
   * Marca un detalle como “prestado”.
   */
  prestarDetalle(idDetalle: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    const payload = {
      idDetalleBiblioteca: idDetalle,
      idEstado: 4,
      idUsuario: this.authService.getUser()?.sub ?? 0
    };
    return this.http.put<any>(
      `${this.apiUrl}/api/biblioteca/detalles/estado`,
      payload,
      { headers }
    );
  }

  /**
   * Cancela la reserva de un detalle, regresándolo a DISPONIBLE.
   */
  cancelarDetalle(idDetalle: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    const payload = {
      idDetalleBiblioteca: idDetalle,
      idEstado: 2,
      idUsuario: this.authService.getUser()?.sub ?? 0
    };
    return this.http.put<any>(
      `${this.apiUrl}/api/biblioteca/detalles/estado`,
      payload,
      { headers }
    );
  }

  /**
   * Registra la devolución de un ejemplar, cambiándolo a DISPONIBLE.
   */
  devolverDetalle(idDetalle: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.authService.getToken()}`
    );
    return this.http.post<any>(
      `${this.apiUrl}/api/biblioteca/detalles/devolver`,
      { idDetalleBiblioteca: idDetalle },
      { headers }
    );
  }


  /** Obtiene el reporte de ejemplares mas prestados */
  reporteEjemplarMasPrestado(): Observable<EjemplarPrestadoDTO[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<{ status: number; data: EjemplarPrestadoDTO[] }>(`${this.apiUrl}/api/biblioteca/reporte/ejemplar-mas-prestado`, { headers }).pipe(map(resp => resp.data));
  }

  /** Obtiene el reporte de ejemplares que nunca fueron prestados */
  reporteEjemplarNoPrestado(): Observable<EjemplarNoPrestadoDTO[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get<{ status: number; data: EjemplarNoPrestadoDTO[] }>(`${this.apiUrl}/api/biblioteca/reporte/ejemplar-no-prestados`, { headers }).pipe(map(resp => resp.data));
  }
}
