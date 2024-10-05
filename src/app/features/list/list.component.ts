import { ProductsService } from './../../shared/services/products.service';
// import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Product } from '../../shared/interfaces/product.interface';
import { CardComponent } from './components/card/card.component';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <h2 mat-dialog-title>Delete file</h2>
<mat-dialog-content>
  Would you like to delete?
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button (click)="onNo()">No</button>
  <button mat-raised-button color="accent" (click)="onYes()" cdkFocusInitial>yes</button>
</mat-dialog-actions>
`,
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
// export class ConfirmationDialogComponent {
//   readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
// }
export class ConfirmationDialogComponent {
  matDialogRef = inject(MatDialogRef);

  onNo() {
    this.matDialogRef.close(false);
  }
  onYes() {
    this.matDialogRef.close(true);
  }

}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  products: Product[] = [];

  productsService = inject(ProductsService);
  router = inject(Router);

  matDialog = inject(MatDialog);

  ngOnInit() {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
    });
  }

  onEdit(product: Product) {
    this.router.navigate(['/edit-product', product.id]);
  }

  onDelete(product: Product) {
    this.matDialog.open(ConfirmationDialogComponent)
    .afterClosed()
    .pipe(
      filter((answer) => answer === true),
    )
    .subscribe(() => {
        this.productsService.delete(product.id).subscribe((products) => {
          this.ngOnInit();
        })
    });
  }
}
