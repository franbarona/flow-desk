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
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { MultiselectDropdownComponent } from './multiselect-dropdown/multiselect-dropdown.component';
import { TabPanelComponent, TabsComponent } from './tabs';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { InputComponent } from './input/input.component';
import { TextareaComponent } from './textarea/textarea.component';
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
    ColorPickerComponent,
    DeleteConfirmationComponent,
    MultiselectDropdownComponent,
    TabsComponent,
    TabPanelComponent,
    DatepickerComponent,
    DropdownComponent,
    InputComponent,
    TextareaComponent
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
    ColorPickerComponent,
    DeleteConfirmationComponent,
    MultiselectDropdownComponent,
    TabsComponent,
    TabPanelComponent,
    DatepickerComponent,
    DropdownComponent,
    InputComponent,
    TextareaComponent
    // LoaderComponent, //TODO
  ]
})
export class SharedModule { }