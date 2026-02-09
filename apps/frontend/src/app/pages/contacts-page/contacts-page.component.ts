import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleService } from '../../services/rule.service';
import { Rule, Contact } from '@temp-nx/shared-types';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss',
})
export class ContactsPageComponent implements OnInit {
  displayedColumns: string[] = ['name', 'country', 'plan', 'purchases', 'signupDate'];
  
  savedRules: Rule[] = [];
  allContacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  selectedRuleId = '';
  loading = false;

  constructor(
    private ruleService: RuleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRules();
    this.loadAllContacts();
  }

  loadRules() {
    this.ruleService.getRules().subscribe({
      next: (response) => {
        this.savedRules = response.rules;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading rules:', error);
      },
    });
  }

  loadAllContacts() {
    this.loading = true;
    this.cdr.detectChanges();
    
    // Load all contacts by passing empty condition
    this.ruleService.evaluateRule({
      type: 'group',
      operator: 'AND',
      conditions: [],
    }).subscribe({
      next: (response) => {
        this.allContacts = response.matches;
        this.filteredContacts = [...this.allContacts];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilter() {
    if (!this.selectedRuleId) {
      this.filteredContacts = [...this.allContacts];
      this.cdr.detectChanges();
      return;
    }

    const selectedRule = this.savedRules.find(r => r.id === this.selectedRuleId);
    if (!selectedRule) {
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();
    
    this.ruleService.evaluateRule(selectedRule.condition).subscribe({
      next: (response) => {
        this.filteredContacts = response.matches;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error applying filter:', error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  clearFilter() {
    this.selectedRuleId = '';
    this.filteredContacts = [...this.allContacts];
    this.cdr.detectChanges();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
