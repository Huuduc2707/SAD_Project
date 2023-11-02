"use client";

import { ErrorPage } from "@/components/pages/error-page";
import { useUserStore } from "@/stores/user.store";
import { Role } from "@/types/user";

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUserStore();

  if (user?.role !== Role.Manager) {
    return (
      <ErrorPage
        title="Unauthorized"
        message="You must be a manager to visit this page"
      />
    );
  }

  return children;
}
