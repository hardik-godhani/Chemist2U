import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Rule,
  RuleCondition,
  EvaluateRuleResponse,
  SaveRuleResponse,
  ListRulesResponse,
  DeleteRuleResponse,
  GetFieldsResponse,
  FieldOperator,
} from '@temp-nx/shared-types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RuleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  evaluateRule(condition: RuleCondition): Observable<EvaluateRuleResponse> {
    return this.http.post<EvaluateRuleResponse>(`${this.apiUrl}/evaluate`, {
      condition,
    });
  }

  getRules(): Observable<ListRulesResponse> {
    return this.http.get<ListRulesResponse>(`${this.apiUrl}/rules`);
  }

  saveRule(name: string, condition: RuleCondition): Observable<SaveRuleResponse> {
    return this.http.post<SaveRuleResponse>(`${this.apiUrl}/rules`, {
      name,
      condition,
    });
  }

  deleteRule(id: string): Observable<DeleteRuleResponse> {
    return this.http.delete<DeleteRuleResponse>(`${this.apiUrl}/rules/${id}`);
  }

  getFields(): Observable<GetFieldsResponse> {
    return this.http.get<GetFieldsResponse>(`${this.apiUrl}/fields`);
  }
}
