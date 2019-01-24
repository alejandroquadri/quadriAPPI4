import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoggerService } from '../../auth/shared/logger.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public profileForm: FormGroup;
  current: any;
  formChanges$: any;
  avatar: any;

  constructor(
    public fb: FormBuilder,
    private auth: LoggerService
  ) {
   }

  ngOnInit() {
    this.current = this.auth.current;
    console.log(this.current);
    this.avatar = this.current.photoURL;
    this.buildForm();
  }

  buildForm() {
    this.profileForm = this.fb.group({
      name: [ this.current.displayName || '']
    });
    this.formChanges();
  }

  formChanges() {
    this.formChanges$ = this.profileForm.valueChanges
    .pipe(debounceTime(1000))
    .subscribe( data => {
      console.log(data);
      this.updateProfile();
    });
  }

  updateProfile() {
    this.auth.updateProfile(this.profileForm.value.name, this.avatar);
  }

}
