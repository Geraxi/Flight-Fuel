// API utility functions for making authenticated requests with Clerk

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };

  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Profile API
export const profileApi = {
  get: () => apiRequest<any>("/api/profile"),
  create: (data: any) => apiRequest<any>("/api/profile", { method: "POST", body: JSON.stringify(data) }),
  update: (data: any) => apiRequest<any>("/api/profile", { method: "PUT", body: JSON.stringify(data) }),
};

// Flights API
export const flightsApi = {
  getAll: () => apiRequest<any[]>("/api/flights"),
  create: (data: any) => apiRequest<any>("/api/flights", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/flights/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/flights/${id}`, { method: "DELETE" }),
  deleteByDate: (date: string) => apiRequest<void>(`/api/flights/date/${date}`, { method: "DELETE" }),
};

// Nutrition API
export const nutritionApi = {
  getAll: () => apiRequest<any[]>("/api/nutrition"),
  getByDate: (date: string) => apiRequest<any[]>(`/api/nutrition?date=${date}`),
  create: (data: any) => apiRequest<any>("/api/nutrition", { method: "POST", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/nutrition/${id}`, { method: "DELETE" }),
};

// Training API
export const trainingApi = {
  getAll: () => apiRequest<any[]>("/api/training"),
  getByDate: (date: string) => apiRequest<any[]>(`/api/training?date=${date}`),
  create: (data: any) => apiRequest<any>("/api/training", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiRequest<any>(`/api/training/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest<void>(`/api/training/${id}`, { method: "DELETE" }),
};

// Checklists API
export const checklistsApi = {
  getByDate: (date: string) => apiRequest<any[]>(`/api/checklists/${date}`),
  create: (data: any) => apiRequest<any>("/api/checklists", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, status: string, value?: string) => 
    apiRequest<any>(`/api/checklists/${id}`, { method: "PUT", body: JSON.stringify({ status, value }) }),
};
