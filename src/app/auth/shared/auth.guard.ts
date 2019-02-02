import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggerService } from './logger.service';
import { SplitService, StaticDataService } from '../../shared';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private logService: LoggerService,
    private splitS: SplitService,
    private staticData: StaticDataService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise ( (resolve, reject) => {
      this.logService.user.subscribe( user => {
        if (user) {
          // console.log(user);
          this.staticData.getStaticData()
          .then( () => {
            this.logService.current = user;
            this.logService.users = this.staticData.data.auth;
            this.splitS.updateSplitShow(true);
            resolve(true);
          })
          .catch( error => console.log(error));
        } else {
          console.log('User is not logged in');
          this.splitS.updateSplitShow(false);
          this.router.navigate(['/login']);
          this.logService.current = undefined;
          resolve(false);
        }
      });
    });
  }
}
