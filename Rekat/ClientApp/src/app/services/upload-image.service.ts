import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private http: HttpClient) { }

  postFile(fileToUpload: File) {
    //const endpoint = 'https://localhost:44377/api/product/uploadimage';
    const endpoint = 'http://www.rekat.pl/api/product/uploadimage';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData);
  }

}
