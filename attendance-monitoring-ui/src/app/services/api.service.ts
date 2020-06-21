import { environment } from './../../environments/environment';
import { HttpService } from './../Utility/http-methods/http.service';
import { Injectable } from '@angular/core';
import { ApiConstants } from '../Utility/apiconstants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = environment.baseUrl;
  constructor(private httpService: HttpService) { }

  registerNewUser(data: any) {
    const url = this.baseUrl +ApiConstants.REGISTER_USER;
    return this.httpService.post(url, data);
  }

  getAttendance() {
    const url = this.baseUrl + ApiConstants.GET_ATTENDANCE;
    return this.httpService.get(url);
  }

  getAllUsers() {
    const url = this.baseUrl + ApiConstants.GET_ALL_USERS;
    return this.httpService.get(url);
  }
}
