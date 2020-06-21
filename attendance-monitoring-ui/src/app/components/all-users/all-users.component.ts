import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  allUsers: AllUsers[];
  dataSource = new MatTableDataSource<AllUsers>();
  displayedColumns: string[] = ['user_id', 'name'];
  gridPagination = [10, 20, 30, 40];
  gridPaginationSize = 10;
  constructor( private apiService: ApiService ) { }

  ngOnInit() {
    this.getAllUsers();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() { this.dataSource.sort = this.sort; }

  getAllUsers() {
    this.apiService.getAllUsers().subscribe((response: AllUsers[]) => {
      if(response) {
        this.dataSource.data = this.allUsers = response;

      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

export class AllUsers {
  user_id: string;
  name: string;
}
