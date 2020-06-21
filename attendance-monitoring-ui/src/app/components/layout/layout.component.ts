import { Constants } from '../../Utility/constants';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  isExpanded = true;
  selectedItem = Constants.REGISTER_STUDENTS;
  constructor() { }

  ngOnInit() {
  }

  showContent(selected: string) {
    this.selectedItem = selected;
  }
}
