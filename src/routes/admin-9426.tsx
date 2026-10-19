import { createFileRoute } from "@tanstack/react-router";
import { AdminPanel } from "../components/AdminPanel";

export const Route = createFileRoute("/admin-9426")({
  component: AdminSecretRoute,
});

function AdminSecretRoute() {
  return <AdminPanel />;
}
