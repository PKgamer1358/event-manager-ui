export interface User {
  id: number;
  email: string;
  full_name: string;
  is_admin: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  start_time: string;
  end_time: string;
  capacity: number;
  registered_count?: number;
  created_by?: number;
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  registered_at: string;
  event?: Event;
  user?: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  full_name: string;
  password: string;
  is_admin?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface EventFormData {
  title: string;
  description: string;
  venue: string;
  start_time: string;
  end_time: string;
  capacity: number;
}
