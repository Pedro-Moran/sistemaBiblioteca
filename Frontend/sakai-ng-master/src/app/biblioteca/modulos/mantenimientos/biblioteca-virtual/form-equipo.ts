import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { InputValidation } from '../../../input-validation';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { Equipo } from '../../../interfaces/biblioteca-virtual/equipo';
import { Estado } from '../../../interfaces/biblioteca-virtual/estado';
import { BibliotecaVirtualService } from '../../../services/biblioteca-virtual.service';
import { Sede } from '../../../interfaces/biblioteca-virtual/sede';
@Component({
    selector: 'app-form-equipo',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '60vw'}" header="Datos de equipo" [modal]="true" [closable]="true"
                  styleClass="p-fluid">
                  <ng-template pTemplate="content">
                    <form [formGroup]="form">

                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">

                        <div class="flex flex-col gap-2 w-full">
                          <label for="estado">Estado</label>
                          <div class="flex items-center gap-x-2">
                            <p-select appendTo="body" id="state" formControlName="estado" [options]="estadoLista"
                              optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>

                          </div>

                          <app-input-validation [form]="form" modelo="estado" ver="Estado"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="nombreEquipo">Nombre de equipo</label>
                          <input pInputText id="nombreEquipo" type="text" formControlName="nombreEquipo" />
                          <app-input-validation [form]="form" modelo="nombreEquipo" ver="Nombre Equipo"></app-input-validation>
                        </div>
                      </div>
                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                          <label for="numeroEquipo">N&uacute;mero de equipo</label>
                          <input pInputText id="numeroEquipo" type="text" formControlName="numeroEquipo" />
                          <app-input-validation [form]="form" modelo="numeroEquipo" ver="Numero Equipo"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                          <label for="ip">Direccion IP</label>
                          <input pInputText id="ip" type="text" formControlName="ip" />
                          <app-input-validation [form]="form" modelo="ip" ver="IP"></app-input-validation>
                        </div>
                        <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                          <div class="flex flex-col gap-2 w-full">
                            <label for="numeroEquipo">Número de equipo</label>
                            <input pInputText id="numeroEquipo" type="text" formControlName="numeroEquipo" />
                            <app-input-validation [form]="form" modelo="numeroEquipo" ver="Numero Equipo">
                            </app-input-validation>
                          </div>
                          <div class="flex flex-col gap-2 w-full">
                            <label for="ip">Dirección IP</label>
                            <input pInputText id="ip" type="text" formControlName="ip" />
                            <app-input-validation [form]="form" modelo="ip" ver="IP">
                            </app-input-validation>
                          </div>
                        </div>
                      </div>
                      <!-- 3. Nueva fila para Hora Inicio / Hora Fin / Máximo de Horas -->
                      <div class="grid grid-cols-3 gap-4 mt-6">
                        <!-- Hora Inicio -->
                        <div class="flex flex-col gap-2">
                          <label for="horaInicio">Hora Inicio</label>
                          <p-calendar id="horaInicio" formControlName="horaInicio" timeOnly="true" hourFormat="24" appendTo="body"
                            styleClass="w-full">
                          </p-calendar>
                          <app-input-validation [form]="form" modelo="horaInicio" ver="Hora Inicio">
                          </app-input-validation>
                        </div>

                        <!-- Hora Fin -->
                        <div class="flex flex-col gap-2">
                          <label for="horaFin">Hora Fin</label>
                          <p-calendar id="horaFin" formControlName="horaFin" timeOnly="true" hourFormat="24" appendTo="body"
                            styleClass="w-full">
                          </p-calendar>
                          <app-input-validation [form]="form" modelo="horaFin" ver="Hora Fin">
                          </app-input-validation>
                        </div>

                        <!-- Máximo de Horas -->
                        <div class="flex flex-col gap-2">
                          <label for="maxHoras">Máximo de Horas</label>
                          <input pInputText id="maxHoras" type="number" formControlName="maxHoras" class="p-inputtext w-full" min="1"
                            max="8" />
                          <app-input-validation [form]="form" modelo="maxHoras" ver="Máximo de Horas">
                          </app-input-validation>
                        </div>
                      </div>

                      <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                          <div class="col-span-2 flex items-center gap-2">

                            <p-checkbox id="checkDiscapacidad" formControlName="equipoDiscapacidad" binary="true"></p-checkbox>
                            <label for="checkDiscapacidad" class="text-sm">¿Equipo con discapacidad?</label>
                          </div>
                        </div>
                      </div>

                    </form>
                  </ng-template>
                  <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading"
                      label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid || loading"
                      label="Guardar" class="p-button-success"></button>
                  </ng-template>
                </p-dialog>

                <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
                <p-toast></p-toast>`,
    imports: [TemplateModule, InputValidation],
    providers: [MessageService, ConfirmationService]
})
export class FormEquipo implements OnInit, OnChanges {
    loading: boolean = false;
    form: FormGroup = new FormGroup({});
    display: boolean = false;
    objeto: Equipo = new Equipo();
    estadoLista: Estado[] = [];
    estadoFiltro!: Estado;
    sedeLista: Sede[] = [];
    @Input() selectedSede!: Sede;
    @Output() saved: EventEmitter<void> = new EventEmitter<void>();

    constructor(private fb: FormBuilder,private bibliotecaVirtualService: BibliotecaVirtualService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {

        this.form = this.fb.group({
            id: [0],
            estado: ['', [Validators.required, ]],
            nombreEquipo: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
            numeroEquipo: ['', [Validators.required, Validators.maxLength(2), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
            ip: ['', [
                Validators.required,
                Validators.pattern('^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$')
              ]],
          horaInicio: [null, [Validators.required]],
                horaFin: [null, [Validators.required]],
                maxHoras: [null, [Validators.required, Validators.min(1), Validators.max(24)]],
          equipoDiscapacidad: [false],
                sede: [null, [Validators.required, this.sedeSeleccionadaValidator]]

        });
    }

  sedeSeleccionadaValidator(control: AbstractControl): { [key: string]: any } | null {
    const sede = control.value;
    // Si la sede no está definida o su id es 0, se considera inválida
    return (!sede || sede.id === 0) ? { sedeNoSeleccionada: true } : null;
  }
    async ngOnInit() {
        await this.ListarEstados();
        await this.ListaSede();
    }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSede'] && changes['selectedSede'].currentValue) {
      this.form.patchValue({ sede: changes['selectedSede'].currentValue });
    }
  }
    async ListaSede() {
       this.bibliotecaVirtualService.filtrarPorSede(0).subscribe(result => {
            // Supongamos que si se pasa sedeId 0 se obtienen todas las sedes,
            // o crea otro servicio para obtener la lista completa.
            this.sedeLista = result.data;
          },
          error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de sedes.' });
          });

    }

    async ListarEstados() {
        try {
          const result: any = await this.bibliotecaVirtualService.listarEstados().toPromise();
          if (result.status === 0) {
            // Opcional: agregar una opción de "TODOS LOS ESTADOS"
            this.estadoLista = result.data;
            this.estadoFiltro = this.estadoLista[0];
          }
        } catch (error) {
          console.error(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar los estados' });
        }
      }
    openModal() {
        // Reiniciar objeto y formulario
        this.objeto = new Equipo();
        this.form.reset();

        // Si ya se han cargado los estados, buscamos el que corresponde a "EN PROCESO"
        if (this.estadoLista && this.estadoLista.length > 0) {
          const estadoEnProceso = this.estadoLista.find(
            e => e.descripcion.toLowerCase() === 'en proceso'
          );
          // Si lo encontramos, lo asignamos al formulario (puedes pasar el objeto o solo su id, según tu validación)
          if (estadoEnProceso) {
            // Por ejemplo, si tu form espera el objeto:
            this.form.patchValue({ estado: estadoEnProceso });
            // O si solo se usa el id:
            // this.form.patchValue({ estado: estadoEnProceso.id });
          }
        }

        // También puedes actualizar la sede si se ha seleccionado desde el componente principal
        if (this.selectedSede) {
          this.form.patchValue({ sede: this.selectedSede });
        }

        this.display = true;
    }

async editarRegistro(material: Equipo) {
  // Llama al método setData para precargar los datos en los formularios de los modales.
  this.setData(material);
  // Abre el primer modal (por ejemplo, para la información del libro)
  this.display = true;
}

    closeModal() {
        this.display = false;
    }
    guardar(): void {
      this.loading = true;
      const equipo: Equipo = this.form.value;  // Extraemos los datos del formulario
      const materialCompleto = {
                    equipo: this.form.value,
                  };
      console.log("ver equipo: "+ materialCompleto.equipo.id);
      // Verificamos si el id existe y es mayor a 0
      if (equipo.id && equipo.id > 0) {
        // Actualizar: Llamamos al método de actualización
        this.bibliotecaVirtualService.actualizarEquipo(equipo.id, equipo).subscribe(
          (result: any) => {
            if (result.status === 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Satisfactorio',
                detail: 'Equipo actualizado correctamente.'
              });
              this.saved.emit();
              this.closeModal();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: result.message || 'No se pudo actualizar el equipo.'
              });
            }
            this.loading = false;
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error. Inténtelo más tarde'
            });
            this.loading = false;
          }
        );
      } else {
        // Crear: Si no hay id o es 0, se crea un nuevo registro.
        this.bibliotecaVirtualService.crearEquipo(equipo).subscribe(
          (result: any) => {
            if (result.status === 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Satisfactorio',
                detail: 'Equipo registrado exitosamente.'
              });
              this.closeModal();
              this.saved.emit();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: result.message || 'No se pudo registrar el equipo.'
              });
            }
            this.loading = false;
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error. Inténtelo más tarde'
            });
            this.loading = false;
          }
        );
      }
    }

setData(equipo: Equipo): void {
  this.objeto = equipo;
  this.form.patchValue({
    id: equipo.id,
    estado: equipo.estado,
    nombreEquipo: equipo.nombreEquipo,
    numeroEquipo: equipo.numeroEquipo,
    ip: equipo.ip,
    equipoDiscapacidad: equipo.equipoDiscapacidad,
    sede: equipo.sede,
    // Si tu entidad `Equipo` ya tiene estas tres propiedades:
      horaInicio: equipo.horaInicio ? this.stringToDate(equipo.horaInicio) : null,
      horaFin:    equipo.horaFin    ? this.stringToDate(equipo.horaFin)    : null,
      maxHoras:   equipo.maxHoras   ?? null
  });
}
/** Convierte un string "HH:mm" a un objeto Date (solo para p-calendar timeOnly) */
  private stringToDate(hhmm: string): Date {
    const parts = hhmm.split(':');
    const d = new Date();
    d.setHours(+parts[0], +parts[1], 0, 0);
    return d;
  }




}
