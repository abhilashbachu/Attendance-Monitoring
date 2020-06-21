import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  usersAttendance: UserAttendance[];
  dataSource = new MatTableDataSource<UserAttendance>();
  displayedColumns: string[] = ['user_id', 'name', 'isPresent', 'createdDate'];
  // displayedColumns: string[] = ['User Id', 'User Name', 'Attendace Mark', 'Date'];
  gridPagination = [10, 20, 30, 40];
  gridPaginationSize = 10;
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.assignUserAttendance();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit() { this.dataSource.sort = this.sort; }

  assignUserAttendance() {
   this.apiService.getAttendance().subscribe((response: UserAttendance[]) => {
    if(response) {
      this.dataSource.data = this.usersAttendance = response;
    }
   });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export class UserAttendance {
  user_id: string;
  name: string;
  isPresent: boolean;
  createdDate: Date;
}
