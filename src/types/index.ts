export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  // college_id: number;
  roll_number: string;
  branch: string;
  year_of_study: number;
  is_admin: boolean;
  is_super_admin: boolean;
  is_active: boolean; // ✅ REQUIRED
  created_at?: string;
}

export interface Event {
  image_url?: string;
  id: number;
  title: string;
  description: string;
  category: string;   // ✅ ADD
  club?: string;
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
  token: string;
  access_token: string;
  token_type: string;
}

export interface EventFormData {
  title: string;
  description: string;
  category: string;   // ✅ ADD
  club?: string;
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

export interface EventMedia {
  id: number;
  event_id: number;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
}

export interface InsightEvent {
  id: number;
  title: string;
  date: string;
}

export interface EventInsights {
  demand_level: string;
  top_demographics: string[];
  similar_events: InsightEvent[];
}

export interface GlobalInsights {
  trending_events?: InsightEvent[];
  total_events_this_week?: number;
  total_registrations_today?: number;
  // Admin fields (Legacy)
  pending_users_count?: number;
  at_risk_events_count?: number;
  total_users_count?: number;

  // Admin fields (New)
  total_events_active?: number;
  total_events_past?: number;
  total_registrations_all_time?: number;
  total_registrations_this_week?: number;

  // Most Popular
  most_popular_event_title?: string;
  most_popular_event_id?: number;
  most_popular_event_count?: number;
}
