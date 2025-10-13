import { universalConfig } from "@/config/dynamicConfig";

export const generateUniversalColumns = (module) => {
  const config = universalConfig[module];
  if (!config) {
    console.error(`❌ No configuration found for module: ${module}`);
    return [];
  }

  const columns = [];

  Object.entries(config.fields).forEach(([fieldKey, fieldConfig]) => {
    if (fieldConfig.tableColumn) {
      const column = {
        accessorKey: fieldKey,
        header: fieldConfig.label,
        cell: (info) => {
          const value = info.getValue();
          
          switch (fieldConfig.type) {
            case 'textarea':
              // Long text truncate korbe
              return value ? (
                <div className="max-w-xs truncate" title={value}>
                  {value}
                </div>
              ) : "N/A";
              
            default:
              return value || "N/A";
          }
        },
      };
      
      columns.push(column);
    }
  });

  console.log(`✅ Generated ${columns.length} columns for ${module}`);
  return columns;
};