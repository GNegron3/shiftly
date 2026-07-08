export interface ProfessionalProfile {
  id: string;
  full_name: string;
  trade: string;
  workplace_name: string;
  workplace_location: string | null;
  bio: string;
  updated_at: string;
}

export interface UpdateProfilePayload {
  full_name: string;
  trade: string;
  workplace_name: string;
  workplace_location: string | null;
  bio: string;
}
