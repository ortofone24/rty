import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../interfaces/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from '../../services/product.service';
//import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {

  // For the FormControl - Adding products
  insertForm: FormGroup;
  katNumber: FormControl;
  //katPrice: FormControl;
  imageUrl: FormControl;
  platynaWeight: FormControl;
  palladWeight: FormControl;
  rodWeight: FormControl;
  katWeigthPerKg: FormControl;

  // Updating the Product
  updateForm: FormGroup;
  _katNumber: FormControl;
  //_katPrice: FormControl;
  _imageUrl: FormControl;
  _platynaWeight: FormControl;
  _palladWeight: FormControl;
  _rodWeight: FormControl;
  _katWeigthPerKg: FormControl;
  _id: FormControl;

  // Add Modala
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
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  //decodeToken()
  //{
  //  var token = localStorage.getItem('jwt');

  //  var decoded = jwt_decode(token);

  //  console.log(decoded);
  //}

  constructor(private productservice: ProductService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private chRef: ChangeDetectorRef) { }

  onAddProduct() {
    this.modalRef = this.modalService.show(this.modal);
  }

  // Method to Add new Product
  onSubmit() {
    let newProduct = this.insertForm.value;

    this.productservice.insertProduct(newProduct).subscribe(
      result => {
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();

        this.products$.subscribe(newlist => {
          this.products = newlist;
          this.modalRef.hide();
          this.insertForm.reset();
          this.rerender();

        });
        console.log("Dodałes katalizator");

      },
      error => console.log('Nie udało Ci się dodać katalizatora')
    )
  }

  // We will use this method to destroy old table and re-render new table
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


  // Update on Existing Product
  onUpdate() {

  }

  // Load the update Modal
  onUpdateModal(productEdit: Product): void {
    this._id.setValue(productEdit.katId);
    this._katNumber.setValue(productEdit.katNumber);
    this._platynaWeight.setValue(productEdit.platynaWeight);
    this._palladWeight.setValue(productEdit.palladWeight);
    this._rodWeight.setValue(productEdit.rodWeight);
    this._katWeigthPerKg.setValue(productEdit.katWeigthPerKg);
    this._imageUrl.setValue(productEdit.imageUrl);

    this.updateForm.setValue({
      'id': this._id.value,
      'katNumber': this._katNumber.value,
      'platynaWeight': this._platynaWeight.value,
      'palladWeight': this._palladWeight.value,
      'rodWeight': this._rodWeight.value,
      'katWeigthPerKg': this._katWeigthPerKg.value,
      'imageUrl': this.imageUrl.value
    });

    this.modalRef = this.modalService.show(this.editmodal);

  }

  ngOnInit() {
    this.dtOptions =
      {
        pagingType: 'full_numbers',
        pageLength: 10,
        autoWidth: true,
        order: [[0, 'des']],
      };
    this.products$ = this.productservice.getProducts();

    this.products$.subscribe(result => {
      this.products = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    // Modal Message
    this.modalMessage = "Wypełnij wszystkie pola";

    // Initializing Add product properties
    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.katNumber = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]*$")]);
    this.platynaWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.palladWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.rodWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.katWeigthPerKg = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);

    this.insertForm = this.fb.group(
      {
        'katNumber': this.katNumber,
        'platynaWeight': this.platynaWeight,
        'palladWeight': this.palladWeight,
        'rodWeight': this.rodWeight,
        'katWeigthPerKg': this.katWeigthPerKg,
        'imageUrl': this.imageUrl
      });

    // Initializing Update product properties
    this._katNumber = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]*$")]);
    this._platynaWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._palladWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._rodWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._katWeigthPerKg = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._imageUrl = new FormControl('', [Validators.pattern(validateImageUrl)]);
    this._id = new FormControl();

    this.updateForm = this.fb.group(
      {
        'katNumber': this._katNumber,
        'platynaWeight': this._platynaWeight,
        'palladWeight': this._palladWeight,
        'rodWeight': this._rodWeight,
        'katWeightPerKg': this._katWeigthPerKg,
        'imageUrl': this._imageUrl,
        'id': this._id
      });

  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}


