import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'getUserRole', 'logout']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn and userRole on init', () => {
    authServiceSpy.isLoggedIn.and.returnValue(of(true));
    authServiceSpy.getUserRole.and.returnValue(of(1));

    component.ngOnInit();

    expect(component.isLoggedIn).toBe(true);
    expect(component.userRole).toBe(1);
  });

  it('should call authService.logout on logout', () => {
    component.onLogout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});