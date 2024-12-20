export interface Rol {
    id: number;
    nombre: string;
}

export interface User {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    fechaNacimiento: string;
    direccion: string;
    roles: Rol[];
}

export class UserBuilder {
    private id: number = 0;
    private nombre: string = '';
    private apellido: string = '';
    private email: string = '';
    private password: string = '';
    private fechaNacimiento: string = '';
    private direccion: string = '';
    private roles: Rol[] = [];

    public setId(id: number): UserBuilder {
        this.id = id;
        return this;
    }

    public setNombre(nombre: string): UserBuilder {
        this.nombre = nombre;
        return this;
    }

    public setApellido(apellido: string): UserBuilder {
        this.apellido = apellido;
        return this;
    }

    public setEmail(email: string): UserBuilder {
        this.email = email;
        return this;
    }

    public setPassword(password: string): UserBuilder {
        this.password = password;
        return this;
    }

    public setFechaNacimiento(fechaNacimiento: string): UserBuilder {
        this.fechaNacimiento = fechaNacimiento;
        return this;
    }

    public setDireccion(direccion: string): UserBuilder {
        this.direccion = direccion;
        return this;
    }

    public setRoles(roles: Rol[]): UserBuilder {
        this.roles = roles;
        return this;
    }

    public build(): User {
        return {
            id: this.id,
            nombre: this.nombre,
            apellido: this.apellido,
            email: this.email,
            password: this.password,
            fechaNacimiento: this.fechaNacimiento,
            direccion: this.direccion,
            roles: this.roles,
        };
    }
}