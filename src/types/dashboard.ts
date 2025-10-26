export interface DashboardSeo {
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  twitter_title: string;
  twitter_description: string;
  canonical_url: string;
}

export interface DashboardHeader {
  title: string;
  subtitle: string;
}

export interface StatsCard {
  title: string;
  value: string;
  change: string;
  change_type: string;
  icon: string;
  color: string;
}

export interface Activity {
  message: string;
  timestamp: string;
  color: string;
}

export interface RecentActivity {
  title: string;
  activities: Activity[];
}

export interface NotificationItem {
  title: string;
  message: string;
  type: string;
  color: string;
}

export interface Notifications {
  title: string;
  items: NotificationItem[];
}

export interface QuickAction {
  title: string;
  icon: string;
  action: string;
  variant: string;
}

export interface QuickActions {
  title: string;
  actions: QuickAction[];
}

export interface UpcomingEvent {
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
}

export interface UpcomingEvents {
  title: string;
  events: UpcomingEvent[];
}

export interface SidebarItem {
  id: string;
  title: string;
  icon: string;
}

export interface SidebarContent {
  logo_alt: string;
  app_name: string;
  new_message_button: string;
  security_status_label: string;
  security_status_value: string;
  sidebar_items: SidebarItem[];
}

export interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isEncrypted: boolean;
  folder: string;
  to?: string;
  date?: string;
  body?: string;
}

export interface InboxContent {
  compose_button: string;
  empty_message: string;
  no_messages_in: string;
  emails: Email[];
}

export interface EmailActions {
  reply: string;
  forward: string;
  archive: string;
  delete: string;
  encrypted_badge: string;
  select_email_message: string;
}

export interface DashboardData {
  dashboard: {
    seo: DashboardSeo;
    header: DashboardHeader;
    stats_cards: StatsCard[];
    recent_activity: RecentActivity;
    notifications: Notifications;
    quick_actions: QuickActions;
    upcoming_events: UpcomingEvents;
    sidebar: SidebarContent;
    inbox: InboxContent;
    email_actions: EmailActions;
  };
}
