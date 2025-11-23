Complete markdown content for DARK_MODE_GUIDE.md:

# Dark Mode Development Guide## OverviewThis guide ensures all components work seamlessly in both light and dark modes. Our theme system uses CSS variables and Tailwind classes that automatically adapt to the current theme.## ✅ Theme Variables (Always Use These)### Background Colors| Purpose | Tailwind Class | Description ||---------|---------------|-------------|| Main Background | `bg-background` | Primary page background || Card/Container | `bg-card` | Card and container backgrounds || Muted Background | `bg-muted` | Subtle background sections || Input Background | `bg-input` | Form input backgrounds |### Text Colors| Purpose | Tailwind Class | Description ||---------|---------------|-------------|| Primary Text | `text-foreground` | Main content text || Secondary Text | `text-muted-foreground` | Helper text, descriptions || Primary Actions | `text-primary` | Primary action text || Destructive | `text-destructive` | Error messages, delete actions |### Borders| Purpose | Tailwind Class | Description ||---------|---------------|-------------|| Standard Border | `border-border` | All borders || Input Border | `border-input` | Form input borders |### Action Colors| Purpose | Tailwind Class | Description ||---------|---------------|-------------|| Primary Button | `bg-primary text-primary-foreground` | Main actions || Destructive Button | `bg-destructive text-destructive-foreground` | Delete, remove || Secondary Button | `bg-secondary text-secondary-foreground` | Secondary actions |## ❌ Never Use These (Hardcoded Colors)// ❌ DON'T USEbg-whitebg-gray-50, bg-gray-100, bg-gray-200, etc.text-gray-600, text-gray-700, text-gray-800, text-gray-900border-gray-200, border-gray-300## ✅ Status & Role BadgesStatus colors are **automatically handled** by CSS overrides in `globals.css`. Use standard Tailwind color classes:// ✅ These work automatically in both light and dark modes<span className="bg-green-50 text-green-700 border border-green-200">Active</span><span className="bg-red-50 text-red-700 border border-red-200">Inactive</span><span className="bg-blue-50 text-blue-700 border border-blue-200">Pending</span><span className="bg-yellow-50 text-yellow-700 border border-yellow-200">Warning</span><span className="bg-purple-50 text-purple-700 border border-purple-200">Admin</span>**Supported Colors:**- Green, Red, Blue, Yellow, Amber- Purple, Teal, Cyan, Orange- Indigo, Sky, Fuchsia, Violet- Emerald, Lime, Pink## Component Patterns### Buttons// Primary action<Button className="bg-primary hover:bg-primary/90 text-primary-foreground"> Save</Button>// Destructive action<Button className="text-destructive hover:bg-destructive/10"> Delete</Button>// Secondary (uses theme automatically)<Button variant="outline">Cancel</Button>### Cards & Containers// Standard card<div className="bg-card border border-border rounded-lg p-4 shadow-sm"> <h3 className="text-foreground font-semibold">Title</h3> <p className="text-muted-foreground">Description</p></div>// Muted section<div className="bg-muted/50 border border-border rounded p-3"> Helper content</div>### Forms// Form container<form className="space-y-4"> <Label className="text-foreground">Field Name</Label> <Input /> {/_ Uses theme automatically _/} {/_ Error message _/} <p className="text-destructive text-sm">Error message</p> {/_ Helper text _/} <p className="text-muted-foreground text-xs">Helper text</p></form>### Tables// Table container<div className="border border-border rounded-lg overflow-hidden bg-card"> <table className="w-full"> <thead className="bg-muted/50 border-b border-border"> <th className="text-muted-foreground">Header</th> </thead> <tbody className="divide-y divide-border"> <tr className="hover:bg-muted/50"> <td className="text-foreground">Content</td> </tr> </tbody> </table></div>### Modals & Dialogs// Modal backdrop<div className="fixed inset-0 bg-black/50 dark:bg-black/70" />// Modal content<div className="bg-card border border-border rounded-lg shadow-xl"> <h2 className="text-foreground">Modal Title</h2> <p className="text-muted-foreground">Modal content</p></div>### Icons// Theme-aware icon colors<Icon className="text-muted-foreground" /><Icon className="text-foreground" /><Icon className="text-destructive" /><Icon className="text-primary" />### Hover States// ✅ Theme-aware hover<div className="hover:bg-muted"><div className="hover:text-foreground"><div className="hover:border-border">// ❌ Hardcoded hover (DON'T USE)<div className="hover:bg-gray-100"><div className="hover:text-gray-900">### Dividers & Separators// ✅ Theme-aware<div className="border-t border-border" /><Separator /> {/_ Uses theme automatically _/}// ❌ Hardcoded<div className="border-t border-gray-200" />## Component TemplateUse this template for new components:"use client";import { Button } from "@/components/ui/button";import { Card } from "@/components/ui/card";export function NewComponent() { return ( <Card className="bg-card border-border"> <div className="space-y-4"> {/_ Header _/} <h2 className="text-foreground font-semibold">Title</h2> <p className="text-muted-foreground text-sm">Description</p> {/_ Content _/} <div className="bg-muted/30 border border-border rounded p-4"> <p className="text-foreground">Content here</p> </div> {/_ Actions _/} <div className="flex gap-2"> <Button variant="default">Primary</Button> <Button variant="outline">Secondary</Button> <Button className="text-destructive hover:bg-destructive/10"> Delete </Button> </div> {/_ Status Badge _/} <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded"> Active </span> </div> </Card> );}## Pre-Development ChecklistBefore creating a new component, ensure:- [ ] No `bg-white` or `bg-gray-*` classes- [ ] No `text-gray-*` classes- [ ] No `border-gray-*` classes- [ ] Status badges use standard color classes (green-50, red-50, etc.)- [ ] Hover states use theme variables- [ ] Error states use `text-destructive` or `bg-destructive/10`- [ ] Primary actions use `bg-primary` or `text-primary`- [ ] Icons use theme-aware colors## Testing ChecklistAfter creating a component:1. ✅ Toggle between light and dark modes2. ✅ Verify all text is readable (good contrast)3. ✅ Check borders are visible in both modes4. ✅ Test hover states in both modes5. ✅ Verify status badges are readable6. ✅ Check form inputs are visible7. ✅ Ensure modals/dialogs work correctly## Quick Reference### Common Replacements| Old (Hardcoded) | New (Theme-Aware) ||----------------|-------------------|| `bg-white` | `bg-card` || `bg-gray-50` | `bg-muted` || `text-gray-600` | `text-muted-foreground` || `text-gray-700` | `text-foreground` || `text-gray-900` | `text-foreground` || `border-gray-200` | `border-border` || `hover:bg-gray-100` | `hover:bg-muted` || `text-red-600` | `text-destructive` || `bg-red-50` | `bg-destructive/10` |### Status Colors (Auto-Handled)These work automatically - no changes needed:// All these work in both light and dark modesbg-green-50 text-green-700 border-green-200bg-red-50 text-red-700 border-red-200bg-blue-50 text-blue-700 border-blue-200bg-yellow-50 text-yellow-700 border-yellow-200bg-purple-50 text-purple-700 border-purple-200bg-amber-50 text-amber-700 border-amber-200bg-teal-50 text-teal-700 border-teal-200bg-orange-50 text-orange-700 border-orange-200// ... and more## Special Cases### When You Need Specific ColorsIf you absolutely need a specific color not in the theme:// Add explicit dark mode variant<div className="bg-blue-500 dark:bg-blue-600 text-white"> Special content</div>### Backdrop Overlays// Modal/dialog backdrop<div className="bg-black/50 dark:bg-black/70" />### ShadowsShadows work automatically in both modes:<div className="shadow-sm" /><div className="shadow-md" /><div className="shadow-lg" />## File Locations- **Theme Configuration**: `audit-frontend/src/app/globals.css`- **Theme Provider**: `audit-frontend/src/components/theme-provider.jsx`- **Theme Toggle**: `audit-frontend/src/components/ui/ThemeToggle.jsx`## Examples### ✅ Good Exampleexport function UserCard({ user }) { return ( <div className="bg-card border border-border rounded-lg p-4"> <h3 className="text-foreground font-semibold">{user.name}</h3> <p className="text-muted-foreground text-sm">{user.email}</p> <div className="mt-4 flex gap-2"> <Button variant="default">Edit</Button> <Button className="text-destructive hover:bg-destructive/10"> Delete </Button> </div> <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs"> {user.status} </span> </div> );}### ❌ Bad Exampleexport function UserCard({ user }) { return ( <div className="bg-white border border-gray-200 rounded-lg p-4"> <h3 className="text-gray-900 font-semibold">{user.name}</h3> <p className="text-gray-600 text-sm">{user.email}</p> <div className="mt-4 flex gap-2"> <button className="bg-blue-600 text-white">Edit</button> <button className="text-red-600 hover:bg-red-50">Delete</button> </div> <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs"> {user.status} </span> </div> );}## Questions?If you're unsure about which class to use:1. Check this guide first2. Look at existing components (UniversalTable, UniversalForm, etc.)3. Use theme variables - they're safer than hardcoded colors4. Test in both light and dark modes## Remember> **Always use theme variables. They automatically adapt to light and dark modes. Status colors are handled automatically via CSS overrides.**---**Last Updated**: 2024 **Maintained By**: Development Team

✅ Status & Role Badges
Status colors are automatically handled by CSS overrides in globals.css. Use standard Tailwind color classes:
// ✅ These work automatically in both light and dark modes<span className="bg-green-50 text-green-700 border border-green-200">Active</span><span className="bg-red-50 text-red-700 border border-red-200">Inactive</span><span className="bg-blue-50 text-blue-700 border border-blue-200">Pending</span><span className="bg-yellow-50 text-yellow-700 border border-yellow-200">Warning</span><span className="bg-purple-50 text-purple-700 border border-purple-200">Admin</span>
Supported Colors:
Green, Red, Blue, Yellow, Amber
Purple, Teal, Cyan, Orange
Indigo, Sky, Fuchsia, Violet
Emerald, Lime, Pink
Component Patterns
Buttons
// Primary action<Button className="bg-primary hover:bg-primary/90 text-primary-foreground"> Save</Button>// Destructive action<Button className="text-destructive hover:bg-destructive/10"> Delete</Button>// Secondary (uses theme automatically)<Button variant="outline">Cancel</Button>
Cards & Containers
// Standard card<div className="bg-card border border-border rounded-lg p-4 shadow-sm"> <h3 className="text-foreground font-semibold">Title</h3> <p className="text-muted-foreground">Description</p></div>// Muted section<div className="bg-muted/50 border border-border rounded p-3"> Helper content</div>
Forms
// Form container<form className="space-y-4"> <Label className="text-foreground">Field Name</Label> <Input /> {/_ Uses theme automatically _/} {/_ Error message _/} <p className="text-destructive text-sm">Error message</p> {/_ Helper text _/} <p className="text-muted-foreground text-xs">Helper text</p></form>
Tables
// Table container<div className="border border-border rounded-lg overflow-hidden bg-card"> <table className="w-full"> <thead className="bg-muted/50 border-b border-border"> <th className="text-muted-foreground">Header</th> </thead> <tbody className="divide-y divide-border"> <tr className="hover:bg-muted/50"> <td className="text-foreground">Content</td> </tr> </tbody> </table></div>
Modals & Dialogs
// Modal backdrop<div className="fixed inset-0 bg-black/50 dark:bg-black/70" />// Modal content<div className="bg-card border border-border rounded-lg shadow-xl"> <h2 className="text-foreground">Modal Title</h2> <p className="text-muted-foreground">Modal content</p></div>
Icons
// Theme-aware icon colors<Icon className="text-muted-foreground" /><Icon className="text-foreground" /><Icon className="text-destructive" /><Icon className="text-primary" />
Hover States
// ✅ Theme-aware hover<div className="hover:bg-muted"><div className="hover:text-foreground"><div className="hover:border-border">// ❌ Hardcoded hover (DON'T USE)<div className="hover:bg-gray-100"><div className="hover:text-gray-900">
Dividers & Separators
// ✅ Theme-aware<div className="border-t border-border" /><Separator /> {/_ Uses theme automatically _/}// ❌ Hardcoded<div className="border-t border-gray-200" />
Component Template
Use this template for new components:
"use client";import { Button } from "@/components/ui/button";import { Card } from "@/components/ui/card";export function NewComponent() { return ( <Card className="bg-card border-border"> <div className="space-y-4"> {/_ Header _/} <h2 className="text-foreground font-semibold">Title</h2> <p className="text-muted-foreground text-sm">Description</p> {/_ Content _/} <div className="bg-muted/30 border border-border rounded p-4"> <p className="text-foreground">Content here</p> </div> {/_ Actions _/} <div className="flex gap-2"> <Button variant="default">Primary</Button> <Button variant="outline">Secondary</Button> <Button className="text-destructive hover:bg-destructive/10"> Delete </Button> </div> {/_ Status Badge _/} <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded"> Active </span> </div> </Card> );}
Pre-Development Checklist
Before creating a new component, ensure:
[ ] No bg-white or bg-gray-_ classes
[ ] No text-gray-_ classes
[ ] No border-gray-\* classes
[ ] Status badges use standard color classes (green-50, red-50, etc.)
[ ] Hover states use theme variables
[ ] Error states use text-destructive or bg-destructive/10
[ ] Primary actions use bg-primary or text-primary
[ ] Icons use theme-aware colors
Testing Checklist
After creating a component:
✅ Toggle between light and dark modes
✅ Verify all text is readable (good contrast)
✅ Check borders are visible in both modes
✅ Test hover states in both modes
✅ Verify status badges are readable
✅ Check form inputs are visible
✅ Ensure modals/dialogs work correctly
Quick Reference
Common Replacements
Old (Hardcoded) New (Theme-Aware)
bg-white bg-card
bg-gray-50 bg-muted
text-gray-600 text-muted-foreground
text-gray-700 text-foreground
text-gray-900 text-foreground
border-gray-200 border-border
hover:bg-gray-100 hover:bg-muted
text-red-600 text-destructive
bg-red-50 bg-destructive/10
Status Colors (Auto-Handled)
These work automatically - no changes needed:
// All these work in both light and dark modesbg-green-50 text-green-700 border-green-200bg-red-50 text-red-700 border-red-200bg-blue-50 text-blue-700 border-blue-200bg-yellow-50 text-yellow-700 border-yellow-200bg-purple-50 text-purple-700 border-purple-200bg-amber-50 text-amber-700 border-amber-200bg-teal-50 text-teal-700 border-teal-200bg-orange-50 text-orange-700 border-orange-200// ... and more
Special Cases
When You Need Specific Colors
If you absolutely need a specific color not in the theme:
// Add explicit dark mode variant<div className="bg-blue-500 dark:bg-blue-600 text-white"> Special content</div>
Backdrop Overlays
// Modal/dialog backdrop<div className="bg-black/50 dark:bg-black/70" />
Shadows
Shadows work automatically in both modes:

<div className="shadow-sm" /><div className="shadow-md" /><div className="shadow-lg" />
File Locations
Theme Configuration: audit-frontend/src/app/globals.css
Theme Provider: audit-frontend/src/components/theme-provider.jsx
Theme Toggle: audit-frontend/src/components/ui/ThemeToggle.jsx
Examples
✅ Good Example
export function UserCard({ user }) {  return (    <div className="bg-card border border-border rounded-lg p-4">      <h3 className="text-foreground font-semibold">{user.name}</h3>      <p className="text-muted-foreground text-sm">{user.email}</p>            <div className="mt-4 flex gap-2">        <Button variant="default">Edit</Button>        <Button className="text-destructive hover:bg-destructive/10">          Delete        </Button>      </div>            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs">        {user.status}      </span>    </div>  );}
❌ Bad Example
export function UserCard({ user }) {  return (    <div className="bg-white border border-gray-200 rounded-lg p-4">      <h3 className="text-gray-900 font-semibold">{user.name}</h3>      <p className="text-gray-600 text-sm">{user.email}</p>            <div className="mt-4 flex gap-2">        <button className="bg-blue-600 text-white">Edit</button>        <button className="text-red-600 hover:bg-red-50">Delete</button>      </div>            <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs">        {user.status}      </span>    </div>  );}
Questions?
If you're unsure about which class to use:
Check this guide first
Look at existing components (UniversalTable, UniversalForm, etc.)
Use theme variables - they're safer than hardcoded colors
Test in both light and dark modes
Remember
> Always use theme variables. They automatically adapt to light and dark modes. Status colors are handled automatically via CSS overrides
