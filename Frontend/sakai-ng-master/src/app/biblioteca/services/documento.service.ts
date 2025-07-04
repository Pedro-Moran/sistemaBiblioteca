import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  consultar(tipo: string, numero: string): Observable<any> {
    const url = `${this.apiUrl}/api/documento/consultar/${tipo}/${numero}`;
    return this.http.get<any>(url);
  }
}
