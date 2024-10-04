import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/produtos/produtos.service';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private produtoService: ProductsService) {}

  ngOnInit(): void {
    this.produtoService.getProducts().subscribe((data: Produto[]) => {
      this.produtos = data;
    });
  }
}
