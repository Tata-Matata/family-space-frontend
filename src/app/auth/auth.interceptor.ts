import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError, from } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();

  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401 && auth.isAuthenticated()) {
        return from(auth.refresh()).pipe(
          switchMap(() =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${auth.getAccessToken()}`,
                },
              })
            )
          ),
          catchError(() => {
            auth.logout();
            return throwError(() => err);
          })
        );
      }
      return throwError(() => err);
    })
  );
};

