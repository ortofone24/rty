import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Product } from '../../interfaces/product';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  // For the FormControl - Adding products
  insertForm: FormGroup;
  katNumber: FormControl;
  katPrice: FormControl;
  imageUrl: FormControl;
  platynaWeight: FormControl;
  palladWeight: FormControl;
  rodWeight: FormControl;
  katWeightPerKg: FormControl;

  // Updating the Product
  updateForm: FormGroup;
  _katNumber: FormControl;
  _katPrice: FormControl;
  _imageUrl: FormControl;
  _platynaWeight: FormControl;
  _palladWeight: FormControl;
  _rodWeight: FormControl;
  _katWeightPerKg: FormControl;
  _id: FormControl;

  // Add Modal
  @ViewChild('template') modal: TemplateRef<any>;

  // Update Modal
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;


  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  products$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;

  // Datables Properties

  constructor() { }

  ngOnInit() {
  }

}


