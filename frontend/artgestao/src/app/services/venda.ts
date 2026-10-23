import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemVenda {
  produto: string;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  totalItem: number;
}

export interface Venda {
  _id?: string;
  itens: ItemVenda[];
  totalVenda: number;
  data: string;
  observacao?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private apiUrl = 'http://localhost:3000/vendas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  buscarPorId(id: string): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`);
  }

  cadastrar(venda: Partial<Venda>): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda);
  }

  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
