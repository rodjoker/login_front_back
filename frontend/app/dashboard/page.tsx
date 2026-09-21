// app/dashboard/page.tsx - Dashboard page
"use client";

import { colors } from "@/lib/colors";
import { useDarkMode } from "@/hooks/useDarkMode";
import Button from "@/components/Button";
import Card from "@/components/Card";
import ThemeToggle from "@/components/ThemeToggle";
import Carousel from "@/components/Carousel";
import Accordion from "@/components/Accordion";
import Select from "@/components/Select";
import Modal from "@/components/Modal";
import { useEffect, useState, useCallback } from "react";
import { api, ApiError, type User } from "@/lib/api";
import { getToken, clearToken } from "@/lib/session";
import { useRouter } from "next/navigation";

const paises = [
  { value: "pe", label: "Perú" },
  { value: "ec", label: "Ecuador" },
  { value: "co", label: "Colombia", disabled: true },
];

export default function Dashboard() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"checking" | "ready" | "error">("checking");

  const loadUserData = useCallback(() => {
    const token = getToken();
    if (!token) {
      router.replace("/");
      return;
    }

    api<{ user: User }>("/auth/me", { token })
      .then((data) => {
        setUser(data.user);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 401) {
          clearToken();
          router.replace("/");
          return;
        }

        // Error de red (status 0), error de servidor (5xx) o rate limit (429)
        const message =
          err instanceof ApiError
            ? err.message
            : "No se pudo conectar con el servidor. Revisa tu conexión.";
        
        setError(message);
        setStatus("error");
      });
  }, [router]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleLogout = () => {
    clearToken();
    router.replace("/");
  };

  const handleRetry = () => {
    setStatus("checking");
    setError("");
    loadUserData();
  }

  // 1. Pantalla de carga mientras se verifica el token
  if (status === "checking") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <p style={{ color: colors.foregroundSecondary }}>Verificando sesión...</p>
      </div>
    );
  }

  // 2. Pantalla de fallo (conserva el token y permite reintentar)
  if (status === "error") {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <div className="max-w-md w-full">
          <Card variant="default">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold" style={{ color: colors.foregroundColor }}>
                Problema de conexión
              </h2>
              <div
                role="alert"
                className="p-3 rounded-md text-sm text-left"
                style={{
                  backgroundColor: colors.colorErrorLight,
                  color: colors.colorError,
                }}
              >
                {error}
              </div>
              <div className="flex justify-center space-x-3 pt-2">
                <Button variant="primary" onClick={handleRetry}>
                  Reintentar
                </Button>
                <Button variant="secondary" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // 3. Fallback de seguridad si no hay usuario cargado
  if (!user) return null;

  const stats = [
    { title: "Total Users", value: "2,847", change: "+12%", variant: "success" as const },
    { title: "Revenue", value: "$47,389", change: "+8%", variant: "success" as const },
    { title: "Orders", value: "1,247", change: "-3%", variant: "error" as const },
    { title: "Conversion Rate", value: "3.2%", change: "+1.2%", variant: "success" as const },
  ];

  const recentActivities = [
    { user: "John Doe", action: "Created a new project", time: "2 minutes ago" },
    { user: "Sarah Wilson", action: "Updated user profile", time: "15 minutes ago" },
    { user: "Mike Johnson", action: "Completed task #247", time: "1 hour ago" },
    { user: "Emily Davis", action: "Uploaded new document", time: "2 hours ago" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.backgroundSecondary }}
    >
      {/* Header */}
      <header
        className="border-b px-6 py-4"
        style={{
          backgroundColor: colors.backgroundColor,
          borderBottomColor: colors.borderColor,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: colors.foregroundColor }}
            >
              Dashboard
            </h1>
            <p style={{ color: colors.foregroundSecondary }}>
              Welcome back, {user.name}! Here&apos;s what&apos;s happening with
              your business today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
            <Button variant="secondary" size="sm">
              Settings
            </Button>
            <Button variant="primary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} variant="default">
                <div className="flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: colors.foregroundSecondary }}
                    >
                      {stat.title}
                    </p>
                    <p
                      className="text-2xl font-bold mt-2"
                      style={{ color: colors.foregroundColor }}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="text-sm font-medium"
                    style={{
                      color:
                        stat.variant === "success"
                          ? colors.colorSuccess
                          : colors.colorError,
                    }}
                  >
                    {stat.change}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Placeholder */}
            <div className="lg:col-span-2">
              <Card title="Revenue Overview">
                <div
                  className="h-64 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: colors.backgroundSecondary }}
                >
                  <div className="text-center">
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      <svg className="w-8 h-8" fill="white" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 001.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-lg font-medium"
                      style={{ color: colors.foregroundColor }}
                    >
                      Chart Component
                    </h3>
                    <p style={{ color: colors.foregroundSecondary }}>
                      Revenue chart would be displayed here
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <Card title="Recent Activity">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                        style={{ backgroundColor: colors.primaryColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.foregroundColor }}
                        >
                          {activity.user}
                        </p>
                        <p
                          className="text-sm"
                          style={{ color: colors.foregroundSecondary }}
                        >
                          {activity.action}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: colors.foregroundSecondary }}
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="primary" className="w-full">
                Create Project
              </Button>
              <Button variant="secondary" className="w-full">
                Add User
              </Button>
              <Button variant="success" className="w-full">
                Generate Report
              </Button>
              <Button variant="warning" className="w-full">
                View Analytics
              </Button>
            </div>
          </Card>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary" title="Create Project" disabled />
            <Button variant="secondary" size="sm" title="Add User" />
            <Button variant="success" title="Generate Report 2" />
            <Button variant="warning" size="lg" title="View Analytics 2" />
          </div>

          {/* Data Table */}
          <Card title="Recent Orders">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottomColor: colors.borderColor }}>
                    <th
                      className="text-left py-3 px-4 text-sm font-medium border-b"
                      style={{ color: colors.foregroundSecondary }}
                    >
                      Order ID
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-medium border-b"
                      style={{ color: colors.foregroundSecondary }}
                    >
                      Customer
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-medium border-b"
                      style={{ color: colors.foregroundSecondary }}
                    >
                      Amount
                    </th>
                    <th
                      className="text-left py-3 px-4 text-sm font-medium border-b"
                      style={{ color: colors.foregroundSecondary }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "#1001", customer: "Alice Johnson", amount: "$299.00", status: "Completed" },
                    { id: "#1002", customer: "Bob Smith", amount: "$149.00", status: "Processing" },
                    { id: "#1003", customer: "Charlie Brown", amount: "$399.00", status: "Shipped" },
                    { id: "#1004", customer: "Diana Prince", amount: "$199.00", status: "Pending" },
                  ].map((order, index) => (
                    <tr key={index}>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: colors.foregroundColor }}
                      >
                        {order.id}
                      </td>
                      <td
                        className="py-3 px-4 text-sm"
                        style={{ color: colors.foregroundColor }}
                      >
                        {order.customer}
                      </td>
                      <td
                        className="py-3 px-4 text-sm font-medium"
                        style={{ color: colors.foregroundColor }}
                      >
                        {order.amount}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor:
                              order.status === "Completed"
                                ? colors.colorSuccessLight
                                : colors.colorWarningLight,
                            color:
                              order.status === "Completed"
                                ? colors.colorSuccess
                                : colors.colorWarning,
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Carousel">
            <Carousel
              images={[
                { src: "/rodcode campus google.png", alt: "RC Campus" },
                { src: "/rodcode tecnologia y olograma.png", alt: "RC Tecnologia" },
                { src: "/rodcode_caricatura.png", alt: "RC Caricatura" },
                { src: "/rodolfo perfil formal.png", alt: "RC Perfil Formal" },
              ]}
              autoPlay
              interval={6000}
              orientation="vertical"
            />
          </Card>

          <Card title="Accordion Example">
            <Accordion
              items={[
                {
                  question: "What is your return policy?",
                  answer:
                    "Our return policy allows you to return products within 30 days of purchase. Please ensure the items are in their original condition.",
                },
                {
                  question: "How do I track my order?",
                  answer:
                    "You can track your order by logging into your account and visiting the 'Orders' section. You will find tracking information for each order.",
                },
                {
                  question: "Do you offer international shipping?",
                  answer:
                    "Yes, we offer international shipping to select countries. Shipping fees and delivery times may vary based on the destination.",
                },
              ]}
              defaultOpen={0}
            />
          </Card>

          <Card title="Select Example">
            <Select label="País" options={paises} searchable></Select>
          </Card>

          <Card title="Modal Example">
            <Button onClick={() => setModalOpen(true)}>Abrir modal</Button>

            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Eliminar usuario"
              description="Esta acción no se puede deshacer."
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={() => setModalOpen(false)}>
                    Eliminar
                  </Button>
                </>
              }
            >
              <p>¿Seguro que quieres continuar?</p>
              <div className="mt-4">
                <Select label="País" options={paises} searchable />
              </div>
            </Modal>
          </Card>
        </div>
      </main>
    </div>
  );
}