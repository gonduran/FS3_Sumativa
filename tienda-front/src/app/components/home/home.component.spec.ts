import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importar HttpClientTestingModule
import { HomeComponent } from './home.component';
import { UsersService } from '../../services/users.service'; // Si HomeComponent utiliza este servicio
import { NavigationService } from '../../services/navigation.service'; // Si HomeComponent utiliza este servicio
import { RouterTestingModule } from '@angular/router/testing'; // Si hay enrutamiento

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule, // Importar el módulo de pruebas para HttpClient
        RouterTestingModule, // Si hay navegación
      ],
      providers: [
        UsersService, // Si es utilizado por el componente
        NavigationService, // Si es utilizado por el componente
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});