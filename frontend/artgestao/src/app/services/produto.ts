import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  _id?: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = 'http://localhost:3000/produtos';

  constructor(private http: HttpClient) {}

  listar(nome?: string): Observable<Produto[]> {

    let params = new HttpParams();

    if (nome) {
      params = params.set('nome', nome);
    }

    return this.http.get<Produto[]>(this.apiUrl, { params });
  }

  buscarPorId(id: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  cadastrar(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  editar(id: string, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  atualizarQuantidade(
    id: string,
    quantidade: number
  ): Observable<Produto> {

    return this.http.patch<Produto>(
      `${this.apiUrl}/${id}/quantidade`,
      { quantidade }
    );
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
