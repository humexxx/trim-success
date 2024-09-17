import React from "react";
import { useAuth } from "src/context/auth";

interface AdminContentProps {
  children: React.ReactNode;
}

const AdminContent: React.FC<AdminContentProps> = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser?.isAdmin) {
    return null;
  }

  return children;
};

export default AdminContent;