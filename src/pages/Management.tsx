import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import ManagementSidebar from '@/components/management/ManagementSidebar';
import DashboardView from '@/components/management/DashboardView';
import ArticleManagement from '@/components/admin/ArticleManagement';
import TagsManagementInline from '@/components/admin/TagsManagement';
import VerticalsManagementInline from '@/components/admin/VerticalsManagement';
import FeedsSyndicator from '@/components/admin/FeedsSyndicator';
import FeedSyncLogs from '@/components/admin/FeedSyncLogs';
import DefaultFeaturedImages from '@/components/admin/DefaultFeaturedImages';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import OGImageGenerator from '@/components/admin/OGImageGenerator';
import SocialPreviewDebugger from '@/components/admin/SocialPreviewDebugger';
import BatchImageResizer from '@/components/admin/BatchImageResizer';
import GeneralSettings from '@/components/admin/settings/GeneralSettings';
import AnalyticsSettings from '@/components/admin/settings/AnalyticsSettings';
import SitemapsSettings from '@/components/admin/settings/SitemapsSettings';
import RobotsSettings from '@/components/admin/settings/RobotsSettings';

const Management = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'articles':
        return <ArticleManagement onEditArticle={(id) => window.open(`/admin/articles/edit/${id}`, '_blank')} />;
      case 'tags':
        return <TagsManagementInline />;
      case 'verticals':
        return <VerticalsManagementInline />;
      case 'feeds':
        return <FeedsSyndicator />;
      case 'feed-logs':
        return <FeedSyncLogs />;
      case 'default-images':
        return <DefaultFeaturedImages />;
      case 'analytics-dashboard':
        return <AnalyticsDashboard />;
      case 'og-generator':
        return <OGImageGenerator />;
      case 'social-preview':
        return <SocialPreviewDebugger />;
      case 'batch-resize':
        return <BatchImageResizer />;
      case 'settings-general':
        return <GeneralSettings />;
      case 'settings-analytics':
        return <AnalyticsSettings />;
      case 'sitemaps':
        return <SitemapsSettings />;
      case 'robots':
        return <RobotsSettings />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <ManagementSidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <SidebarInset>
          <div className="p-6">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Management;
