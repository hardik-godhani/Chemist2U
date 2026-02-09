import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import DOMPurify from 'dompurify';
import { cloneDeep } from 'lodash-es';
import { RuleService } from '../../services/rule.service';
import { RuleStateService } from '../../services/rule-state.service';
import { RuleCondition, FieldOperator, Rule, validateRuleCondition, ValidationResult } from '@temp-nx/shared-types';
import { RuleGroupComponent } from '../../components/rule-group/rule-group.component';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-rules-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RuleGroupComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './rules-page.component.html',
  styleUrl: './rules-page.component.scss',
})
export class RulesPageComponent implements OnInit {
  currentCondition: RuleCondition = {
    type: 'group',
    operator: 'AND',
    conditions: [],
  };

  fields: FieldOperator[] = [];
  savedRules: Rule[] = [];
  rulesLoading = false;

  ruleName = '';
  saving = false;
  saveMessage = '';
  saveSuccess = false;
  
  editingRule: Rule | null = null;

  previewMatchCount = 0;
  totalContacts = 0;
  previewLoading = false;

  validationResult: ValidationResult | null = null;

  private conditionChange$ = new Subject<void>();

  constructor(
    private ruleService: RuleService,
    private ruleStateService: RuleStateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Load available fields
    this.ruleService.getFields().subscribe({
      next: (response) => {
        this.fields = response.fields;
        this.ruleStateService.setFields(response.fields);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading fields:', error);
      },
    });

    // Load saved rules
    this.loadSavedRules();

    // Subscribe to condition changes with debounce
    this.conditionChange$.pipe(debounceTime(300)).subscribe(() => {
      this.evaluateRule();
    });

    // Initial evaluation
    this.evaluateRule();
  }

  onConditionChange() {
    this.ruleStateService.setCurrentCondition(this.currentCondition);
    
    // Validate the condition
    this.validationResult = validateRuleCondition(this.currentCondition);
    
    this.conditionChange$.next();
    this.cdr.detectChanges();
  }

  evaluateRule() {
    this.previewLoading = true;
    this.cdr.detectChanges();

    this.ruleService.evaluateRule(this.currentCondition).subscribe({
      next: (response) => {
        this.previewMatchCount = response.matchCount;
        this.totalContacts = response.totalContacts;
        this.previewLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.previewLoading = false;
        this.cdr.detectChanges();
        console.error('Error evaluating rule:', error);
      },
    });
  }

  loadSavedRules() {
    this.rulesLoading = true;
    this.cdr.detectChanges();
    
    this.ruleService.getRules().subscribe({
      next: (response) => {
        this.savedRules = response.rules;
        this.rulesLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading rules:', error);
        this.rulesLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  /**
   * Sanitize rule name and condition values
   */
  private sanitizeRuleData(name: string, condition: RuleCondition): { name: string; condition: RuleCondition } {
    // Sanitize rule name
    const sanitizedName = DOMPurify.sanitize(name.trim(), { ALLOWED_TAGS: [] });
    
    // Sanitize condition recursively
    const sanitizedCondition = this.sanitizeCondition(condition);
    
    return { name: sanitizedName, condition: sanitizedCondition };
  }

  /**
   * Recursively sanitize condition values
   */
  private sanitizeCondition(condition: RuleCondition): RuleCondition {
    if (condition.type === 'group') {
      return {
        ...condition,
        conditions: condition.conditions?.map(c => this.sanitizeCondition(c)) || [],
      };
    } else {
      // Sanitize text values
      let sanitizedValue = condition.value;
      if (typeof sanitizedValue === 'string') {
        sanitizedValue = DOMPurify.sanitize(sanitizedValue.trim(), { ALLOWED_TAGS: [] });
      }
      
      return {
        ...condition,
        value: sanitizedValue,
      };
    }
  }

  saveRule() {
    if (!this.ruleName) {
      this.saveSuccess = false;
      this.saveMessage = 'Rule name is required';
      return;
    }

    // Validate the condition
    const validation = validateRuleCondition(this.currentCondition);
    if (!validation.valid) {
      this.saveSuccess = false;
      this.saveMessage = 'Cannot save rule: ' + validation.errors.join('; ');
      return;
    }

    // Sanitize inputs
    const { name, condition } = this.sanitizeRuleData(this.ruleName, this.currentCondition);
    
    if (name.length === 0 || name.length > 100) {
      this.saveSuccess = false;
      this.saveMessage = 'Rule name must be between 1 and 100 characters';
      return;
    }

    this.saving = true;
    this.saveMessage = '';
    this.cdr.detectChanges();

    if (this.editingRule) {
      // Update existing rule
      this.ruleService.deleteRule(this.editingRule.id).subscribe({
        next: () => {
          this.ruleService.saveRule(name, condition).subscribe({
            next: () => {
              this.saveSuccess = true;
              this.saveMessage = `Rule "${this.ruleName}" updated successfully!`;
              this.saving = false;
              this.editingRule = null;
              this.loadSavedRules();
              this.resetRule();
              setTimeout(() => {
                this.saveMessage = '';
                this.cdr.detectChanges();
              }, 3000);
              this.cdr.detectChanges();
            },
            error: (error) => {
              this.handleSaveError(error);
            },
          });
        },
        error: (error) => {
          this.handleSaveError(error);
        },
      });
    } else {
      // Create new rule
      this.ruleService.saveRule(name, condition).subscribe({
        next: () => {
          this.saveSuccess = true;
          this.saveMessage = `Rule "${this.ruleName}" saved successfully!`;
          this.saving = false;
          this.loadSavedRules();
          this.resetRule();
          setTimeout(() => {
            this.saveMessage = '';
            this.cdr.detectChanges();
          }, 3000);
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.handleSaveError(error);
        },
      });
    }
  }

  handleSaveError(error: any) {
    this.saveSuccess = false;
    this.saveMessage = 'Failed to save rule. Please try again.';
    this.saving = false;
    this.cdr.detectChanges();
    console.error('Error saving rule:', error);
  }

  editRule(rule: Rule) {
    this.editingRule = rule;
    this.ruleName = rule.name;
    // Use lodash cloneDeep for efficient deep cloning
    this.currentCondition = cloneDeep(rule.condition);
    this.ruleStateService.setCurrentCondition(this.currentCondition);
    this.evaluateRule();
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingRule = null;
    this.resetRule();
  }

  deleteRule(id: string) {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    this.ruleService.deleteRule(id).subscribe({
      next: () => {
        if (this.editingRule?.id === id) {
          this.editingRule = null;
          this.resetRule();
        }
        this.loadSavedRules();
      },
      error: (error) => {
        console.error('Error deleting rule:', error);
        alert('Failed to delete rule. Please try again.');
      },
    });
  }

  resetRule() {
    this.editingRule = null;
    this.ruleName = '';
    this.currentCondition = {
      type: 'group',
      operator: 'AND',
      conditions: [],
    };
    this.ruleStateService.resetCondition();
    this.evaluateRule();
    this.saveMessage = '';
    this.cdr.detectChanges();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
