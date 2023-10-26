"use client";

import { ErrorPage } from "@/components/pages/error-page";
import { useUserStore } from "@/stores/user.store";
import { Role } from "@/types/user";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();
  if (user?.role !== Role.Manager && user?.role !== Role.Employee) {
    return (
      <ErrorPage
        title="Unauthorized"
        message="You must be an employee or manager to visit this page"
      />
    );
  }

  return children;
}
