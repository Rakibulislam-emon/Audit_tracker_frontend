"use client";

import { Ban, Edit, Eye, MoreVertical, Play, Trash2 } from "lucide-react";
import Link from "next/link";

// Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Stores
import { useAuthStore } from "@/stores/useAuthStore";

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

const ACTION_ICONS = {
  start: Play,
  cancel: Ban,
  viewDetails: Eye,
  edit: Edit,
  delete: Trash2,
};

const DEFAULT_ICON = Play;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Check if user has permission for a specific action
 */
const hasPermission = (action, moduleConfig, userRole) => {
  if (!action.action || !moduleConfig.permissions[action.action]) {
    return true; // No specific permission required
  }

  return moduleConfig.permissions[action.action].includes(userRole);
};

/**
 * Check if action should be shown based on conditions
 */
const shouldShowAction = (action, item) => {
  if (!action.showWhen) return true;

  const { field, value } = action.showWhen;
  const fieldValue = item[field];

  return fieldValue === value;
};

/**
 * Get filtered custom actions based on permissions and conditions
 */
const getFilteredCustomActions = (moduleConfig, userRole, item) => {
  if (!moduleConfig.customActions) return [];

  return moduleConfig.customActions.filter(
    (action) =>
      hasPermission(action, moduleConfig, userRole) &&
      shouldShowAction(action, item)
  );
};

/**
 * Get icon component for an action
 */
const getActionIcon = (actionType, className = "h-4 w-4 mr-2") => {
  const IconComponent = ACTION_ICONS[actionType] || DEFAULT_ICON;
  return <IconComponent className={className} />;
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Individual action button for desktop view
 */
const DesktopActionButton = ({ action, item, onCustomAction }) => {
  const icon = getActionIcon(action.action);

  if (action.type === "link") {
    const href = action.href.replace(":id", item._id);

    return (
      <Button asChild variant="outline" size="sm" key={action.action}>
        <Link href={href}>
          {icon}
          {action.label}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      key={action.action}
      variant="outline"
      size="sm"
      onClick={() => onCustomAction(action, item)}
    >
      {icon}
      {action.label}
    </Button>
  );
};

/**
 * Individual dropdown menu item for mobile view
 */
const MobileDropdownItem = ({ action, item, onCustomAction }) => {
  const icon = getActionIcon(action.action);

  if (action.type === "link") {
    const href = action.href.replace(":id", item._id);

    return (
      <DropdownMenuItem asChild key={action.action}>
        <Link href={href}>
          {icon}
          {action.label}
        </Link>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      key={action.action}
      onClick={() => onCustomAction(action, item)}
    >
      {icon}
      {action.label}
    </DropdownMenuItem>
  );
};

/**
 * Standard edit button component
 */
const EditButton = ({ onEdit, item }) => (
  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
    <Edit className="h-4 w-4 mr-2" />
    Edit
  </Button>
);

/**
 * Standard delete button component
 */
const DeleteButton = ({ onDelete, item }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={() => onDelete(item)}
    className="text-red-600 hover:bg-red-50"
  >
    <Trash2 className="h-4 w-4 mr-2" />
    Delete
  </Button>
);

/**
 * Mobile dropdown menu trigger
 */
// const MobileDropdownTrigger = () => (
//   <Button variant="ghost" size="sm">
//     <MoreVertical className="h-4 w-4" />
//   </Button>
// );

// =============================================================================
// MAIN COMPONENT SECTIONS
// =============================================================================

/**
 * Desktop actions view - shows all buttons inline
 */
const DesktopActionsView = ({
  canEdit,
  canDelete,
  customActions,
  item,
  onEdit,
  onDelete,
  onCustomAction,
}) => (
  <div className="hidden md:flex items-center gap-2">
    {/* Edit Button */}
    {canEdit && <EditButton onEdit={onEdit} item={item} />}

    {/* Custom Action Buttons */}
    {customActions.map((action) => (
      <DesktopActionButton
        key={action.action}
        action={action}
        item={item}
        onCustomAction={onCustomAction}
      />
    ))}

    {/* Delete Button */}
    {canDelete && <DeleteButton onDelete={onDelete} item={item} />}
  </div>
);

/**
 * Mobile actions view - shows dropdown menu
 */
const MobileActionsView = ({
  canEdit,
  canDelete,
  customActions,
  item,
  onEdit,
  onDelete,
  onCustomAction,
}) => (
  <div className="md:hidden">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* <MobileDropdownTrigger /> */}
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {/* Edit Option */}
        {canEdit && (
          <DropdownMenuItem onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
        )}

        {/* Custom Actions */}
        {customActions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {customActions.map((action) => (
              <MobileDropdownItem
                key={action.action}
                action={action}
                item={item}
                onCustomAction={onCustomAction}
              />
            ))}
          </>
        )}

        {/* Delete Option */}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function UniversalActions({
  item,
  moduleConfig,
  onEdit,
  onDelete,
  onCustomAction,
}) {
  // ===========================================================================
  // HOOKS & PERMISSIONS
  // ===========================================================================

  const { user } = useAuthStore();
  const userRole = user?.role;

  // ===========================================================================
  // PERMISSION CHECKS
  // ===========================================================================

  const canEdit = moduleConfig.permissions.edit?.includes(userRole) ?? false;
  const canDelete =
    moduleConfig.permissions.delete?.includes(userRole) ?? false;

  const customActions = getFilteredCustomActions(moduleConfig, userRole, item);

  // ===========================================================================
  // RENDER
  // ===========================================================================

  return (
    <>
      <DesktopActionsView
        canEdit={canEdit}
        canDelete={canDelete}
        customActions={customActions}
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
        onCustomAction={onCustomAction}
      />

      <MobileActionsView
        canEdit={canEdit}
        canDelete={canDelete}
        customActions={customActions}
        item={item}
        onEdit={onEdit}
        onDelete={onDelete}
        onCustomAction={onCustomAction}
      />
    </>
  );
}
