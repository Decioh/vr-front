import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry } from 'rxjs';
import { throwError } from 'rxjs';
import { Store } from 'src/app/models/store';

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  url = 'http://localhost:3000/lojas';
  private store: Store;

  constructor(private httpClient: HttpClient) {
    this.store = {
      id: 0,
      descricao: ''
    }
  }

  getStores(): Observable<Store[]> {
      return this.httpClient
        .get<Store[]>(this.url)
        .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
