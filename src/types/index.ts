export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // college_id: number;
  roll_number: string;
  branch: string;
  year: number;
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
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  // college_id: number;
  roll_number: string;
  branch: string;
  year_of_study: number;
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

export interface College {
  id: number;
  name: string;
  code: string;
  city: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  is_active: boolean;
  created_at?: string;
}

export interface CollegeFormData {
  name: string;
  code: string;
  city: string;
  contact_email: string;
  contact_phone: string;
  website?: string;
  is_active: boolean;
}
