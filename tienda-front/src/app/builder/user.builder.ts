// user.builder.ts
export interface User {
    name: string;
    surname: string;
    email: string;
    password: string;
    birthdate: string;
    dispatchAddress: string;
    rol: string;
}

export class UserBuilder {
    private name: string = '';
    private surname: string = '';
    private email: string = '';
    private password: string = '';
    private birthdate: string = '';
    private dispatchAddress: string = '';
    private rol: string = '';

    public setName(name: string): UserBuilder {
        this.name = name;
        return this;
    }

    public setSurname(surname: string): UserBuilder {
        this.surname = surname;
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

    public setBirthdate(birthdate: string): UserBuilder {
        this.birthdate = birthdate;
        return this;
    }

    public setDispatchAddress(dispatchAddress: string): UserBuilder {
        this.dispatchAddress = dispatchAddress;
        return this;
    }

    public setRol(rol: string): UserBuilder {
        this.rol = rol;
        return this;
    }

    public build(): User {
        return {
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
            birthdate: this.birthdate,
            dispatchAddress: this.dispatchAddress,
            rol: this.rol,
        };
    }
}