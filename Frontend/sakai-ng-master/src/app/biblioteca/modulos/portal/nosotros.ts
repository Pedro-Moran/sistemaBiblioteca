import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PortalService, NosotrosDTO } from '../../services/portal.service';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    DividerModule,
    InputTextModule,
    InputTextarea,
    ButtonModule
  ],
  providers: [ MessageService, ConfirmationService ],
  template: `
    <div class="grid">
      <div class="col-12">
        <div class="card flex flex-col gap-4 w-full">
          <h5>Nosotros</h5>
          <form [formGroup]="form" (ngSubmit)="guardar()" class="grid grid-cols-12 gap-4">
            <div class="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3">
              <label for="eyebrow">Subtitulo</label>
              <input id="eyebrow" pInputText formControlName="eyebrow" />
            </div>
            <div class="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3">
              <label for="title">Título</label>
              <input id="title" pInputText formControlName="title" />
            </div>
            <div class="flex flex-col gap-2 col-span-12 md:col-span-6 lg:col-span-3">
              <label for="imageUrl">URL de la imagen</label>
              <input id="imageUrl" pInputText formControlName="imageUrl" />
            </div>
            <div class="flex flex-col gap-2 col-span-12">
              <label for="body">Texto</label>
              <textarea id="body" pInputTextarea rows="6" formControlName="body"></textarea>
            </div>
            <div class="col-span-12 flex justify-end">
              <button pButton type="submit" label="Guardar" icon="pi pi-check" [disabled]="form.invalid"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class Nosotros implements OnInit {
  form!: FormGroup;
  datos!: NosotrosDTO;

  constructor(
    private fb: FormBuilder,
    private portal: PortalService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // 1) Armamos el form
    this.form = this.fb.group({
      eyebrow:  ['', Validators.required],
      title:    ['', Validators.required],
      imageUrl: ['', Validators.required],
      body:     ['', Validators.required]
    });

    // 2) Cargamos los datos existentes
    this.portal.getNosotros()
      .subscribe(dto => {
        this.datos = dto;
        this.form.patchValue({
          eyebrow:  dto.eyebrow,
          title:    dto.title,
          imageUrl: dto.imageUrl,
          body:     dto.body
        });
      });
  }

  guardar() {
    if (this.form.invalid) return;

    const updated: NosotrosDTO = {
      ...this.datos,
      eyebrow:  this.form.value.eyebrow,
      title:    this.form.value.title,
      imageUrl: this.form.value.imageUrl,
      body:     this.form.value.body
    };

    this.portal
      .saveNosotros(updated)       // <-- aquí ya no es FormData sino DTO
      .subscribe({
        next: () => this.messageService.add({severity:'success',detail:'¡Guardado!'}),
        error: () => this.messageService.add({severity:'error',detail:'Error al guardar'})
      });
  }

}
