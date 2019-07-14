import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { AccountService } from './account.service';
import { Stock } from './stocks.model';
import { ConfigService } from './config.service';


@Injectable()
export class StocksInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request = req.clone();
    request.headers.append('Accept', 'application/json');
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.url === ConfigService.get('api')) {

          const stocks = event.body as Array<Stock>;
         // let symbols = this.accountService.stocks.map(stock => stock.symbol);
          stocks.forEach(stock => {
            this.accountService.stocks.map(item => {
              if (stock.symbol === item.symbol) {
                item.price = stock.price;
                item.change = ((stock.price * 100) - (item.cost * 100)) / 100;
              }
            });
          });
          this.accountService.calculateValue();
          return event;
        }
      }));
  }
}
