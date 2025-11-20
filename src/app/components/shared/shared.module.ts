// shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importa tus componentes standalone
import { ButtonComponent } from './button/button.component';
import { ModalComponent } from './modal/modal.component';
import { IconComponent } from './icon/icon.component';
import { TableComponent } from './table/table.component';
import { TitleComponent } from './title/title.component';
import { ContextMenuComponent } from './context-menu/context-menu.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
// import { LoaderComponent } from './loader/loader.component'; TODO

@NgModule({
  imports: [
    CommonModule,
    // Importa los componentes standalone
    ButtonComponent,
    ModalComponent,
    IconComponent,
    TableComponent,
    TitleComponent,
    ContextMenuComponent,
    ColorPickerComponent
    // LoaderComponent, //TODO
  ],
  exports: [
    // Exporta todos los componentes para uso externo
    CommonModule,
    ButtonComponent,
    ModalComponent,
    IconComponent,
    TableComponent,
    TitleComponent,
    ContextMenuComponent,
    ColorPickerComponent
    // LoaderComponent, //TODO
  ]
})
export class SharedModule { }