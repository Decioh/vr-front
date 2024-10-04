import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject, catchError, retry, throwError } from 'rxjs';
import { FullProduct } from 'src/app/models/full-product';
import { RegisterProductObj } from 'src/app/models/register-product-obj';
import { StorePriced } from 'src/app/models/store';

@Injectable({
  providedIn: 'root',
})
export class StoreProductsService {
  url = 'http://localhost:3000/produtolojas';

  // Objeto de requisição inicializado com valores padrão

  requisitionObject = {
    descricao: '',
    lojas: [],
  } as RegisterProductObj;

  // Array para armazenar preços na loja

  storesPrices = [] as StorePriced[];

  // Subject para notificar a atualização de produtos na loja

  private updateStoreProducts = new Subject<void>();
  // Observable para ser inscrito e notificar a atualização de produtos na loja
  updateStoreProducts$ = this.updateStoreProducts.asObservable();
  constructor(private httpClient: HttpClient) {}
  // Método para obter o produto na loja pelo ID
  getProduct(id: number): Observable<FullProduct> {
    return this.httpClient
      .get<FullProduct>(this.url + '/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Método para obter os preços
  getStorePrices(): StorePriced[] {
    return this.storesPrices;
  }
  // Retirar o preço da loja
  clearStorePrices(): void {
    this.storesPrices = [];
    this.requisitionObject = {
      descricao: '',
      lojas: [],
    };
  }
// Método para salvar o objeto de requisição do produto
  saveRequisitionProductObj(productForm: FormGroup): RegisterProductObj | null {
    if (this.requisitionObject.lojas.length < 1) return null;
    if (productForm.value.descricao) {
      this.requisitionObject.descricao = productForm.value.descricao;
    }
    if (
      productForm.value?.custo &&
      !isNaN(+productForm.value.custo.replace(',', '.'))
    ) {
      this.requisitionObject.custo = +productForm.value.custo.replace(',', '.');
    }

    return this.requisitionObject;
  }
  // Método para salvar a imagem do produto
  saveImageProductObj(image: string): void {
    if (image) {
      this.requisitionObject.imagem = image;
    }
  }
  // Método para inserir o produto na loja
  insertStoreRequisitionObj(store: {
    loja: {
      id: number;
      descricao: string;
    };
    precoVenda: string;
  }): void {
    if (
      store.loja.id &&
      !isNaN(store.loja.id) &&
      store.precoVenda &&
      !isNaN(+store.precoVenda.replace(',', '.'))
    ) {
      this.requisitionObject.lojas = [
        ...this.requisitionObject.lojas,
        { id: store.loja.id, precoVenda: +store.precoVenda.replace(',', '.') },
      ];
      this.storesPrices = [...this.storesPrices, store];
    }
  }
  //  Método para atualizar o produto na loja
  updateStoreRequisitionObj(
    id: number,
    store: {
      loja: {
        id: number;
        descricao: string;
      };
      precoVenda: string;
    }
  ): void {
    this.requisitionObject.lojas = this.requisitionObject.lojas.map((s) => {
      if (s.id === store.loja.id) {
        return {
          id: store.loja.id,
          precoVenda: +store.precoVenda.replace(',', '.'),
        };
      } else {
        return s;
      }
    });
    
    this.storesPrices = this.storesPrices.map((s) => {
      if (s.loja.id === store.loja.id) {
        return {
          loja: { id: store.loja.id, descricao: store.loja.descricao },
          precoVenda: store.precoVenda,
        };
      } else {
        return s;
      }
    });
  }
  // Método para deletar o produto na loja
  deleteStoreProduct(id: number): void {
    const filter1 = this.requisitionObject.lojas.filter((e) => e.id !== id);
    const filter2 = this.storesPrices.filter((e) => e.loja.id !== id);

    if (!id) return;
    this.requisitionObject.lojas = [...filter1];
    this.storesPrices = [...filter2];
  }
  // Método para notificar updates de produtos na loja
  notifyUpdateStoreProducts(): void {
    this.updateStoreProducts.next();
  }
  // Método para lidar com erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage =
        `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
