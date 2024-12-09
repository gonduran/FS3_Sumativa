import { TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { PLATFORM_ID } from '@angular/core';
import * as common from '@angular/common';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  const mockPlatformId = 'browser';

  beforeEach(() => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['logout']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        LogoutComponent,
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: PLATFORM_ID, useValue: mockPlatformId },
      ],
    });

    component = TestBed.inject(LogoutComponent);

    // Mock `isPlatformBrowser` para pruebas
    spyOn(common, 'isPlatformBrowser').and.returnValue(true);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout on UsersService when ngAfterViewInit is executed', () => {
    component.ngAfterViewInit();
    expect(mockUsersService.logout).toHaveBeenCalled();
  });

  it('should add click listeners to links when platform is browser', () => {
    const link1 = document.createElement('a');
    link1.setAttribute('href', '/home');

    const link2 = document.createElement('a');
    link2.setAttribute('href', '/profile');

    document.body.appendChild(link1);
    document.body.appendChild(link2);

    component.ngAfterViewInit();

    link1.click();
    expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/home');

    link2.click();
    expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/profile');

    document.body.removeChild(link1);
    document.body.removeChild(link2);
  });

  it('should not add click listeners to links when platform is not browser', () => {
    spyOn(common, 'isPlatformBrowser').and.returnValue(false);

    const link = document.createElement('a');
    link.setAttribute('href', '/home');
    document.body.appendChild(link);

    component.ngAfterViewInit();

    link.click();
    expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();

    document.body.removeChild(link);
  });
});