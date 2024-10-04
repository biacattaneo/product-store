import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../interfaces/product.interface';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {
  public productsService = inject(ProductsService);
  public matSnackBar = inject(MatSnackBar);
  public router = inject(Router);

  // product: Product = inject(ActivatedRoute).snapshot.data['product']
  public product = input<Product | null>(null);

  public form!: FormGroup;

  @Output() submit = new EventEmitter<Product>();

  public ngOnInit(): void {
    this.form = new FormGroup({
    title: new FormControl<string>(this.product()?.title ?? '',
    {
      nonNullable: true,
      validators: Validators.required
    })
  });
}

  public onSubmit() {
    const product = this.form.value as Product;
    this.submit.emit(product);
  }
}
