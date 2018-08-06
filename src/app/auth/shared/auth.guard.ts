import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { SplitService } from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private logService: LoggerService,
    private splitS: SplitService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ( (resolve, reject) => {
      this.logService.user.subscribe( user => {
        if (user) {
          console.log(user);
          this.splitS.updateSplitShow(true);
          resolve(true);
        } else {
          console.log('User is not logged in');
          this.splitS.updateSplitShow(false);
          this.router.navigate(['/login']);
          resolve(false);
        }
      });
    });
  }
}
