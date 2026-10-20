import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Festa {
  _id?: string;
  nome: string;
  data: string;
  horario: string;
  observacao?: string;
  usuario?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private apiUrl = 'http://localhost:3000/agenda';

  constructor(private http: HttpClient) {}

  listar(): Observable<Festa[]> {
    return this.http.get<Festa[]>(this.apiUrl);
  }

  listarPorData(data: string): Observable<Festa[]> {
    return this.http.get<Festa[]>(
      `${this.apiUrl}/data/${data}`
    );
  }

  buscarPorId(id: string): Observable<Festa> {
    return this.http.get<Festa>(
      `${this.apiUrl}/${id}`
    );
  }

  cadastrar(festa: Festa): Observable<Festa> {
    return this.http.post<Festa>(
      this.apiUrl,
      festa
    );
  }

  editar(id: string, festa: Festa): Observable<Festa> {
    return this.http.put<Festa>(
      `${this.apiUrl}/${id}`,
      festa
    );
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}
