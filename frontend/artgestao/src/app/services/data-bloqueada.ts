import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DataBloqueada {
  _id?: string;
  data: string;
  motivo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataBloqueadaService {

  private apiUrl = 'http://localhost:3000/datas-bloqueadas';

  constructor(private http: HttpClient) {}

  listar(): Observable<DataBloqueada[]> {
    return this.http.get<DataBloqueada[]>(this.apiUrl);
  }

  bloquear(data: string, motivo: string = ''): Observable<DataBloqueada> {
    return this.http.post<DataBloqueada>(this.apiUrl, { data, motivo });
  }

  desbloquear(data: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${data}`);
  }

}
