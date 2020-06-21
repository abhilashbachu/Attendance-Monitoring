import { Constants } from '../../Utility/constants';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  userImage: any;
  uploadedImageName: string;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private dialog: MatDialog)
  { }

  ngOnInit() {
    this.uploadedImageName = Constants.IMAGE_BUTTON_TEXT;
    this.registerEmptyForm();
  }

  registerEmptyForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      id: ['', Validators.required],
    });
  }

  imageChanges(event: any) {
    this.userImage = event.target.files[0];
    this.uploadedImageName = this.userImage.name;
  }

  uploadFile() {
    document.getElementById('uploadFile').click();
  }

  registerUSer() {
    const formData = new FormData();
    formData.append('file', this.userImage);
    formData.append('name', this.registerForm.value.name);
    formData.append('userId', this.registerForm.value.id);
    this.apiService.registerNewUser(formData).subscribe((response: any) => {
     this.openDiaglog(response.success)
     this.registerEmptyForm();
     this.uploadedImageName = Constants.IMAGE_BUTTON_TEXT;
     this.uploadFile = null;
    })
  }

  openDiaglog(response: boolean) {
    const infoDialog = this.dialog.open(InfoDialogComponent, 
      {
        width: '500px',
        data: response
      })
  }

}
