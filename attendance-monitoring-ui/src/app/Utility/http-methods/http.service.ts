import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  postPDF(url: any, data?: any) {
    const httpOptions = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders(),
    };
    return this.http.post(url, data, httpOptions);
  }

  post(url: any, data: any) {
    const httpOptions = {
      headers: new HttpHeaders(),
    }
    return this.http.post(url, data, httpOptions);
  }

  get(url: string) {
    return this.http.get(url);
  }

}
