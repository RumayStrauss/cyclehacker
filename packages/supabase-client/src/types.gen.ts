// Hand-authored placeholder matching supabase/migrations/20260101000000_init_schema.sql.
// Regenerate this file from the real project once one exists:
//   pnpm gen:types
// (defined in the root package.json as `supabase gen types typescript --local`).
// Keep the shape close to what that command produces so swapping it in later
// is a diff, not a rewrite.

export type FlowLevel = 'none' | 'spotting' | 'light' | 'medium' | 'heavy';
export type EntrySource = 'self' | 'partner';
export type ProfileStatus = 'active' | 'archived';
export type SymptomType =
  | 'cramps'
  | 'headache'
  | 'bloating'
  | 'fatigue'
  | 'acne'
  | 'tender_breasts'
  | 'backache'
  | 'nausea'
  | 'cravings'
  | 'insomnia'
  | 'other';
export type PartnerLinkStatus = 'pending' | 'active' | 'revoked';
export type InviteDirection = 'owner_invites_partner' | 'partner_invites_owner';
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';
export type SharingCategory =
  | 'phase_status'
  | 'flow'
  | 'symptoms'
  | 'mood'
  | 'libido'
  | 'notes'
  | 'headline_insight';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          phone?: string | null;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
        Relationships: [];
      };
      cycle_profiles: {
        Row: {
          id: string;
          name: string;
          owner_user_id: string | null;
          created_by_user_id: string;
          is_proxy: boolean;
          status: ProfileStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_user_id?: string | null;
          created_by_user_id: string;
          is_proxy?: boolean;
          status?: ProfileStatus;
        };
        Update: Partial<Database['public']['Tables']['cycle_profiles']['Insert']>;
        Relationships: [];
      };
      cycle_entries: {
        Row: {
          id: string;
          profile_id: string;
          date: string;
          flow_level: FlowLevel;
          source: EntrySource;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          date: string;
          flow_level: FlowLevel;
          source?: EntrySource;
        };
        Update: Partial<Database['public']['Tables']['cycle_entries']['Insert']>;
        Relationships: [];
      };
      symptom_logs: {
        Row: {
          id: string;
          profile_id: string;
          date: string;
          symptom_type: SymptomType;
          value: boolean;
          source: EntrySource;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          date: string;
          symptom_type: SymptomType;
          value?: boolean;
          source?: EntrySource;
        };
        Update: Partial<Database['public']['Tables']['symptom_logs']['Insert']>;
        Relationships: [];
      };
      mood_logs: {
        Row: {
          id: string;
          profile_id: string;
          date: string;
          value: number;
          source: EntrySource;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          date: string;
          value: number;
          source?: EntrySource;
        };
        Update: Partial<Database['public']['Tables']['mood_logs']['Insert']>;
        Relationships: [];
      };
      partner_links: {
        Row: {
          id: string;
          profile_id: string;
          partner_user_id: string;
          status: PartnerLinkStatus;
          invited_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          partner_user_id: string;
          status?: PartnerLinkStatus;
          invited_by: string;
        };
        Update: Partial<Database['public']['Tables']['partner_links']['Insert']>;
        Relationships: [];
      };
      sharing_settings: {
        Row: {
          id: string;
          partner_link_id: string;
          category: SharingCategory;
          enabled: boolean;
        };
        Insert: {
          id?: string;
          partner_link_id: string;
          category: SharingCategory;
          enabled?: boolean;
        };
        Update: Partial<Database['public']['Tables']['sharing_settings']['Insert']>;
        Relationships: [];
      };
      invites: {
        Row: {
          id: string;
          profile_id: string;
          token: string;
          created_by: string;
          direction: InviteDirection;
          status: InviteStatus;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          token: string;
          created_by: string;
          direction: InviteDirection;
          status?: InviteStatus;
          expires_at: string;
        };
        Update: Partial<Database['public']['Tables']['invites']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      delete_own_account: {
        Args: Record<string, never>;
        Returns: undefined;
      };
    };
  };
}
