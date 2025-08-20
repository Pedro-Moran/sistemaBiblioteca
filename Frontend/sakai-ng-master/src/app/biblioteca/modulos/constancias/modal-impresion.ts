import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
@Component({
    selector: 'app-modal-impresion',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Imprimir" [modal]="true" [closable]="true" styleClass="p-fluid">
     <ng-template pTemplate="content">  
        <form [formGroup]="form">
        <div class="grid grid-cols-7 gap-4">
                  
                <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="tipoConstancia">Tipo constancia</label>
                    <p-select appendTo="body" [options]="tipoconstanciaLista" optionLabel="descripcion" placeholder="Seleccionar" />
        
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-1">
                    <label for="nroSolicitud">Nro solicitud</label>
                    <input pInputText id="nroSolicitud" type="text"/> 
                    </div>
                <div class="flex flex-col gap-2 col-span-7">
                    <label for="descripcion">Descripcion</label>
                    <textarea pTextarea id="descripcion" rows="8" ></textarea>
                    </div>

                
                </div>
                
        </form>   
     </ng-template>
     <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid || loading" label="Aceptar" class="p-button-success"></button>
                </ng-template>
  </p-dialog>
  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
  <p-toast></p-toast>
  `,
    imports: [TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class ModalImpresion implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
    tipoconstanciaLista: ClaseGeneral[] = [];
constructor(private fb: FormBuilder,private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {
}
    async ngOnInit() {
    }
        openModal() {
            this.objeto={};
            this.display = true;
        }
    
        closeModal() {
            this.display = false;
        }
        guardar(){
            this.confirmationService.confirm({
                message: '¿Esta seguro de imprimir constancia?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    //registrar nueva especiadad
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });

                }
            });
        }
    }
