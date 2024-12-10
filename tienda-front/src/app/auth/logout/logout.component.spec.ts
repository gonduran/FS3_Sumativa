import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutComponent } from './logout.component';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  let mockNavigationService: jasmine.SpyObj<NavigationService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  beforeEach(async () => {
    mockNavigationService = jasmine.createSpyObj('NavigationService', ['navigateWithDelay']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['logout']);
    mockActivatedRoute = {
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        LogoutComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: 'PLATFORM_ID', useValue: 'browser' }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call logout on ngAfterViewInit', () => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngAfterViewInit();
    expect(mockUsersService.logout).toHaveBeenCalled();
  });

  it('should add click event listeners to links and handle navigation', () => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const mockLink = document.createElement('a');
    mockLink.href = '/test-route';
    document.body.appendChild(mockLink);

    component.ngAfterViewInit();
    mockLink.click();

    expect(mockNavigationService.navigateWithDelay).toHaveBeenCalledWith('/test-route');

    document.body.removeChild(mockLink);
  });

  it('should not navigate if href is null', () => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const mockLink = document.createElement('a');
    document.body.appendChild(mockLink);

    component.ngAfterViewInit();
    mockLink.click();

    expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();

    document.body.removeChild(mockLink);
  });

  it('should handle platform not being browser', async () => {
    // Create new TestBed configuration for server platform
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [
        LogoutComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: 'PLATFORM_ID', useValue: 'server' }
      ]
    }).compileComponents();

    // Reset spies
    mockNavigationService.navigateWithDelay.calls.reset();
    mockUsersService.logout.calls.reset();

    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;

    // Add link before detectChanges
    const mockLink = document.createElement('a');
    mockLink.href = '/test-route';
    document.body.appendChild(mockLink);

    // Call lifecycle hooks
    fixture.detectChanges();
    component.ngAfterViewInit();

    // Verify no navigation occurred
    expect(mockNavigationService.navigateWithDelay).not.toHaveBeenCalled();
    expect(mockUsersService.logout).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(mockLink);
  });
});