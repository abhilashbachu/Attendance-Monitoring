import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
    providedIn: 'root'
})

export class HeaderInterceptor implements HttpInterceptor {

    spinnerCount = 0;

    constructor(private spinner: NgxSpinnerService) { }

    // show or hide spinner for api calls
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show();
        this.spinnerCount++;
        if (!req) {
            return;
        }
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.spinnerCount--;
                    if (this.spinnerCount <= 0) {
                        this.spinner.hide();
                    }
                    return of(event);
                }
            }),
            catchError((error) => {
                this.spinnerCount = 0;
                this.spinner.hide();
                return throwError(error);
            })
        );
    }

}
