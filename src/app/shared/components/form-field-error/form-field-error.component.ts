import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input() formControlComponent: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

  public get errorMessage(): string | null {
    if ( this.mustShowErrorMessage() ){
      return this.getErrorMessage();
    }else{
      return null;
    }
  }

  private mustShowErrorMessage(): boolean {
    return this.formControlComponent.invalid && this.formControlComponent.touched;
  }

  private getErrorMessage(): string | null {
    if ( this.formControlComponent.errors.required ){
      return 'Campo Obrigatório';
    }else if ( this.formControlComponent.errors.minlength ){
      const requiredLenght = this.formControlComponent.errors.minlength.requiredLength;
      return `Deve ter no mínimo ${requiredLenght} caracteres`;
    } else if ( this.formControlComponent.errors.email ){
      return 'E-mail inválido';
    }
  }
}
