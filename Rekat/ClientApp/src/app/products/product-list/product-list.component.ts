import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Product } from '../../interfaces/product';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { UploadImageService } from '../../services/upload-image.service';
import { PierwiastkiPrice } from '../../interfaces/pierwiastki-price';
import { PierwiastkiPriceService } from '../../services/pierwiastki-price.service';
import { error } from 'util';
//import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [UploadImageService, PierwiastkiPriceService]
  
})
export class ProductListComponent implements OnInit, OnDestroy {

  imagePreview: string = "/images/iconsFolder.png";
  fileToUpload: File = null;
  

  // For the FormControl - Adding products
  insertForm: FormGroup;
  katNumber: FormControl;
  //katPrice: FormControl;
  //imageUrl: FormControl;
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

  // Updating pierwiastki price
  pierwiastkiForm: FormGroup;
  palladPrice: FormControl;
  rodPrice: FormControl;
  platynaPrice: FormControl;
  euroExchangeRate: FormControl;
  
  // Add Modal
  @ViewChild('template') modal: TemplateRef<any>;

  // Update Modal
  @ViewChild('editTemplate') editmodal: TemplateRef<any>;

  // Pierwiastki price Modal
  @ViewChild('templatePierwiastki') pierwiastkimodal: TemplateRef<any>;

  //Updating product price from euro change
  @ViewChild('updateProductPriceTemplate') updateProductPriceModal: TemplateRef<any>;

  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  products$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;

  pierwiastkiPrice$: Observable<PierwiastkiPrice[]>;
  pierwiastkiPrice: PierwiastkiPrice[] = [];

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
    private chRef: ChangeDetectorRef,
    private router: Router,
    private acct: AccountService,
    private imageService: UploadImageService,
    private pierwiastkiPriceService: PierwiastkiPriceService
  ) { }


  onAddProduct() {
    this.modalRef = this.modalService.show(this.modal);
  }

  onAddPierwiastkiPrice() {
    this.modalRef = this.modalService.show(this.pierwiastkimodal);
  }

  onUpdateProductPriceButton()
  {
    this.modalRef = this.modalService.show(this.updateProductPriceModal);
  }

  // Post file to the server
  onPostClick(Image)
  {
    console.log('odpalilem funkcje');
    this.imageService.postFile(this.fileToUpload).subscribe(
      data => {
        console.log('done');
      }
    )
  }

  // Method to update price when euro course changed
  onUpdateProductPrice() {
    console.log('odpalilem funkcje');

    this.productservice.updateProductPrice().subscribe(
      data => {
        console.log('done');
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();

        this.products$.subscribe(newlist => {
          this.products = newlist;
          this.modalRef.hide();
          this.rerender();
        });
        console.log("zaktualizowałeś ceny");
      }
      
    )
    
    this.modalRef.hide();
    this.rerender();
  }

  // Method to Add new Price of pierwiastki
  onSubmitPierwiastki() {
    let newPrice = this.pierwiastkiForm.value;

    this.pierwiastkiPriceService.insertPrice(newPrice).subscribe(
      result => {
        this.pierwiastkiPriceService.clearCache();
        this.pierwiastkiPrice$ = this.pierwiastkiPriceService.getPrice();

        this.pierwiastkiPrice$.subscribe(newlist => {
          this.pierwiastkiPrice = newlist;
          this.modalRef.hide();
          this.pierwiastkiForm.reset();
          this.rerender();
        });
        console.log("Dodałeś cenę");
      },
      error => console.log("Nie udało Ci się dodać")
    )
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
    let editProduct = this.updateForm.value;

    this.productservice.updateProduct(editProduct.id, editProduct).subscribe(
      result => {
        console.log('Produkt skorygowany');
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();

        this.products$.subscribe(updatedlist => {
          this.products = updatedlist;
          this.modalRef.hide();
          this.rerender();
        });

      },
      error => console.log('Nie udało Ci się skorygować')
    )
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
      'imageUrl': this._imageUrl.value
    });

    this.modalRef = this.modalService.show(this.editmodal);
  }

  // Method to delete product
  onDelete(product: Product): void {
    if (confirm("Czy napewno chcesz usunąć?")) {
      this.productservice.deleteProduct(product.katId).subscribe(result => {
        this.productservice.clearCache();
        this.products$ = this.productservice.getProducts();
        this.products$.subscribe(newlist => {
          this.products = newlist;
          this.rerender();
        })
      })
    }
  }

  // Method to select the product
  onSelect(product: Product): void {
    this.selectedProduct = product;
    this.router.navigateByUrl("/products/" + product.katId);
  }


  // Display preview image
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  } 

  ngOnInit() {
    this.dtOptions =
      {
        pagingType: 'full_numbers',
        pageLength: 10,
        autoWidth: true,
        order: [[0, 'des']],
      };

    // Products assigment
    this.products$ = this.productservice.getProducts();

    this.products$.subscribe(result => {
      this.products = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    //Pierwiastki price assigment
    this.pierwiastkiPrice$ = this.pierwiastkiPriceService.getPrice();

    this.pierwiastkiPrice$.subscribe(result => {
      this.pierwiastkiPrice = result;

      this.chRef.detectChanges();
      
    });

    this.acct.currentUserRole.subscribe(result =>
    {
      this.userRoleStatus = result;
    });

    // Modal Message
    this.modalMessage = "Wypełnij wszystkie pola";

    // Initializing add pierwiastkiPrice properties
    this.palladPrice = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.rodPrice = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.platynaPrice = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.euroExchangeRate = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);

    this.pierwiastkiForm = this.fb.group({
      'palladPrice': this.palladPrice,
      'rodPrice': this.rodPrice,
      'platynaPrice': this.platynaPrice,
      'euroExchangeRate': this.euroExchangeRate
    });

    // Initializing Add product properties
    let validateImageUrl: string = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.katNumber = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]*$")]);
    this.platynaWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.palladWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.rodWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this.katWeigthPerKg = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    //this.imageUrl = new FormControl('', [Validators.required, Validators.pattern(validateImageUrl)]);

    this.insertForm = this.fb.group(
      {
        'katNumber': this.katNumber,
        'platynaWeight': this.platynaWeight,
        'palladWeight': this.palladWeight,
        'rodWeight': this.rodWeight,
        'katWeigthPerKg': this.katWeigthPerKg,
        //'imageUrl': this.imageUrl
      });

    // Initializing Update product properties
    this._katNumber = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[a-zA-Z0-9]*$")]);
    this._platynaWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._palladWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._rodWeight = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._katWeigthPerKg = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9.]*$")]);
    this._imageUrl = new FormControl('', [Validators.required, Validators.pattern(validateImageUrl)]);
    this._id = new FormControl();

    this.updateForm = this.fb.group(
      {
        'id': this._id,
        'katNumber': this._katNumber,
        'platynaWeight': this._platynaWeight,
        'palladWeight': this._palladWeight,
        'rodWeight': this._rodWeight,
        'katWeigthPerKg': this._katWeigthPerKg,
        'imageUrl': this._imageUrl,
      });
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe
    this.dtTrigger.unsubscribe();
  }

}


