import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/produtos/produtos.service';
import { Product } from '../../models/product';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css'],
})
export class ProdutoComponent implements OnInit {
  searchForm: FormGroup;
  products: Product[] = [];
  product = {} as Product;

  constructor(
    private router: Router,
    private ProductsService: ProductsService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      id: [''],
      descricao: [''],
      custo: [''],
      precoVenda: [''],
    });
  }
  ngOnInit(): void {
    this.ProductsService.setProduct(this.product);
    this.ProductsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  redirectToProductRegister(): void {
    this.router.navigate(['/', 'produto', 'cadastro']);
  }

  getProducts(): void {
    this.ProductsService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }
  // Método para obter produtos pelo search
  getProductsBy(): void {
    if (
      !this.searchForm.value.id &&
      !this.searchForm.value.descricao &&
      !this.searchForm.value.custo &&
      !this.searchForm.value.precoVenda
    )
      return this.getProducts();
    this.ProductsService.getProductBySearch(this.searchForm.value).subscribe(
      (products: Product[]) => {
        this.products = products;
      }
    );
  }
}
