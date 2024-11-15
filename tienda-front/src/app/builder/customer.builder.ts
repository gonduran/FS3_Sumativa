// customer.builder.ts
export interface Customer {
    clientName: string;
    clientSurname: string;
    email: string;
    password: string;
    birthdate: string;
    dispatchAddress: string;
    rol: string;
}

export class CustomerBuilder {
    private clientName: string = '';
    private clientSurname: string = '';
    private email: string = '';
    private password: string = '';
    private birthdate: string = '';
    private dispatchAddress: string = '';
    private rol: string = '';

    public setClientName(clientName: string): CustomerBuilder {
        this.clientName = clientName;
        return this;
    }

    public setClientSurname(clientSurname: string): CustomerBuilder {
        this.clientSurname = clientSurname;
        return this;
    }

    public setEmail(email: string): CustomerBuilder {
        this.email = email;
        return this;
    }

    public setPassword(password: string): CustomerBuilder {
        this.password = password;
        return this;
    }

    public setBirthdate(birthdate: string): CustomerBuilder {
        this.birthdate = birthdate;
        return this;
    }

    public setDispatchAddress(dispatchAddress: string): CustomerBuilder {
        this.dispatchAddress = dispatchAddress;
        return this;
    }

    public setRol(rol: string): CustomerBuilder {
        this.rol = rol;
        return this;
    }

    public build(): Customer {
        return {
            clientName: this.clientName,
            clientSurname: this.clientSurname,
            email: this.email,
            password: this.password,
            birthdate: this.birthdate,
            dispatchAddress: this.dispatchAddress,
            rol: this.rol,
        };
    }
}