import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleCondition, FieldOperator } from '@temp-nx/shared-types';
import { RuleConditionComponent } from '../rule-condition/rule-condition.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-rule-group',
  standalone: true,
  imports: [CommonModule, RuleConditionComponent, MatButtonModule, MatIconModule, MatChipsModule, MatTooltipModule],
  templateUrl: './rule-group.component.html',
  styleUrl: './rule-group.component.scss',
})
export class RuleGroupComponent {
  @Input() group!: RuleCondition;
  @Input() fields: FieldOperator[] = [];
  @Input() isRoot = true;
  @Output() conditionChange = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  toggleOperator() {
    this.group.operator = this.group.operator === 'AND' ? 'OR' : 'AND';
    this.onConditionChange();
  }

  addCondition() {
    if (!this.group.conditions) {
      this.group.conditions = [];
    }

    this.group.conditions.push({
      type: 'condition',
      field: '',
      comparison: '',
      value: '',
    });
    this.onConditionChange();
  }

  addGroup() {
    if (!this.group.conditions) {
      this.group.conditions = [];
    }

    this.group.conditions.push({
      type: 'group',
      operator: 'AND',
      conditions: [],
    });
    this.onConditionChange();
  }

  removeCondition(index: number) {
    if (this.group.conditions) {
      this.group.conditions.splice(index, 1);
      this.onConditionChange();
    }
  }

  onConditionChange() {
    this.conditionChange.emit();
    this.cdr.markForCheck();
  }

  onRemove() {
    this.remove.emit();
  }
}
