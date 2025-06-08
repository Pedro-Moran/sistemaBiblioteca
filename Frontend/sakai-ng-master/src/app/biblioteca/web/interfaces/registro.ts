
export class Registro {
    id: number;
    nombreUsuario:String;
    apellidoMaterno:String;
    apellidoPaterno:String;
    fechaNacimiento:String;
    email:String;
    password: string;

    constructor(init?: Partial<Registro>) {
        this.id = 0;
        this.nombreUsuario = '';
        this.apellidoMaterno = '';
        this.apellidoPaterno = '';
        this.fechaNacimiento = '';
        this.email = '';
        this.password = '';

        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
