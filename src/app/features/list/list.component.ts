import { Product } from './../../shared/interfaces/product.interface';
import { ProductsService } from './../../shared/services/products.service';
// import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { ConfirmationDialogService } from '../../shared/services/confirmation-dialog.service';
import { NoItemsComponent } from './components/no-items/no-items.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule, NoItemsComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  products = signal<Product[]>(
    inject(ActivatedRoute).snapshot.data['products']
  );

  productsService = inject(ProductsService);
  router = inject(Router);
  confirmationDialogService = inject(ConfirmationDialogService);

  // ngOnInit() {
  //   this.productsService.getAll().subscribe((products) => {
  //     this.products = products;
  //   });
  // }

  onEdit(product: Product) {
    this.router.navigate(['/edit-product', product.id]);
  }

  onDelete(product: Product) {
    this.confirmationDialogService.openDialog()
    .pipe(filter((answer) => answer === true))
    .subscribe(() => {
        this.productsService.delete(product.id).subscribe((products) => {
          this.productsService.getAll().subscribe((products) => this.products.set(products));
        })
      });
  }
}
