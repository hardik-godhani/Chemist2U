import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RuleCondition, FieldOperator } from '@temp-nx/shared-types';

@Injectable({
  providedIn: 'root',
})
export class RuleStateService {
  private currentConditionSubject = new BehaviorSubject<RuleCondition>({
    type: 'group',
    operator: 'AND',
    conditions: [],
  });

  private fieldsSubject = new BehaviorSubject<FieldOperator[]>([]);

  currentCondition$ = this.currentConditionSubject.asObservable();
  fields$ = this.fieldsSubject.asObservable();

  setCurrentCondition(condition: RuleCondition): void {
    this.currentConditionSubject.next(condition);
  }

  getCurrentCondition(): RuleCondition {
    return this.currentConditionSubject.value;
  }

  setFields(fields: FieldOperator[]): void {
    this.fieldsSubject.next(fields);
  }

  getFields(): FieldOperator[] {
    return this.fieldsSubject.value;
  }

  resetCondition(): void {
    this.currentConditionSubject.next({
      type: 'group',
      operator: 'AND',
      conditions: [],
    });
  }
}
