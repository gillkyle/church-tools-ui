import axios, { AxiosInstance } from "axios";

// We can simplify the HOST since we're using our own API
const API_BASE = "";

export interface UserDetails {
  homeUnits: number[];
  parentUnits: number[];
  individualId: number;
  uuid: string;
}

export interface DirectoryEntry {
  uuid: string;
  name: string;
  address: string;
  members: Array<{
    name: string;
    uuid: string;
    head: boolean;
  }>;
}

export class ChurchAPI {
  private session: AxiosInstance;
  private userDetails: UserDetails | null = null;

  constructor() {
    console.log("Initializing ChurchAPI with axios instance");
    this.session = axios.create({
      baseURL: "http://localhost:8000",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add request interceptor for logging
    this.session.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method?.toUpperCase()} request to: ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.session.interceptors.response.use(
      (response) => {
        console.log(
          `Received ${response.status} response from: ${response.config.url}`
        );
        return response;
      },
      (error) => {
        console.error(
          "Response error:",
          error.response?.status,
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  async login(username: string, password: string): Promise<void> {
    try {
      const { data } = await this.session.post(`${API_BASE}/auth/login`, {
        username,
        password,
      });

      this.userDetails = data.user;
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  }

  async logout(): Promise<void> {
    try {
      await this.session.post(`${API_BASE}/auth/logout`);
      this.userDetails = null;
    } catch (error) {
      console.error("Logout failed:", error);
      throw new Error("Logout failed");
    }
  }

  async getDirectory(): Promise<DirectoryEntry[]> {
    console.log("Getting directory");
    const { data } = await this.session.get(`${API_BASE}/directory`);
    console.log(data);

    return data;
  }
}

export const api = new ChurchAPI();
