import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleCondition, FieldOperator } from '@temp-nx/shared-types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-rule-condition',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  templateUrl: './rule-condition.component.html',
  styleUrl: './rule-condition.component.scss',
})
export class RuleConditionComponent implements OnInit {
  @Input() condition!: RuleCondition;
  @Input() fields: FieldOperator[] = [];
  @Output() conditionChange = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  selectedField: FieldOperator | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.updateSelectedField();
  }

  onFieldChange() {
    this.updateSelectedField();
    this.condition.comparison = '';
    this.condition.value = '';
    this.onConditionChange();
  }

  updateSelectedField() {
    this.selectedField = this.fields.find(
      (f) => f.field === this.condition.field
    );
  }

  onConditionChange() {
    this.conditionChange.emit();
    this.cdr.markForCheck();
  }

  onRemove() {
    this.remove.emit();
  }
}
