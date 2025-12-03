import CommunityAbout from '@/Screens/CommunityTabs/CommunityAbout';
import CommunityBoard from '@/Screens/CommunityTabs/CommunityBoard';
import CommunityCourses from '@/Screens/CommunityTabs/CommunityCourses';
import CommunityLiveStream from '@/Screens/CommunityTabs/CommunityLiveStream';
import CommunityMembers from '@/Screens/CommunityTabs/CommunityMembers';
import CommunitySettings from '@/Screens/CommunityTabs/CommunitySettings';
import MyCommunities from '@/Screens/MyCommunities';
import React from 'react';

// Import your tab components
// import MyCommunitiesTab from '../Tabs/MyCommunitiesTab';
// import CoursesTab from '../Tabs/CoursesTab';
// import LiveStreamTab from '../Tabs/LiveStreamTab';
// import BoardTab from '../Tabs/BoardTab';
// import MembersTab from '../Tabs/MembersTab';
// import AboutTab from '../Tabs/AboutTab';
// import SettingsTab from '../Tabs/SettingsTab';

interface Props {
  selectedTab: string;
  onScroll?: (...args: any[]) => void;
  scrollEventThrottle?: number;
}

const CommunityMenuTabsContent = ({ selectedTab, onScroll, scrollEventThrottle }: Props) => {
  const scrollProps = {
    onScroll,
    scrollEventThrottle,
  };

  switch (selectedTab) {
    // case 'mycommunities':
    //   return <MyCommunities />;
    case 'courses':
      return <CommunityCourses {...scrollProps} />;
    case 'livestream':
      return <CommunityLiveStream {...scrollProps} />;
    case 'board':
      return <CommunityBoard {...scrollProps} />;
    case 'members':
      return <CommunityMembers {...scrollProps} />;
    case 'about':
      return <CommunityAbout {...scrollProps} />;
    case 'settings':
      return <CommunitySettings {...scrollProps} />;
    default:
      return null;
  }
};

export default CommunityMenuTabsContent;
