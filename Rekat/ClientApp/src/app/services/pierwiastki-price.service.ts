import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, flatMap, first, retry } from 'rxjs/operators';
import { PierwiastkiPrice } from '../interfaces/pierwiastki-price';

@Injectable({
  providedIn: 'root'
})
export class PierwiastkiPriceService {

  constructor(private http: HttpClient) { }

  private baseUrl: string = "/api/PierwiastkiPrice/GetPrice";

  private productUrl: string = "/api/PierwiastkiPrice/AddPrice";

  private pierwiastkiPrice$: Observable<PierwiastkiPrice[]>

  getPrice(): Observable<PierwiastkiPrice[]>
  {
    // if cache not exists
    if (!this.pierwiastkiPrice$)
    {
      this.pierwiastkiPrice$ = this.http.get<PierwiastkiPrice[]>(this.baseUrl).pipe(shareReplay());
    }

    // if products cache exists return it
    return this.pierwiastkiPrice$
  }

  //remember to id = 1 in this case
  getPriceById(id: number): Observable<PierwiastkiPrice>
  {
    return this.getPrice().pipe(flatMap(result => result), first(price => price.priceId == id))
  }

  insertPrice(newPrice: PierwiastkiPrice): Observable<PierwiastkiPrice>
  {
    return this.http.post<PierwiastkiPrice>(this.productUrl, newPrice);
  }

  // Clear Cache
  clearCache()
  {
    this.pierwiastkiPrice$ = null;
  }

}
