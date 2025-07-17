// Types for our API entities
export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: "user" | "guide" | "lead-guide" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Tour {
  _id: string;
  name: string;
  slug: string;
  duration: number;
  maxGroupSize: number;
  difficulty: "easy" | "medium" | "difficult";
  ratingsAverage: number;
  ratingsQuantity: number;
  price: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  startLocation: {
    type: "Point";
    coordinates: number[];
    address: string;
    description: string;
  };
  locations: Array<{
    type: "Point";
    coordinates: number[];
    address: string;
    description: string;
    day: number;
  }>;
  guides: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  review: string;
  rating: number;
  createdAt: string;
  tour: Tour;
  user: User;
}

export interface Booking {
  _id: string;
  tour: Tour;
  user: User;
  price: number;
  createdAt: string;
  paid: boolean;
}

// API Response types
interface ApiResponse<T> {
  status: string;
  data: T;
}

interface ApiError {
  status: string;
  message: string;
}

// Environment configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = "Request failed";
      try {
        const errorData: ApiError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }

  // Auth endpoints
  async login(
    email: string,
    password: string
  ): Promise<{ status: string; token: string; data: { user: User } }> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<{
      status: string;
      token: string;
      data: { user: User };
    }>(response);
  }

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }): Promise<{ status: string; token: string; data: { user: User } }> {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse<{
      status: string;
      token: string;
      data: { user: User };
    }>(response);
  }

  async updateUserData(userData: {
    name?: string;
    email?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/users/updateMe`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse<ApiResponse<{ user: User }>>(response);
  }

  async updatePassword(passwordData: {
    passwordCurrent: string;
    password: string;
    passwordConfirm: string;
  }): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/users/updateMyPassword`, {
      method: "PATCH",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData),
    });
    return this.handleResponse<ApiResponse<{ user: User }>>(response);
  }

  // Tour endpoints
  async getTours(): Promise<ApiResponse<Tour[]>> {
    const response = await fetch(`${API_BASE_URL}/tours`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ApiResponse<Tour[]>>(response);
  }

  async getTour(slug: string): Promise<ApiResponse<Tour>> {
    const response = await fetch(`${API_BASE_URL}/tours/${slug}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ApiResponse<Tour>>(response);
  }

  async createReview(
    tourId: string,
    reviewData: { review: string; rating: number }
  ): Promise<ApiResponse<Review>> {
    const response = await fetch(`${API_BASE_URL}/tours/${tourId}/reviews`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return this.handleResponse<ApiResponse<Review>>(response);
  }

  // Booking endpoints
  async createBooking(
    tourId: string,
    bookingData: { price: number }
  ): Promise<ApiResponse<Booking>> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ tour: tourId, ...bookingData }),
    });
    return this.handleResponse<ApiResponse<Booking>>(response);
  }

  async getMyBookings(): Promise<ApiResponse<Booking[]>> {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ApiResponse<Booking[]>>(response);
  }

  // User endpoints
  async getMe(): Promise<ApiResponse<{ data: User }>> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<ApiResponse<{ data: User }>>(response);
  }

  // Upload endpoints
  async uploadPhoto(formData: FormData): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_BASE_URL}/users/updateMe`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });
    return this.handleResponse<ApiResponse<{ user: User }>>(response);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export const apiService = new ApiService();
export default apiService;
