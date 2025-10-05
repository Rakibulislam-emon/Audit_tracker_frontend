// src/app/dashboard/admin/page.js
export default function AdminOverview() {
  return (
    <div>
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Welcome to Audit Tracker
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              A modern, professional admin interface for managing audits, users,
              and reports. Navigate through the menu to explore different
              sections of the application.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                View key metrics and analytics at a glance
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Users</h3>
              <p className="text-sm text-muted-foreground">
                Manage user accounts and permissions
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Audits</h3>
              <p className="text-sm text-muted-foreground">
                Track and manage audit processes
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Reports</h3>
              <p className="text-sm text-muted-foreground">
                Generate monthly and yearly reports
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure application preferences
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
