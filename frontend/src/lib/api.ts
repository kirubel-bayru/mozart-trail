const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";

export type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

export const fetchHealth = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
};
