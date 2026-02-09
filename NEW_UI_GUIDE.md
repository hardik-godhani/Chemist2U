# Audience Rule Builder - New UI Structure

## 🎯 Overview

The application has been restructured with a clean, intuitive navigation system and separate pages for different functionalities.

## 📱 Application Structure

### Navigation
- **Top Navigation Bar**: Provides easy switching between Rules and Contacts pages
- **Active Page Highlighting**: Shows which page you're currently on

### Pages

#### 1. **Rules Page** (`/rules`)
Create, edit, and manage audience rules.

**Layout:**
- **Left Side (2/3)**: Rule Builder
  - Rule name input
  - Visual condition builder with nested AND/OR groups
  - Live preview counter showing matching contacts
  - Save/Update/Cancel buttons
  
- **Right Side (1/3)**: Saved Rules List
  - List of all saved rules with timestamps
  - Edit button - loads rule into builder
  - Delete button - removes rule permanently
  
**Features:**
- Create new rules from scratch
- Edit existing rules (click "Edit" button)
- Delete rules with confirmation
- Real-time match count preview
- Nested AND/OR logic groups

#### 2. **Contacts Page** (`/contacts`)
View and filter the contact database.

**Layout:**
- **Left Side (1/4)**: Filter Panel
  - Rule selector dropdown
  - Clear filter button
  - Statistics (showing/total contacts)
  
- **Right Side (3/4)**: Contacts List
  - Table view of all contacts
  - Shows: Name, Email, Country, Plan, Purchases, Signup Date
  - Updates in real-time when filter is applied
  
**Features:**
- View all 100 contacts
- Filter by any saved rule
- Clear filter to show all contacts
- No editing/deleting (read-only view)

## 🚀 How to Use

### Creating a Rule
1. Go to **Rules** page
2. Enter a descriptive name
3. Click "+ Condition" or "+ Group" to build logic
4. Watch the live match count update
5. Click "Save Rule" when satisfied

### Editing a Rule
1. Go to **Rules** page
2. Find the rule in the right sidebar
3. Click "Edit" button
4. Make your changes
5. Click "Update Rule"

### Filtering Contacts
1. Go to **Contacts** page
2. Select a rule from the dropdown
3. View filtered results instantly
4. Click "Clear Filter" to see all contacts again

## 🎨 Design Philosophy

- **Separation of Concerns**: Rules management and contact viewing are separate
- **Clean Interface**: No clutter, focused functionality per page
- **Intuitive Navigation**: Clear page structure with top navigation
- **Consistent Design**: Professional, minimal styling throughout
- **Real-time Feedback**: Live updates as you build rules

## 🔧 Technical Details

**Frontend Components:**
- `NavbarComponent` - Top navigation bar
- `RulesPageComponent` - Rules management page
- `ContactsPageComponent` - Contacts viewing page
- `RuleGroupComponent` - Recursive rule builder (reused)
- `RuleConditionComponent` - Single condition editor (reused)

**Routing:**
- `/` - Redirects to `/rules`
- `/rules` - Rules management
- `/contacts` - Contacts list with filtering

**Backend:**
- Now returns ALL matching contacts (not just first 10)
- Same API endpoints, enhanced responses

## 📊 Sample Data

- **100 contacts** with realistic data
- **15 countries** represented
- **4 plan types**: free, basic, premium, enterprise
- **Purchase counts**: 0-50
- **Signup dates**: 2020-2026

## 🎯 Next Steps

1. Open http://localhost:4200
2. You'll be redirected to Rules page
3. Create your first rule
4. Navigate to Contacts to see filtered results
