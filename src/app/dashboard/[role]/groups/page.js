import GroupManagement from "@/components/groupManagement/GroupManagement";



export default async function GroupsPage() {
  // This is now a server component - no "use client"
  return <GroupManagement />;
}