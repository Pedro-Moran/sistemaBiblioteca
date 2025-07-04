
export class Registro {
    tipoDocumento: string;
    numDocumento: string;
    id: number;
    nombreUsuario:String;
    apellidoMaterno:String;
    apellidoPaterno:String;
    fechaNacimiento:String;
    email:String;
    password: string;
    ADDRESS?: string;
    AGE?: number;
    CAMPUS?: string;
    CELL?: string;
    CITY?: string;
    COUNTRY?: string;
    COUNTY?: string;
    EMAIL_INST?: string;
    EMPLID?: string;
    FEC_NAC?: string;
    NAME?: string;
    NATIONAL_ID?: string;
    NATIONAL_ID_TYPE?: string;
    PHONE?: string;
    PROGRAM?: string;
    SEX?: string;
    STATE?: string;

    constructor(init?: Partial<Registro>) {
        this.tipoDocumento = '';
        this.numDocumento = '';
        this.id = 0;
        this.nombreUsuario = '';
        this.apellidoMaterno = '';
        this.apellidoPaterno = '';
        this.fechaNacimiento = '';
        this.email = '';
        this.password = '';
        this.ADDRESS = '';
        this.AGE = 0;
        this.CAMPUS = '';
        this.CELL = '';
        this.CITY = '';
        this.COUNTRY = '';
        this.COUNTY = '';
        this.EMAIL_INST = '';
        this.EMPLID = '';
        this.FEC_NAC = '';
        this.NAME = '';
        this.NATIONAL_ID = '';
        this.NATIONAL_ID_TYPE = '';
        this.PHONE = '';
        this.PROGRAM = '';
        this.SEX = '';
        this.STATE = '';

        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
