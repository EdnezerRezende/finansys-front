import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { map, catchError, tap, switchMap, finalize } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import toastr from 'toastr';
import { FieldMessage } from 'src/app/shared/models/field-message';

@Injectable()
  export class HttpConfigInterceptor implements HttpInterceptor {
    count = 0;

    constructor(
      public spinner: NgxSpinnerService,
      private router: Router
      ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      this.spinner.show();

      this.count++;

      return next.handle(request)
        .pipe( tap (
          event => console.log(event),
          error => console.log(error)
        )
        , finalize(() => {
          this.count--;
          if ( this.count === 0 ) { this.spinner.hide(); }
        })
        ).pipe( catchError(x => this.handleAuthError(x)));
    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
      const errorObj = err;
      switch (errorObj.status) {
        case 400:
          this.handle400(errorObj);
          break;

        case 401:
          this.handle401();
          break;

        case 403:
          this.handle403();
          break;

        case 404:
          this.handle404(errorObj);
          break;

        case 422:
          this.handle422(errorObj);
          break;

        case 500:
          this.handle500(errorObj);
          break;

        default:
          this.handleDefaultEror(errorObj);
      }
      return throwError(err);
  }

  handle400(errorObj){
    toastr.error(errorObj.error);
  }
  handle403() {
    // this.storage.setLocalUser(null);
  }
  handle404(errorObj) {
    if ( errorObj.message.indexOf() !== -1 ) {
      toastr.error(`Serviço não encontrado`);
    } else {
      toastr.error(`Serviço não encontrado`);
    }
  }
  handle401() {
    toastr.error(`Falha de Autenticação, tente novamente!`);
  }

  handle422(errorObj) {
    toastr.error(`'Falha na Comunicação com o Servidor, por favor, tente mais tarde!`);
  }

  handle500(errorObj) {
    if (errorObj.message.indexOf('AuthenticationFailedException') !== -1) {
      toastr.error(`O servidor de envio de E-mail está inoperante no momento.`);
    } else {
      toastr.error(errorObj.message);
    }
  }

  handleDefaultEror(errorObj) {
    toastr.error(errorObj.message);
  }

  private listErrors(messages: FieldMessage[]): string {
    let s = '';
    for ( const i of messages ) {
      s = s +
        '<p><strong>' +
        i.fieldName +
        '</strong>: ' +
        i.message +
        '</p>';
    }

    return s;
  }

}
