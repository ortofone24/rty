import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private acct: AccountService,
    private modalService: BsModalService
    ) { }

  
  // Properties
  insertForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  //email: FormControl;
  modalRef: BsModalRef;
  errorList: string[];
  modalMessage: string;

  @ViewChild('template') modal: TemplateRef<any>

  onSubmit() {

    let userDetails = this.insertForm.value;

    this.acct.register(userDetails.username, userDetails.password, userDetails.email).subscribe(result => {
      this.router.navigate(['/login'])
    },
      error => {

        this.errorList = []

        for (var i = 0; i < error.error.value.length; i++) {
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }

        console.log(error);
        this.modalMessage = "Rejestracja nie powiodła się";
        this.modalRef = this.modalService.show(this.modal)
      }
    );
  }


  // Custom Validator
  MustMatch(passwordControl: AbstractControl): ValidatorFn {
    return (cpasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      // return null if controls haven't initialiased yet
      if (!passwordControl && !cpasswordControl) {
        return null;
      }
      // return null if another validator has already found an error on the matchingControl
      if (cpasswordControl.hasError && !passwordControl.hasError) {
        return null;
      }
      // set error on matchingControl if validation fails
      if (passwordControl.value !== cpasswordControl.value) {
        return { 'mustMatch': true }
      }
      else {
        return null;
      }

    }
  }


  ngOnInit() {

    this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.cpassword = new FormControl('', [Validators.required, this.MustMatch(this.password)]);
    //this.email = new FormControl('', [Validators.required, Validators.email]);
    this.errorList = [];

    this.insertForm = this.fb.group(
      {
        'username': this.username,
        'password': this.password,
        'cpassword': this.cpassword,
        //'email': this.email,
      });
  }

}
