import { apiRequest } from "./api";

export interface DashboardData {
  total: number;
  porStatus: Record<string, number>;
  porPrioridade: Record<string, number>;
  porCategoria: Array<{ nome: string; total: number }>;
}

export async function getDashboard() {
  return apiRequest<DashboardData>("/dashboard");
}
