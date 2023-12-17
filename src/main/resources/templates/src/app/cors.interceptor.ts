import {Injectable} from '@angular/core';
import {HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        const modifiedRequest = request.clone({
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
                // Other CORS headers can be added here if needed
            })
        });

        return next.handle(modifiedRequest);
    }
}
