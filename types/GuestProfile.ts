export interface GuestProfile {
  id: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGuestProfilePayload {
  id: string;
  full_name: string;
}
