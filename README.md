audit-frontend/
├── 📁 .git/                           # Git version control
├── 📁 .next/                          # Next.js build output
├── 📁 node_modules/                   # Project dependencies
├── 📁 public/                         # Static assets
│   ├── 🖼️ file.svg                    # Default Next.js file icon
│   ├── 🖼️ globe.svg                   # Default Next.js globe icon
│   ├── 🖼️ next.svg                    # Next.js logo
│   ├── 🖼️ vercel.svg                  # Vercel logo
│   └── 🖼️ window.svg                  # Default Next.js window icon
├── 📁 src/                            # Source code directory
│   ├── 📁 app/                         # Next.js App Router
│   │   ├── 📁 (auth)/                  # Authentication route group (no URL prefix)
│   │   │   ├── 📁 login/               # Login page
│   │   │   │   ├── 📄 LoginForm.jsx     # Login form component
│   │   │   │   └── 📄 page.jsx          # Login page route
│   │   │   └── 📁 register/            # Registration page
│   │   │       ├── 📄 RegisterForm.jsx # Registration form component
│   │   │       └── 📄 page.jsx          # Registration page route
│   │   ├── 📁 (dashboard)/             # Dashboard route group (protected)
│   │   │   ├── 📄 layout.jsx            # Dashboard layout wrapper
│   │   │   ├── 📄 page.jsx              # Dashboard home page
│   │   │   ├── 📁 admin/                # Admin section
│   │   │   │   ├── 📁 components/       # Admin-specific components
│   │   │   │   │   ├── 📄 AdminNavbar.jsx    # Admin navigation bar
│   │   │   │   │   ├── 📄 AdminSidebar.jsx   # Admin sidebar navigation
│   │   │   │   │   ├── 📄 SidebarItems.jsx   # Admin sidebar menu items
│   │   │   │   │   ├── 📄 UserStats.jsx       # User statistics cards
│   │   │   │   │   ├── 📄 SystemMetrics.jsx   # System performance metrics
│   │   │   │   │   └── 📄 ActivityLog.jsx     # System activity log component
│   │   │   │   ├── 📄 layout.jsx         # Admin layout wrapper
│   │   │   │   ├── 📄 page.jsx           # Admin dashboard home
│   │   │   │   ├── 📁 users/             # User management
│   │   │   │   │   ├── 📁 components/    # User management components
│   │   │   │   │   │   ├── 📄 UserList.jsx      # Users list table
│   │   │   │   │   │   ├── 📄 UserCard.jsx     # User card display
│   │   │   │   │   │   ├── 📄 UserForm.jsx     # User creation/edit form
│   │   │   │   │   │   ├── 📄 UserTable.jsx    # Users data table
│   │   │   │   │   │   ├── 📄 UserFilters.jsx  # User search/filter controls
│   │   │   │   │   │   └── 📄 UserActions.jsx  # User action buttons
│   │   │   │   │   ├── 📄 page.jsx       # Users list page
│   │   │   │   │   ├── 📁 [id]/          # Dynamic user detail page
│   │   │   │   │   │   ├── 📁 components/    # User detail components
│   │   │   │   │   │   │   ├── 📄 UserProfile.jsx   # User profile display
│   │   │   │   │   │   │   ├── 📄 UserEdit.jsx      # User edit form
│   │   │   │   │   │   │   └── 📄 UserActivity.jsx  # User activity log
│   │   │   │   │   │   └── 📄 page.jsx     # User detail page
│   │   │   │   │   └── 📁 create/        # Create new user
│   │   │   │   │       ├── 📁 components/    # User creation components
│   │   │   │   │       │   └── 📄 CreateUserForm.jsx # User creation form
│   │   │   │   │       └── 📄 page.jsx     # Create user page
│   │   │   │   ├── 📁 settings/          # Admin settings
│   │   │   │   │   ├── 📁 components/    # Settings components
│   │   │   │   │   │   ├── 📄 SystemSettings.jsx # System configuration
│   │   │   │   │   │   ├── 📄 SecuritySettings.jsx # Security options
│   │   │   │   │   │   └── 📄 NotificationSettings.jsx # Notification preferences
│   │   │   │   │   └── 📄 page.jsx       # Settings page
│   │   │   │   └── 📁 system/            # System management
│   │   │   │       ├── 📁 components/    # System components
│   │   │   │       │   ├── 📄 SystemLogs.jsx    # System logs viewer
│   │   │   │       │   ├── 📄 BackupManager.jsx # Backup/restore interface
│   │   │   │       │   └── 📄 SystemStatus.jsx  # System health status
│   │   │   │       └── 📄 page.jsx       # System management page
│   │   │   ├── 📁 groups/               # Group management
│   │   │   │   ├── 📁 components/        # Group management components
│   │   │   │   │   ├── 📄 GroupList.jsx   # Groups list display
│   │   │   │   │   ├── 📄 GroupCard.jsx   # Group card display
│   │   │   │   │   ├── 📄 GroupForm.jsx   # Group creation/edit form
│   │   │   │   │   ├── 📄 GroupTable.jsx  # Groups data table
│   │   │   │   │   └── 📄 GroupMembers.jsx # Group members management
│   │   │   │   ├── 📄 page.jsx           # Groups list page
│   │   │   │   ├── 📁 [id]/              # Dynamic group detail page
│   │   │   │   │   ├── 📁 components/    # Group detail components
│   │   │   │   │   │   ├── 📄 GroupDetails.jsx # Group information display
│   │   │   │   │   │   ├── 📄 GroupEdit.jsx    # Group edit form
│   │   │   │   │   │   └── 📄 GroupAuditTrail.jsx # Group audit history
│   │   │   │   │   └── 📄 page.jsx       # Group detail page
│   │   │   │   └── 📁 create/            # Create new group
│   │   │   │       ├── 📁 components/    # Group creation components
│   │   │   │       │   └── 📄 CreateGroupForm.jsx # Group creation form
│   │   │   │       └── 📄 page.jsx       # Create group page
│   │   │   ├── 📁 companies/            # Company management
│   │   │   │   ├── 📁 components/        # Company management components
│   │   │   │   │   ├── 📄 CompanyList.jsx # Companies list display
│   │   │   │   │   ├── 📄 CompanyCard.jsx # Company card display
│   │   │   │   │   ├── 📄 CompanyForm.jsx # Company creation/edit form
│   │   │   │   │   ├── 📄 CompanyTable.jsx # Companies data table
│   │   │   │   │   └── 📄 CompanySites.jsx # Company sites management
│   │   │   │   ├── 📄 page.jsx           # Companies list page
│   │   │   │   ├── 📁 [id]/              # Dynamic company detail page
│   │   │   │   │   ├── 📁 components/    # Company detail components
│   │   │   │   │   │   ├── 📄 CompanyDetails.jsx # Company information display
│   │   │   │   │   │   ├── 📄 CompanyEdit.jsx    # Company edit form
│   │   │   │   │   │   └── 📄 CompanyAudits.jsx  # Company audit history
│   │   │   │   │   └── 📄 page.jsx       # Company detail page
│   │   │   │   └── 📁 create/            # Create new company
│   │   │   │       ├── 📁 components/    # Company creation components
│   │   │   │       │   └── 📄 CreateCompanyForm.jsx # Company creation form
│   │   │   │       └── 📄 page.jsx       # Create company page
│   │   │   ├── 📁 sites/                # Site management
│   │   │   │   ├── 📁 components/        # Site management components
│   │   │   │   │   ├── 📄 SiteList.jsx    # Sites list display
│   │   │   │   │   ├── 📄 SiteCard.jsx    # Site card display
│   │   │   │   │   ├── 📄 SiteForm.jsx    # Site creation/edit form
│   │   │   │   │   ├── 📄 SiteTable.jsx   # Sites data table
│   │   │   │   │   └── 📄 SiteMap.jsx     # Site location map
│   │   │   │   ├── 📄 page.jsx           # Sites list page
│   │   │   │   ├── 📁 [id]/              # Dynamic site detail page
│   │   │   │   │   ├── 📁 components/    # Site detail components
│   │   │   │   │   │   ├── 📄 SiteDetails.jsx    # Site information display
│   │   │   │   │   │   ├── 📄 SiteEdit.jsx       # Site edit form
│   │   │   │   │   │   └── 📄 SiteAudits.jsx     # Site audit history
│   │   │   │   │   └── 📄 page.jsx       # Site detail page
│   │   │   │   └── 📁 create/            # Create new site
│   │   │   │       ├── 📁 components/    # Site creation components
│   │   │   │       │   └── 📄 CreateSiteForm.jsx # Site creation form
│   │   │   │       └── 📄 page.jsx       # Create site page
│   │   │   ├── 📁 checktypes/           # Check type management
│   │   │   │   ├── 📁 components/        # Check type components
│   │   │   │   │   ├── 📄 CheckTypeList.jsx # Check types list display
│   │   │   │   │   ├── 📄 CheckTypeCard.jsx # Check type card display
│   │   │   │   │   ├── 📄 CheckTypeForm.jsx # Check type creation/edit form
│   │   │   │   │   └── 📄 CheckTypeTable.jsx # Check types data table
│   │   │   │   ├── 📄 page.jsx           # Check types list page
│   │   │   │   ├── 📁 [id]/              # Dynamic check type detail page
│   │   │   │   │   ├── 📁 components/    # Check type detail components
│   │   │   │   │   │   ├── 📄 CheckTypeDetails.jsx # Check type information
│   │   │   │   │   │   └── 📄 CheckTypeEdit.jsx    # Check type edit form
│   │   │   │   │   └── 📄 page.jsx       # Check type detail page
│   │   │   │   └── 📁 create/            # Create new check type
│   │   │   │       ├── 📁 components/    # Check type creation components
│   │   │   │       │   └── 📄 CreateCheckTypeForm.jsx # Check type creation form
│   │   │   │       └── 📄 page.jsx       # Create check type page
│   │   │   ├── 📁 rules/                # Rule management
│   │   │   │   ├── 📁 components/        # Rule management components
│   │   │   │   │   ├── 📄 RuleList.jsx    # Rules list display
│   │   │   │   │   ├── 📄 RuleCard.jsx    # Rule card display
│   │   │   │   │   ├── 📄 RuleForm.jsx    # Rule creation/edit form
│   │   │   │   │   └── 📄 RuleTable.jsx   # Rules data table
│   │   │   │   ├── 📄 page.jsx           # Rules list page
│   │   │   │   ├── 📁 [id]/              # Dynamic rule detail page
│   │   │   │   │   ├── 📁 components/    # Rule detail components
│   │   │   │   │   │   ├── 📄 RuleDetails.jsx    # Rule information display
│   │   │   │   │   │   └── 📄 RuleEdit.jsx       # Rule edit form
│   │   │   │   │   └── 📄 page.jsx       # Rule detail page
│   │   │   │   └── 📁 create/            # Create new rule
│   │   │   │       ├── 📁 components/    # Rule creation components
│   │   │   │       │   └── 📄 CreateRuleForm.jsx # Rule creation form
│   │   │   │       └── 📄 page.jsx       # Create rule page
│   │   │   ├── 📁 templates/            # Template management
│   │   │   │   ├── 📁 components/        # Template management components
│   │   │   │   │   ├── 📄 TemplateList.jsx # Templates list display
│   │   │   │   │   ├── 📄 TemplateCard.jsx # Template card display
│   │   │   │   │   ├── 📄 TemplateForm.jsx # Template creation/edit form
│   │   │   │   │   ├── 📄 TemplateTable.jsx # Templates data table
│   │   │   │   │   └── 📄 TemplatePreview.jsx # Template preview component
│   │   │   │   ├── 📄 page.jsx           # Templates list page
│   │   │   │   ├── 📁 [id]/              # Dynamic template detail page
│   │   │   │   │   ├── 📁 components/    # Template detail components
│   │   │   │   │   │   ├── 📄 TemplateDetails.jsx # Template information
│   │   │   │   │   │   ├── 📄 TemplateEdit.jsx    # Template edit form
│   │   │   │   │   │   └── 📄 TemplateQuestions.jsx # Template questions
│   │   │   │   │   └── 📄 page.jsx       # Template detail page
│   │   │   │   └── 📁 create/            # Create new template
│   │   │   │       ├── 📁 components/    # Template creation components
│   │   │   │       │   └── 📄 CreateTemplateForm.jsx # Template creation form
│   │   │   │       └── 📄 page.jsx       # Create template page
│   │   │   ├── 📁 questions/            # Question management
│   │   │   │   ├── 📁 components/        # Question management components
│   │   │   │   │   ├── 📄 QuestionList.jsx # Questions list display
│   │   │   │   │   ├── 📄 QuestionCard.jsx # Question card display
│   │   │   │   │   ├── 📄 QuestionForm.jsx # Question creation/edit form
│   │   │   │   │   ├── 📄 QuestionTable.jsx # Questions data table
│   │   │   │   │   └── 📄 QuestionPreview.jsx # Question preview component
│   │   │   │   ├── 📄 page.jsx           # Questions list page
│   │   │   │   ├── 📁 [id]/              # Dynamic question detail page
│   │   │   │   │   ├── 📁 components/    # Question detail components
│   │   │   │   │   │   ├── 📄 QuestionDetails.jsx # Question information
│   │   │   │   │   │   └── 📄 QuestionEdit.jsx    # Question edit form
│   │   │   │   │   └── 📄 page.jsx       # Question detail page
│   │   │   │   └── 📁 create/            # Create new question
│   │   │   │       ├── 📁 components/    # Question creation components
│   │   │   │       │   └── 📄 CreateQuestionForm.jsx # Question creation form
│   │   │   │       └── 📄 page.jsx       # Create question page
│   │   │   ├── 📁 audits/               # Audit management
│   │   │   │   ├── 📁 components/        # Audit management components
│   │   │   │   │   ├── 📄 AuditList.jsx   # Audits list display
│   │   │   │   │   ├── 📄 AuditCard.jsx   # Audit card display
│   │   │   │   │   ├── 📄 AuditForm.jsx   # Audit creation/edit form
│   │   │   │   │   ├── 📄 AuditTable.jsx  # Audits data table
│   │   │   │   │   ├── 📄 AuditProgress.jsx # Audit execution component
│   │   │   │   │   └── 📄 AuditResults.jsx # Audit results display
│   │   │   │   ├── 📄 page.jsx           # Audits list page
│   │   │   │   ├── 📁 [id]/              # Dynamic audit detail page
│   │   │   │   │   ├── 📁 components/    # Audit detail components
│   │   │   │   │   │   ├── 📄 AuditDetails.jsx    # Audit information
│   │   │   │   │   │   ├── 📄 AuditExecution.jsx  # Audit execution interface
│   │   │   │   │   │   └── 📄 AuditReport.jsx     # Audit report generation
│   │   │   │   │   └── 📄 page.jsx       # Audit detail page
│   │   │   │   └── 📁 create/            # Create new audit
│   │   │   │       ├── 📁 components/    # Audit creation components
│   │   │   │       │   └── 📄 CreateAuditForm.jsx # Audit creation form
│   │   │   │       └── 📄 page.jsx       # Create audit page
│   │   │   ├── 📁 reports/              # Reports and analytics
│   │   │   │   ├── 📁 components/        # Report components
│   │   │   │   │   ├── 📄 ReportList.jsx # Reports list display
│   │   │   │   │   ├── 📄 ReportCard.jsx # Report card display
│   │   │   │   │   ├── 📄 ReportForm.jsx # Report generation form
│   │   │   │   │   ├── 📄 ReportTable.jsx # Reports data table
│   │   │   │   │   └── 📄 ReportFilters.jsx # Report filter controls
│   │   │   │   ├── 📄 page.jsx           # Reports list page
│   │   │   │   └── 📁 [id]/              # Dynamic report detail page
│   │   │   │       ├── 📁 components/    # Report detail components
│   │   │   │       │   ├── 📄 ReportView.jsx     # Report visualization
│   │   │   │       │   └── 📄 ReportExport.jsx   # Report export options
│   │   │   │       └── 📄 page.jsx       # Report detail page
│   │   │   └── 📁 profile/              # User profile
│   │   │       ├── 📁 components/        # Profile components
│   │   │       │   ├── 📄 ProfileInfo.jsx # User profile information
│   │   │       │   ├── 📄 ProfileEdit.jsx # Profile edit form
│   │   │       │   └── 📄 ProfileSettings.jsx # Profile settings
│   │   │       └── 📄 page.jsx           # Profile page
│   │   ├── 🖼️ favicon.ico                # Site favicon
│   │   ├── 🎨 globals.css                # Global styles and Tailwind
│   │   ├── 📄 layout.jsx                 # Root layout with providers
│   │   └── 📄 page.jsx                   # Home/landing page
│   ├── 📁 components/                    # Shared components
│   │   ├── 📁 ui/                        # Base UI components (shadcn/ui)
│   │   │   ├── 📄 avatar.jsx             # User avatar with fallback
│   │   │   ├── 📄 badge.jsx              # Status badges and labels
│   │   │   ├── 📄 button.jsx             # Button with variants and sizes
│   │   │   ├── 📄 card.jsx               # Card container component
│   │   │   ├── 📄 checkbox.jsx           # Checkbox input
│   │   │   ├── 📄 dropdown-menu.jsx      # Dropdown menu component
│   │   │   ├── 📄 form.jsx               # Form wrapper with validation
│   │   │   ├── 📄 input.jsx              # Text input with validation
│   │   │   ├── 📄 label.jsx              # Form label component
│   │   │   ├── 📄 modal.jsx              # Modal/dialog component
│   │   │   ├── 📄 pagination.jsx         # Pagination controls
│   │   │   ├── 📄 select.jsx             # Select dropdown
│   │   │   ├── 📄 sonner.jsx             # Toast notifications
│   │   │   ├── 📄 table.jsx              # Table component
│   │   │   ├── 📄 tabs.jsx               # Tab navigation
│   │   │   └── 📄 textarea.jsx           # Textarea input
│   │   ├── 📁 auth/                      # Authentication components
│   │   │   ├── 📄 LoginForm.jsx          # Login form with email/password
│   │   │   ├── 📄 RegisterForm.jsx       # Registration with role selection
│   │   │   ├── 📄 ProtectedRoute.jsx     # Route protection wrapper
│   │   │   └── 📄 AuthProvider.jsx       # Authentication context provider
│   │   ├── 📁 layout/                    # Layout components
│   │   │   ├── 📄 Header.jsx             # Top navigation header
│   │   │   ├── 📄 Sidebar.jsx            # Main navigation sidebar
│   │   │   ├── 📄 Footer.jsx             # Page footer
│   │   │   ├── 📄 Navbar.jsx             # Navigation bar
│   │   │   └── 📄 MobileNav.jsx          # Mobile navigation
│   │   └── 📁 charts/                    # Visualization components
│   │       ├── 📄 BarChart.jsx           # Bar chart component
│   │       ├── 📄 LineChart.jsx          # Line chart component
│   │       ├── 📄 PieChart.jsx           # Pie chart component
│   │       └── 📄 StatsCard.jsx          # Statistics card
│   ├── 📁 hooks/                         # Custom React hooks
│   │   ├── 📄 useAuth.js                 # Authentication state and actions
│   │   ├── 📄 useUsers.js                # User CRUD operations with TanStack Query
│   │   ├── 📄 useGroups.js               # Group CRUD operations
│   │   ├── 📄 useCompanies.js            # Company CRUD operations
│   │   ├── 📄 useSites.js                # Site CRUD operations
│   │   ├── 📄 useCheckTypes.js           # Check type CRUD operations
│   │   ├── 📄 useRules.js                # Rule CRUD operations
│   │   ├── 📄 useTemplates.js            # Template CRUD operations
│   │   ├── 📄 useQuestions.js            # Question CRUD operations
│   │   ├── 📄 useAudits.js               # Audit CRUD operations
│   │   ├── 📄 useReports.js              # Report generation and fetching
│   │   ├── 📄 useLocalStorage.js         # Local storage management
│   │   ├── 📄 useDebounce.js             # Debounce utility hook
│   │   └── 📄 usePermissions.js          # Role-based permission checking
│   ├── 📁 lib/                           # Core libraries and utilities
│   │   ├── 📄 api.js                     # Axios configuration and interceptors
│   │   ├── 📄 auth.js                    # Authentication utilities
│   │   ├── 📄 utils.js                   # General utility functions
│   │   ├── 📄 validations.js             # Form validation schemas
│   │   ├── 📄 constants.js               # App constants and enums
│   │   ├── 📄 helpers.js                 # Helper functions
│   │   ├── 📄 permissions.js             # Permission definitions
│   │   └── 📄 queryClient.js             # TanStack Query configuration
│   ├── 📁 providers/                     # React Context providers
│   │   ├── 📄 QueryProvider.jsx          # TanStack Query provider
│   │   ├── 📄 AuthProvider.jsx           # Authentication context provider
│   │   ├── 📄 ThemeProvider.jsx          # Theme context (dark/light mode)
│   │   └── 📄 NotificationProvider.jsx   # Notification context
│   ├── 📁 services/                      # API service layer
│   │   ├── 📄 api.js                     # Base API configuration
│   │   ├── 📄 authService.js             # Authentication API calls
│   │   ├── 📄 userService.js             # User management API
│   │   ├── 📄 groupService.js            # Group management API
│   │   ├── 📄 companyService.js          # Company management API
│   │   ├── 📄 siteService.js             # Site management API
│   │   ├── 📄 checkTypeService.js        # Check type API
│   │   ├── 📄 ruleService.js             # Rule management API
│   │   ├── 📄 templateService.js         # Template management API
│   │   ├── 📄 questionService.js         # Question management API
│   │   ├── 📄 auditService.js            # Audit management API
│   │   └── 📄 reportService.js           # Report generation API
│   ├── 📁 stores/                        # State management (Zustand)
│   │   ├── 📄 useAuthStore.js            # Authentication state store
│   │   ├── 📄 useThemeStore.js           # Theme state store
│   │   ├── 📄 useNotificationStore.js    # Notification state store
│   │   └── 📄 useModalStore.js           # Modal state store
│   ├── 📁 types/                         # Type definitions
│   │   ├── 📄 auth.js                    # Authentication related types
│   │   ├── 📄 user.js                    # User entity types
│   │   ├── 📄 group.js                   # Group entity types
│   │   ├── 📄 company.js                 # Company entity types
│   │   ├── 📄 site.js                    # Site entity types
│   │   ├── 📄 checkType.js               # Check type types
│   │   ├── 📄 rule.js                    # Rule entity types
│   │   ├── 📄 template.js                # Template entity types
│   │   ├── 📄 question.js                # Question entity types
│   │   ├── 📄 audit.js                   # Audit entity types
│   │   ├── 📄 report.js                  # Report entity types
│   │   └── 📄 index.js                   # Export all types
│   ├── 📁 utils/                         # Utility functions
│   │   ├── 📄 auth.js                    # Authentication utilities
│   │   ├── 📄 date.js                    # Date formatting utilities
│   │   ├── 📄 format.js                  # Data formatting functions
│   │   ├── 📄 validation.js              # Validation helpers
│   │   ├── 📄 permissions.js             # Permission checking utilities
│   │   └── 📄 helpers.js                 # General helper functions
│   └── 📄 middleware.js                  # Next.js middleware for auth
├── 🔒 .env                              # Environment variables
├── 🔒 .env.local                        # Local environment variables
├── 🚫 .gitignore                        # Git ignore file
├── 📖 README.md                         # Project documentation
├── 📄 components.json                   # shadcn/ui configuration
├── 📄 eslint.config.mjs                 # ESLint configuration
├── 📄 jsconfig.json                     # JavaScript configuration
├── 📄 next.config.mjs                   # Next.js configuration
├── 📄 package.json                      # Project dependencies and scripts
└── 📄 postcss.config.mjs                # PostCSS configuration