"use client";

import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Loader2,
  MoreVertical,
  Trash2,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UniversalTable from "./UniversalTable";

// Hooks & Config
import { universalConfig } from "@/config/dynamicConfig";
import { useModuleData, useModuleDataById } from "@/hooks/useUniversal";
import { useAuthStore } from "@/stores/useAuthStore";

// =============================================================================
// ICON MAPPING
// =============================================================================

const ICON_MAP = {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  User,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the display value for a field
 */
const getFieldValue = (data, fieldKey, fieldConfig) => {
  const value = data[fieldKey];

  if (!value && value !== 0 && value !== false) return "—";

  // Handle relation fields
  if (fieldConfig?.relation && typeof value === "object") {
    if (Array.isArray(value)) {
      return value
        .map((item) => item.name || item.title || item.email)
        .join(", ");
    }
    return value.name || value.title || value.email || "—";
  }

  // Handle date fields
  if (fieldConfig?.type === "date") {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Handle boolean fields
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return value;
};

/**
 * Get the title for the detail page
 */
const getTitle = (data, config) => {
  const { titleField } = config.detailView || {};

  if (!titleField) return "Details";

  if (typeof titleField === "function") {
    return titleField(data);
  }

  return data[titleField] || "Details";
};

/**
 * Get the subtitle for the detail page
 */
const getSubtitle = (data, config) => {
  const { subtitleField } = config.detailView || {};

  if (!subtitleField) return null;

  if (typeof subtitleField === "function") {
    return subtitleField(data);
  }

  return data[subtitleField];
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Loading state
 */
const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

/**
 * Error state
 */
const ErrorState = ({ error }) => (
  <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center gap-3">
    <AlertCircle className="h-5 w-5" />
    <p>Error loading details: {error.message}</p>
  </div>
);

/**
 * Header info card
 */
const InfoCard = ({ icon, label, value, variant = "default" }) => {
  const Icon = ICON_MAP[icon] || CheckCircle;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {label}
            </p>
            <p className="text-sm font-semibold truncate mt-0.5">
              {value || "—"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Field section
 */
const FieldSection = ({ title, fields, data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((fieldKey) => {
            const fieldConfig = config.fields[fieldKey];
            if (!fieldConfig) return null;

            const value = getFieldValue(data, fieldKey, fieldConfig);

            return (
              <div key={fieldKey} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {fieldConfig.label}
                </p>
                <p className="text-sm text-foreground">{value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Related data tab
 */
const RelatedDataTab = ({ relatedConfig, parentId, token }) => {
  const { module, filterBy, displayAs = "table" } = relatedConfig;

  const { data, isLoading } = useModuleData(module, token, {
    [filterBy]: parentId,
  });

  const relatedData = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (relatedData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No {relatedConfig.label.toLowerCase()} found</p>
      </div>
    );
  }

  if (displayAs === "table") {
    return (
      <UniversalTable
        module={module}
        data={relatedData}
        enableActions={false}
      />
    );
  }

  // List view (simple)
  return (
    <div className="space-y-2">
      {relatedData.map((item) => (
        <Card key={item._id}>
          <CardContent className="p-4">
            <p className="text-sm font-medium">
              {item.title ||
                item.name ||
                item.actionText ||
                `Item #${item._id?.slice(-6)}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalDetailView({ module }) {
  const params = useParams();
  const { id } = params;
  const { token } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");

  // Get module configuration
  const config = universalConfig[module];
  const detailConfig = config?.detailView || {};

  // Fetch data
  const { data, isLoading, error } = useModuleDataById(module, token, id);

  // Handle loading and error states
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!data) return <ErrorState error={{ message: "No data found" }} />;

  // Extract configuration
  const {
    headerCards = [],
    sections = [],
    relatedData = [],
    actions = [],
  } = detailConfig;
  const title = getTitle(data, config);
  const subtitle = getSubtitle(data, config);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          {actions.map((action) => {
            if (action.type === "edit") {
              return (
                <Button
                  key="edit"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/dashboard/${params.role}/${module}?edit=${id}`
                    )
                  }
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              );
            }
            return null;
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Title Section */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {/* Header Info Cards */}
      {headerCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {headerCards.map((card) => {
            const fieldConfig = config.fields[card.field];
            const value = getFieldValue(data, card.field, fieldConfig);

            return (
              <InfoCard
                key={card.field}
                icon={card.icon}
                label={card.label}
                value={value}
              />
            );
          })}
        </div>
      )}

      <Separator />

      {/* Tabs for Sections and Related Data */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {relatedData.map((related) => (
            <TabsTrigger key={related.module} value={related.module}>
              {related.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          {sections.map((section) => (
            <FieldSection
              key={section.title}
              title={section.title}
              fields={section.fields}
              data={data}
              config={config}
            />
          ))}
        </TabsContent>

        {/* Related Data Tabs */}
        {relatedData.map((related) => (
          <TabsContent
            key={related.module}
            value={related.module}
            className="mt-6"
          >
            <RelatedDataTab
              relatedConfig={related}
              parentId={id}
              token={token}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
