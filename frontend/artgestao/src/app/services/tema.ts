import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Tema {
  _id?: string;
  nome: string;
  descricao: string;
  imagens: string[];
}

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  private apiUrl = 'http://localhost:3000/temas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<Tema> {
    return this.http.get<Tema>(
      `${this.apiUrl}/${id}`
    );
  }

  cadastrar(formData: FormData): Observable<Tema> {
    return this.http.post<Tema>(
      this.apiUrl,
      formData
    );
  }

  editar(
    id: string,
    formData: FormData
  ): Observable<Tema> {

    return this.http.put<Tema>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  excluirImagem(
    id: string,
    imagem: string
  ): Observable<Tema> {

    return this.http.request<Tema>(
      'DELETE',
      `${this.apiUrl}/${id}/imagem`,
      {
        body: {
          imagem: imagem
        }
      }
    );

  }

  excluir(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

}