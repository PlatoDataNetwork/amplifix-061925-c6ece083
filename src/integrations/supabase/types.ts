export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_credit_usage: {
        Row: {
          api_calls: number
          created_at: string
          date: string
          error_402_count: number
          failed_calls: number
          id: string
          model_used: string
          tokens_used: number
          updated_at: string
          vertical_slug: string | null
        }
        Insert: {
          api_calls?: number
          created_at?: string
          date?: string
          error_402_count?: number
          failed_calls?: number
          id?: string
          model_used: string
          tokens_used?: number
          updated_at?: string
          vertical_slug?: string | null
        }
        Update: {
          api_calls?: number
          created_at?: string
          date?: string
          error_402_count?: number
          failed_calls?: number
          id?: string
          model_used?: string
          tokens_used?: number
          updated_at?: string
          vertical_slug?: string | null
        }
        Relationships: []
      }
      ai_processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          failed_chunks: number[] | null
          id: string
          processed_chunks: number[] | null
          started_at: string
          status: string
          total_chunks: number
          updated_at: string | null
          vertical_slug: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          failed_chunks?: number[] | null
          id?: string
          processed_chunks?: number[] | null
          started_at?: string
          status?: string
          total_chunks: number
          updated_at?: string | null
          vertical_slug: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          failed_chunks?: number[] | null
          id?: string
          processed_chunks?: number[] | null
          started_at?: string
          status?: string
          total_chunks?: number
          updated_at?: string | null
          vertical_slug?: string
        }
        Relationships: []
      }
      article_backups: {
        Row: {
          article_id: string
          author: string | null
          backup_description: string | null
          backup_name: string
          content: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          post_id: number | null
          published_at: string
          title: string
          vertical_slug: string
        }
        Insert: {
          article_id: string
          author?: string | null
          backup_description?: string | null
          backup_name: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          post_id?: number | null
          published_at: string
          title: string
          vertical_slug: string
        }
        Update: {
          article_id?: string
          author?: string | null
          backup_description?: string | null
          backup_name?: string
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          post_id?: number | null
          published_at?: string
          title?: string
          vertical_slug?: string
        }
        Relationships: []
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      article_translations: {
        Row: {
          article_id: string
          created_at: string
          id: string
          language_code: string
          translated_content: string | null
          translated_excerpt: string | null
          translated_title: string
          updated_at: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          language_code: string
          translated_content?: string | null
          translated_excerpt?: string | null
          translated_title: string
          updated_at?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          language_code?: string
          translated_content?: string | null
          translated_excerpt?: string | null
          translated_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_translations_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          external_url: string | null
          id: string
          image_url: string | null
          metadata: Json | null
          post_id: number | null
          published_at: string
          read_time: string | null
          title: string
          updated_at: string | null
          vertical_slug: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          post_id?: number | null
          published_at: string
          read_time?: string | null
          title: string
          updated_at?: string | null
          vertical_slug: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          external_url?: string | null
          id?: string
          image_url?: string | null
          metadata?: Json | null
          post_id?: number | null
          published_at?: string
          read_time?: string | null
          title?: string
          updated_at?: string | null
          vertical_slug?: string
        }
        Relationships: []
      }
      backup_jobs: {
        Row: {
          backup_description: string | null
          backup_name: string
          completed_at: string | null
          completed_chunks: number[] | null
          created_at: string | null
          created_by: string | null
          current_chunk: number | null
          id: string
          paused_at: string | null
          processed_articles: number | null
          status: string
          total_articles: number
          total_chunks: number
          updated_at: string | null
          vertical_slug: string | null
        }
        Insert: {
          backup_description?: string | null
          backup_name: string
          completed_at?: string | null
          completed_chunks?: number[] | null
          created_at?: string | null
          created_by?: string | null
          current_chunk?: number | null
          id?: string
          paused_at?: string | null
          processed_articles?: number | null
          status?: string
          total_articles: number
          total_chunks: number
          updated_at?: string | null
          vertical_slug?: string | null
        }
        Update: {
          backup_description?: string | null
          backup_name?: string
          completed_at?: string | null
          completed_chunks?: number[] | null
          created_at?: string | null
          created_by?: string | null
          current_chunk?: number | null
          id?: string
          paused_at?: string | null
          processed_articles?: number | null
          status?: string
          total_articles?: number
          total_chunks?: number
          updated_at?: string | null
          vertical_slug?: string | null
        }
        Relationships: []
      }
      crm_notes: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          note: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          note: string
          profile_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          note?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      import_history: {
        Row: {
          cancelled: boolean
          completed_at: string | null
          created_at: string | null
          duration_ms: number | null
          error_count: number
          id: string
          imported_by: string | null
          imported_count: number
          metadata: Json | null
          skipped_count: number
          started_at: string
          status: string
          total_processed: number
          vertical_slug: string
        }
        Insert: {
          cancelled?: boolean
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_count?: number
          id?: string
          imported_by?: string | null
          imported_count?: number
          metadata?: Json | null
          skipped_count?: number
          started_at?: string
          status?: string
          total_processed?: number
          vertical_slug: string
        }
        Update: {
          cancelled?: boolean
          completed_at?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_count?: number
          id?: string
          imported_by?: string | null
          imported_count?: number
          metadata?: Json | null
          skipped_count?: number
          started_at?: string
          status?: string
          total_processed?: number
          vertical_slug?: string
        }
        Relationships: []
      }
      import_logs: {
        Row: {
          articles_imported: number | null
          completed_at: string | null
          error_message: string | null
          id: number
          log_details: Json | null
          schedule_id: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          articles_imported?: number | null
          completed_at?: string | null
          error_message?: string | null
          id?: number
          log_details?: Json | null
          schedule_id?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          articles_imported?: number | null
          completed_at?: string | null
          error_message?: string | null
          id?: number
          log_details?: Json | null
          schedule_id?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "import_logs_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "import_schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      import_schedules: {
        Row: {
          base_feed_url: string
          created_at: string | null
          frequency_minutes: number | null
          id: number
          is_active: boolean | null
          last_run_at: string | null
          max_pages: number | null
          name: string
          next_run_at: string | null
          vertical_slug: string
        }
        Insert: {
          base_feed_url: string
          created_at?: string | null
          frequency_minutes?: number | null
          id?: number
          is_active?: boolean | null
          last_run_at?: string | null
          max_pages?: number | null
          name: string
          next_run_at?: string | null
          vertical_slug: string
        }
        Update: {
          base_feed_url?: string
          created_at?: string | null
          frequency_minutes?: number | null
          id?: number
          is_active?: boolean | null
          last_run_at?: string | null
          max_pages?: number | null
          name?: string
          next_run_at?: string | null
          vertical_slug?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          source: string | null
          status: string
          subscribed_at: string
          updated_at: string
          vertical_slug: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string
          subscribed_at?: string
          updated_at?: string
          vertical_slug?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string
          subscribed_at?: string
          updated_at?: string
          vertical_slug?: string | null
        }
        Relationships: []
      }
      showcase_companies: {
        Row: {
          button_text: string
          company_name: string
          created_at: string | null
          description: string
          disabled: boolean
          display_order: number
          id: string
          link: string
          main_sector: string | null
          search_url: string | null
          stock_url: string | null
          subtitle: string | null
          tags: string[] | null
          thumbnail: string | null
          ticker: string | null
          type: string
          updated_at: string | null
          video_url: string | null
          website: string | null
        }
        Insert: {
          button_text?: string
          company_name: string
          created_at?: string | null
          description: string
          disabled?: boolean
          display_order?: number
          id?: string
          link: string
          main_sector?: string | null
          search_url?: string | null
          stock_url?: string | null
          subtitle?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          ticker?: string | null
          type?: string
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
        }
        Update: {
          button_text?: string
          company_name?: string
          created_at?: string | null
          description?: string
          disabled?: boolean
          display_order?: number
          id?: string
          link?: string
          main_sector?: string | null
          search_url?: string | null
          stock_url?: string | null
          subtitle?: string | null
          tags?: string[] | null
          thumbnail?: string | null
          ticker?: string | null
          type?: string
          updated_at?: string | null
          video_url?: string | null
          website?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      translations: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          language_code: string
          namespace: string
          updated_at: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          language_code: string
          namespace: string
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          language_code?: string
          namespace?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          job_title: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          job_title?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_backup_summary: {
        Args: never
        Returns: {
          article_count: number
          backup_description: string
          backup_name: string
          created_at: string
          size_bytes: number
        }[]
      }
      get_vertical_article_counts: {
        Args: never
        Returns: {
          article_count: number
          vertical_slug: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_articles: {
        Args: {
          limit_count?: number
          offset_count?: number
          search_query: string
          vertical_filter?: string
        }
        Returns: {
          excerpt: string
          id: string
          rank: number
          title: string
        }[]
      }
      should_cancel_import: {
        Args: { p_started_after: string; p_vertical_slug: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
