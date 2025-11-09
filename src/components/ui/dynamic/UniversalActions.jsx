"use client";

import { navItems } from "@/app/dashboard/constants/NavItems";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { Ban, Edit, MoreVertical, Play, Trash2 } from "lucide-react";
import React from "react";

// --- Icon Map ---
// Config-er 'action' name-ke icon-er shathe map kore
// Eti config-take simple JSON rakhe
const actionIcons = {
  start: <Play className="h-4 w-4" />,
  cancel: <Ban className="h-4 w-4" />,
  // Ekhane notun action add kora jabe
};

const defaultIcon = <Play className="h-4 w-4" />; // Default fallback icon

/**
 * Renders all available actions (Edit, Delete, Custom) for a table row.
 * Ekhon 'moduleConfig' porey dynamically custom action render kore.
 */
export default function UniversalActions({
  item,
  moduleConfig, // ✅ Prop grohon (receive) korche
  onEdit,
  onDelete,
  onCustomAction, // ✅ Prop grohon (receive) korche
}) {
  const { user } = useAuthStore();
  const userRole = user?.role; // e.g., 'admin' (String)

  // --- 1. Standard Permission Check ---
  // ✅ Logic update kora hoyeche 'user.role' (string)-er jonno
  const canEdit = moduleConfig.permissions.edit?.includes(userRole) ?? false;
  const canDelete =
    moduleConfig.permissions.delete?.includes(userRole) ?? false;

  // --- 2. Custom Action-er List To-ri ---
  const customActionsToRender =
    moduleConfig.customActions
      ?.map((action) => {
        // 2a. Permission check
        const hasPermission =
          action.action && moduleConfig.permissions[action.action]
            ? moduleConfig.permissions[action.action].includes(userRole)
            : true; // Jodi permission set na thake, show koro

        if (!hasPermission) return null;

        // 2b. Condition check (e.g., shudhu "scheduled" holei "Start" button dekhabe)
        if (action.showWhen) {
          const { field, value } = action.showWhen;
          const fieldValue = item[field]; // item theke status check

          if (fieldValue !== value) {
            return null; // Condition match koreni, button dekha-be na
          }
        }

        return action; // Ei action-ta render kora jabe
      })
      .filter(Boolean) ?? []; // Shob null bad diye final list

  return (
    <>
      {/* --- DESKTOP: Full Buttons --- */}
      <div className="hidden md:flex items-center gap-2">
        {/* Edit Button */}
        {canEdit && (
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}

        {/* ✅ NOTUN: Custom Action Button Render */}
        {customActionsToRender.map((action) => (

          <Button
            key={action.action}
            variant="outline"
            size="sm"
            onClick={() => onCustomAction(action, item)} // Event pass kore parent-ke
          >
            {console.log(
              "action and items ",action,item
            )}
            {React.cloneElement(actionIcons[action.action] || defaultIcon, {
              className: "h-4 w-4 mr-2",
            })}
            {action.label}
          </Button>
        ))}

        {/* Delete Button */}
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(item)}
            className="text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>

      {/* --- MOBILE: Dropdown Menu --- */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* Edit Item */}
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}

            {/* ✅ NOTUN: Custom Action Menu Item Render */}
            {customActionsToRender.length > 0 && (
              <>
                <DropdownMenuSeparator />
                {customActionsToRender.map((action) => (
                  <DropdownMenuItem
                    key={action.action}
                    onClick={() => onCustomAction(action, item)}
                  >
                    {React.cloneElement(
                      actionIcons[action.action] || defaultIcon,
                      {
                        className: "h-4 w-4 mr-2",
                      }
                    )}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {/* Delete Item */}
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
    </>
  );
}
