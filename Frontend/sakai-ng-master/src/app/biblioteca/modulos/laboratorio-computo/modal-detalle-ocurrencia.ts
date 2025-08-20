import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { ModalCostear } from './modal-costear';
import { Sedes } from '../../interfaces/sedes';
import { OcurrenciaDTO } from '../../interfaces/ocurrenciaDTO';
import { OcurrenciaMaterial } from '../../interfaces/OcurrenciaMaterial';
import { OcurrenciaMaterialDTO } from '../../interfaces/OcurrenciaMaterialDTO';
@Component({
    selector: 'app-modal-detalle-ocurrencia',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Regularizar ocurrencia" [modal]="true" [closable]="true" styleClass="p-fluid">
     <ng-template pTemplate="content">
     <form [formGroup]="form">
        <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-1">
                    <label for="codigo">Codigo</label>
                    <input pInputText id="codigo" type="text" formControlName="id" [disabled]="guardado || actualizar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="fecha">Fecha</label>
                    <p-datepicker  [disabled]="guardado || actualizar"
      appendTo="body"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy"
      formControlName="fechaCreacion">
</p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-3 lg:col-span-2">
                    <label for="semestre">Semestre</label>
                    <p-select appendTo="body"  [disabled]="guardado || actualizar" [options]="semestreLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="sede">Local/Filial</label>
                    <p-select appendTo="body" formControlName="sedePrestamo" [disabled]="guardado || actualizar" [options]="sedesLista" optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="ambiente">Ambiente</label>
                    <p-select appendTo="body"  [disabled]="guardado || actualizar"[options]="ambienteLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-3 lg:col-span-5">
                    <label for="personal">Personal</label>
                    <input pInputText id="personal" [disabled]="guardado || actualizar" type="text" formControlName="usuarioCreacion"/>

                    </div>
                    <div class="flex flex-col gap-2 col-span-7">
                    <label for="auditoria">Auditoria</label>
                    <textarea pTextarea id="auditoria"  [disabled]="guardado || actualizar"rows="4" formControlName="descripcion"></textarea>
                    </div>

                </div>


                <div class="grid grid-cols-7 gap-4 items-center py-4">
    <span class="col-span-4 font-bold">ESTUDIANTES INVOLUCRADOS</span>

</div>
<div class="py-4">
        <p-table
    [value]="involucrados"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Codigo</th>
                <th>Estudiante</th>
                <th></th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-u>
                    <tr>
                        <td>{{ u.codigoUsuario  }}</td>
                        <td>{{ u.tipoUsuario  }}</td>
                <td>
                <p-button icon="pi pi-trash" severity="secondary" rounded outlined disabled pTooltip="Eliminar" tooltipPosition="bottom"/>
                </td>
            </tr>
        </ng-template>
</p-table>
    </div>
<div class="grid grid-cols-7 gap-4 items-center py-4">
    <span class="col-span-4 font-bold">MATERIALES INVOLUCRADOS</span>

</div>
<div class="py-4">
        <p-table
    [value]="materiales"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Codigo</th>
                <th>Material</th>
                <th>Cant.</th>
                @if(costear){
                    <th>Costo Unit.</th>
                }
                <th></th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-m let-i="rowIndex">
                    <tr>
                        <td>{{ m.idEquipo   }}</td>
                        <td>{{ m.nombreEquipo  }}</td>
                        <td>{{ m.cantidad }}</td>
               <td *ngIf="costear">{{ m.costo }}</td>
                               <td>
                                 <button *ngIf="costear"
                                         pButton
                                         icon="pi pi-dollar"
                                         rounded
                                         outlined
                                         (click)="onCostear(i)"
                                         pTooltip="Costear"
                                         tooltipPosition="bottom">
                                 </button>
                                 <button *ngIf="!costear"
                                         pButton
                                         icon="pi pi-trash"
                                         severity="secondary"
                                         rounded
                                         outlined
                                         disabled
                                         pTooltip="Eliminar"
                                         tooltipPosition="bottom">
                                 </button>

                </td>
            </tr>
        </ng-template>
</p-table>

    </div>
    @if(!costear){
<div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="costo">Costo</label>
                    <input pInputText id="costo" type="text" [disabled]="guardado || actualizar" />
                    </div>
                    </div>


                <div class="flex justify-center mt-4">
                <p-button label="OCURRENCIA PENDIENTE DE COSTO" severity="danger" text />

</div>
    }@else {
        <h3><b>Costo total S/. </b>{{costoTotal}}</h3>
<div class="flex justify-center mt-4">
    <button
        pButton
        type="button"
        label="Confirmar Costo" (click)="confirmarCosto()"
        icon="pi pi-check"
        class="p-button-primary"
        [disabled]="loading"
        pTooltip="Confirmar"
        tooltipPosition="bottom">
    </button>
</div>
    }
        </form>
     </ng-template>
  </p-dialog>
  <app-modal-costear #modalCostear (saveCost)="onSaveCost($event)"></app-modal-costear>
  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>
  `,
    imports: [TemplateModule,ModalCostear],
    providers: [MessageService, ConfirmationService]
})
export class ModalDetalleOcurencia implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
        sedeLista: ClaseGeneral[] = [];
        semestreLista: ClaseGeneral[] = [];
        ambienteLista: ClaseGeneral[] = [];
        especialidadLista: ClaseGeneral[] = [];
        programaLista: ClaseGeneral[] = [];
        cicloLista: ClaseGeneral[] = [];
        docenteLista: ClaseGeneral[] = [];
        cursoLista: ClaseGeneral[] = [];
        turnoLista: ClaseGeneral[] = [];
        involucrados: any[] = [];
       materiales:   OcurrenciaMaterial[] = [];
        guardado:boolean=false;
        actualizar: boolean = true;
        costear:boolean=false;
        @ViewChild('modalCostear') modalCostear!: ModalCostear;
        costoTotal:any='0.00';
        sedesLista: Sedes[] = [];
        detalle!: OcurrenciaDTO;
        private editingIndex = -1;


constructor(private fb: FormBuilder,private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {
}
    ngOnInit() {
        this.guardado = false;
        this.actualizar = true;
        this.costear = false;
        this.form = this.fb.group({
          id:             [{ value: null, disabled: true }, Validators.required],
          fechaCreacion:  [{ value: null, disabled: true }],
          semestre:       [{ value: null, disabled: true }],
          sedePrestamo:   [{ value: null, disabled: true }],
          ambiente:       [{ value: null, disabled: true }],
          usuarioCreacion:[{ value: null, disabled: true }],
          descripcion:    [{ value: null, disabled: true }]
          // añade aquí los demás controles si los necesitas…
        });
        this.ListaSede();
    }
  openModal(id: number, costear = false) {
    this.costear = costear;
    this.materialBibliograficoService.getOcurrenciaById(id)
      .subscribe(dto => {
        this.detalle = dto;
        this.form.patchValue({
          id: dto.id,
          fechaCreacion: dto.fechaCreacion ? new Date(dto.fechaCreacion) : null,
          sedePrestamo: dto.sedePrestamo,
          usuarioCreacion: dto.usuarioCreacion,
          descripcion: dto.descripcion
        });
        if (dto.id != null) {
          this.loadInvolucrados(dto.id);
          this.loadMateriales(dto.id);
        }
        this.display = true;
      });
  }

        closeModal() {
            this.display = false;
        }
        openCostearModal() {
            this.objeto={};
            this.display = true;
            this.costear = true;
        }
//         ingresarPrecio(){
//             this.modalCostear.open();
//         }
  confirmarCosto() {
    this.confirmationService.confirm({
      message: '¿El costo será agregado y se cargará a la cuenta del(los) usuario(s)?',
      accept: () => {
        this.loading = true;

        // 1) Filtrar sólo los materiales con idMaterial definido (no null/undefined)
        const payload = this.materiales
          .filter(m => m.idMaterial != null)
          .map(m => ({
            idMaterial:    m.idMaterial!,     // ¡tenemos la seguridad de que no es null aquí!
            costoUnitario: m.costo ?? 0
          }));

        // 2) Llamada al servicio
        this.materialBibliograficoService
          .costearMateriales(this.detalle.id!, payload)
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', detail: 'Costos guardados.' });
              this.guardado = true;
              this.loading = false;
            },
            error: () => {
              this.messageService.add({ severity: 'error', detail: 'Error guardando costos.' });
              this.loading = false;
            }
          });
      }
    });
  }
          async ListaSede() {
              try {
                  const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
                  if (result.status === 0) {
                      this.sedesLista = result.data;
                  }
              } catch (error) {
                  console.log(error);
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
              }
          }

loadInvolucrados(ocurrenciaId: number) {
  this.materialBibliograficoService
    .listarUsuariosOcurrencia(ocurrenciaId)
    .subscribe(list => this.involucrados = list);
}

  loadMateriales(ocurrenciaId: number) {
    this.materialBibliograficoService
      .listarMaterialesOcurrencia(ocurrenciaId)
      .subscribe((dtos: OcurrenciaMaterialDTO[]) => {
        this.materiales = dtos.map(dto => ({
          idMaterial:   dto.idMaterial ?? undefined,               // puede venir null
          idEquipo:     Number(dto.codigoEquipo),                  // parseamos string → number
          nombreEquipo: dto.nombreEquipo,
          cantidad:     dto.cantidad,
          costo:        dto.costo ?? 0,                            // si dto.costo = null → 0
          subTotal:     (dto.costo ?? 0) * dto.cantidad
        }));
        this.recalcularTotal();
      });
  }

  onCostear(i: number) {
    this.editingIndex = i;
    const mat = this.materiales[i];
    this.modalCostear.open({
      nombre: mat.nombreEquipo,
      costo: mat.costo
    });
  }

  onSaveCost(costoUnitario: number) {
    const mat = this.materiales[this.editingIndex];
    mat.costo = costoUnitario;
    mat.subTotal = (costoUnitario * mat.cantidad) || 0;
    this.recalcularTotal();
  }

  private recalcularTotal() {
    this.costoTotal = this.materiales
      .reduce((sum, m) => sum + (m.subTotal ?? 0), 0);
  }
    }
