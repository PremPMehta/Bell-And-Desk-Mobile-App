export const fullAvailability = [
  'United States',
  'United Arab Emirates',
  'Austria',
  'Australia',
  'Belgium',
  'Bulgaria',
  'Brazil',
  'Canada',
  'Switzerland',
  'Cyprus',
  'Czech Republic',
  'Germany',
  'Denmark',
  'Estonia',
  'Spain',
  'Finland',
  'France',
  'United Kingdom',
  'Greece',
  'Hong Kong',
  'Croatia',
  'Hungary',
  'Ireland',
  'Italy',
  'Japan',
  'Lithuania',
  'Luxembourg',
  'Latvia',
  'Malta',
  'Mexico',
  'Malaysia',
  'Netherlands',
  'Norway',
  'New Zealand',
  'Poland',
  'Portugal',
  'Romania',
  'Sweden',
  'Singapore',
  'Slovenia',
  'Slovakia',
  'Thailand',
];

export const limitedAvailability = [
  'Panama',
  'Argentina',
  'Bosnia & Herzegovina',
  'Bolivia',
  'Chile',
  'Colombia',
  'Costa Rica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'Ghana',
  'Guatemala',
  'Indonesia',
  'Israel',
  'India',
  'Jordan',
  'Kenya',
  'South Korea',
  'Morocco',
  'Moldova',
  'North Macedonia',
  'Nigeria',
  'Peru',
  'Philippines',
  'Pakistan',
  'Qatar',
  'Serbia',
  'Saudi Arabia',
  'El Salvador',
  'Turkey',
  'Taiwan',
  'Ukraine',
  'Uruguay',
  'Vietnam',
  'South Africa',
];

export const faqList = [
  {
    title: 'Full Availability (Stripe pre-approved countries)',
    description: 'Stripe is fully supported in the following countries:',
    countries: fullAvailability,
  },
  {
    title: 'Limited Availability (Requires Stripe cross-border approval)',
    description:
      'Stripe requires cross-border approval for the following countries:',
    countries: limitedAvailability,
  },
  {
    title:
      'How can I earn money on this platform, and what does the payout process look like?',
    description:
      'You can earn through paid courses, paid communities, memberships, and add-on content. You decide your prices, and students pay through Stripe.\n\n' +
      'Once your Stripe account is connected, payouts go straight to your bank based on Stripe’s normal payout schedule for your country.\n\n' +
      'Some Latin American countries need extra approval from Stripe before creators can connect. If your country isn’t supported yet, you’ll see a message inside the dashboard.',
  },
  {
    title: 'What tools do I get to create, teach, and grow my community?',
    description:
      'You can build structured courses, run live sessions, post updates, host discussions, and manage your full community in one place.\n\n' +
      'Students can join from mobile or desktop, and you can offer both free and paid content.\n\n' +
      'You also get tools for engagement like notifications, comments, streaming, categories, and more.',
  },
];

export const PLANS = [
  {
    id: 1,
    title: 'Community Builder',
    price: '$75',
    popular: true,
    gradient: null, // white card
  },
  {
    id: 2,
    title: 'Community Builder',
    price: '$75',
    popular: true,
    gradient: ['#ff734d', '#ff3bb5'],
  },
  {
    id: 3,
    title: 'Community Builder',
    price: '$75',
    popular: false,
    gradient: ['#17c8ff', '#007adf'],
  },
];

export const features = [
  'Includes 2 community slots',
  'All features',
  'Unlimited Members',
  'Unlimited courses',
  'Live streaming (100 minutes)',
];

export const categoryList = [
  {
    id: 1,
    value: 'Test 1',
  },
  {
    id: 2,
    value: 'Test 2',
  },
  {
    id: 3,
    value: 'Test 3',
  },
  {
    id: 4,
    value: 'Test 4',
  },
  {
    id: 5,
    value: 'Test 5',
  },
  {
    id: 6,
    value: 'Test 6',
  },
  {
    id: 7,
    value: 'Test 7',
  },
  {
    id: 8,
    value: 'Test 8',
  },
  {
    id: 9,
    value: 'Test 9',
  },
  {
    id: 10,
    value: 'Test 10',
  },
];

// Mock Data
export const MOCK_COMMUNITIES = [
  {
    id: '1',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/1/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/1/100/100' },
    tags: ['General', 'Owner'],
  },
  {
    id: '2',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/2/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/2/100/100' },
    tags: ['General', 'Owner'],
  },
  {
    id: '3',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/3/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/3/100/100' },
    tags: ['General', 'Owner'],
  },
  {
    id: '4',
    name: 'CryptoManji Academy',
    description:
      'Comunidad de criptomonedas diseñada para aquellos que buscan aprender, crecer y prosperar en el emocionante mundo de inversiones en activos digitales.',
    bannerImage: { uri: 'https://picsum.photos/seed/4/350/150' },
    logoImage: { uri: 'https://picsum.photos/seed/4/100/100' },
    tags: ['General', 'Owner'],
  },
];

export const COMMUNITY_MENU_TABS = [
  { id: 'mycommunities', title: 'My Communities' },
  { id: 'courses', title: 'Courses' },
  { id: 'livestream', title: 'Live Stream' },
  { id: 'board', title: 'Board' },
  { id: 'members', title: 'Members' },
  { id: 'about', title: 'About' },
  { id: 'settings', title: 'Settings' },
];

export const sliderData = [
  'https://picsum.photos/600/300?random=10',
  'https://picsum.photos/600/300?random=11',
  'https://picsum.photos/600/300?random=12',
];

export const categories = [
  'All',
  'Education',
  'Finance',
  'Self-Improvement',
  'Technology',
  'Health',
  'Music',
  'Food',
  'Gaming',
  'Sports',
];

export const cardData = [
  {
    id: 1,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=1',
  },
  {
    id: 2,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=2',
  },
  {
    id: 3,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=3',
  },
  {
    id: 4,
    title: 'Bell n Desk',
    category: 'Technology',
    image: 'https://picsum.photos/600/400?random=4',
  },
];

export const STEPS = [
  { id: 1, title: 'Basic Information' },
  { id: 2, title: 'Content Structure' },
  { id: 3, title: 'Review & Publish' },
];

export const TARGET_AUDIENCE_DATA = [
  { id: '1', value: 'Beginner' },
  { id: '2', value: 'Intermediate' },
  { id: '3', value: 'Advanced' },
];

export const CATEGORY_DATA = [
  // { id: '1', value: 'Technology' },
  // { id: '2', value: 'Business' },
  // { id: '3', value: 'Art' },
  { id: '1', value: 'Bitcoin, Ethereum, Altcoins' },
  { id: '2', value: 'DeFi, NFTs, Web3' },
  { id: '3', value: 'On-chain analysis & portfolio building' },
  { id: '4', value: 'Currency pairs (major, minor, exotic)' },
  { id: '5', value: 'Technical & fundamental analysis' },
  { id: '6', value: 'Risk management strategies' },
  { id: '7', value: 'Equity fundamentals & valuation' },
  { id: '8', value: 'Technical charting & price action' },
  { id: '9', value: 'Dividend & growth investing' },
  { id: '10', value: 'Options basics (calls, puts, spreads)' },
  { id: '11', value: 'Futures & hedging strategies' },
  { id: '12', value: 'Advanced Greeks & risk modeling' },
  { id: '13', value: 'Gold, silver, oil, agricultural products' },
  { id: '14', value: 'Supply-demand cycles & geopolitical factors' },
  { id: '15', value: 'Futures contracts' },
  { id: '16', value: 'S&P 500, NASDAQ, Dow Jones' },
  { id: '17', value: 'Global index tracking' },
  { id: '18', value: 'Leveraged & inverse ETFs' },
  { id: '19', value: 'Chart patterns, candlesticks, indicators' },
  { id: '20', value: 'Trend following vs. contrarian setups' },
  { id: '21', value: 'Algorithmic & automated trading' },
  { id: '22', value: 'Economic indicators & central banks' },
  { id: '23', value: 'Earnings, balance sheets, valuation models' },
  { id: '24', value: 'Global macro & intermarket analysis' },
  { id: '25', value: 'Position sizing & stop-loss rules' },
  { id: '26', value: 'Emotional discipline in trading' },
  { id: '27', value: 'Building sustainable trading systems' },
  { id: '28', value: 'Automation, prompts, agents, and AI-powered businesses' },
  {
    id: '29',
    value: 'Tokenization of real estate, art, and real-world finance',
  },
  { id: '30', value: 'On-chain governance, voting, participation' },
  {
    id: '31',
    value: 'Smart contracts, Solidity, dApps, blockchain infrastructure',
  },
  { id: '32', value: 'Taxes, fiscal reporting, crypto compliance' },
  { id: '33', value: 'Legal smart contracts, Web3 regulation' },
  { id: '34', value: 'Education' },
  { id: '35', value: 'Finance' },
  { id: '36', value: 'Business' },
  { id: '37', value: 'Self Improvement' },
  { id: '38', value: 'Fitness' },
  { id: '39', value: 'Health' },
  { id: '40', value: 'Sports' },
  { id: '41', value: 'Music' },
  { id: '42', value: 'Food' },
  { id: '43', value: 'Gaming' },
];

export const CREATE_CATEGORY_DATA = [
  { id: '1', value: 'Technology' },
  { id: '2', value: 'Business' },
  { id: '3', value: 'Finance' },
  { id: '4', value: 'Education' },
  { id: '5', value: 'Marketing' },
  { id: '6', value: 'Design' },
  { id: '7', value: 'Sales' },
  { id: '8', value: 'Consulting' },
  { id: '9', value: 'Manufacturing' },
  { id: '10', value: 'Retail' },
  { id: '11', value: 'Real Estate' },
  { id: '12', value: 'Entertainment' },
  { id: '13', value: 'Non-profit' },
  { id: '14', value: 'Government' },
  { id: '15', value: 'Fitness' },
  { id: '16', value: 'Self Improvement' },
  { id: '17', value: 'Health' },
  { id: '18', value: 'Other' },
];

export const COURSE_TYPE_DATA = [
  { id: '1', value: 'Free' },
  { id: '2', value: 'Paid' },
];

export const CONTENT_TYPE_DATA = [
  { id: '1', value: 'Video Based' },
  { id: '2', value: 'Text Based' },
];

export const MEMBER_FILTER_TABS = [
  'All',
  'Active',
  'Inactive',
  'Banned',
  'Subscribers',
  'Pending Approval',
  'Left',
];

export const MOCK_MEMBERS = [
  {
    id: '1',
    name: 'Todd Boyle',
    email: 'qufuz@mailinator.com',
    joinedDate: 'Nov 19, 2025, 05:47 PM',
    status: 'Active',
    role: 'Subscriber',
    profileImage: '',
    type: 'Free',
  },
  {
    id: '2',
    name: 'Todd Boyle',
    email: 'qufuz@mailinator.com',
    joinedDate: 'Nov 19, 2025, 05:47 PM',
    status: 'Active',
    role: 'Owner',
    profileImage: '',
    type: 'Free',
  },
  {
    id: '3',
    name: 'Jane Doe',
    email: 'jane@example.com',
    joinedDate: 'Dec 01, 2025, 10:00 AM',
    status: 'Inactive',
    role: 'Subscriber',
    profileImage: '',
    type: 'Free',
  },
  {
    id: '4',
    name: 'John Smith',
    email: 'john@example.com',
    joinedDate: 'Dec 05, 2025, 02:30 PM',
    status: 'Banned',
    role: 'Owner',
    profileImage: '',
    type: 'Free',
  },
  {
    id: '5',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    joinedDate: 'Jan 15, 2026, 09:15 AM',
    status: 'Active',
    role: 'Subscriber',
    profileImage: '',
    type: 'Free',
  },
];

export const SETTINGS_MENU_TABS = [
  'Payout',
  'Member Transactions',
  'Access Requests',
  'Subscription',
  'Coupons',
  'Billings',
  'Referrals',
  'Moderators',
];

export const MOCK_MODERATORS_DATA = [
  {
    id: '1',
    name: 'Doris Yau',
    initial: 'D',
    email: 'dorisyau16@gmail.com',
    role: 'Moderator',
    permissions: 'Courses, LiveStream, Videos, Board, Settings',
    isActive: true,
    statusLabel: 'active',
  },
  // Add more mock data if needed for testing
];

export const ADD_MODERATOR_USERS = [
  {
    id: '1',
    name: 'Aaron Rodriguez',
    email: 'emailsaaronjosue98@gmail.com',
    initial: 'A',
  },
  {
    id: '2',
    name: 'Abraham Campos',
    email: 'campos.salas.abraham@gmail.com',
    initial: 'A',
  },
  {
    id: '3',
    name: 'Adriana Brenes',
    email: 'adriana.brenes.carballo@gmail.com',
    initial: 'A',
  },
  {
    id: '4',
    name: 'Agustin Medina',
    email: 'laplazadeltrader@gmail.com',
    initial: 'Am',
  },
  {
    id: '5',
    name: 'Agustin Medina',
    email: 'serviceshakeandrink@gmail.com',
    initial: 'A',
  },
  {
    id: '6',
    name: 'Agustin Rodriguez',
    email: 'agusrodriguezp07@gmail.com',
    initial: 'A',
  },
];

export const MODERATOR_PERMISSIONS = [
  {
    title: 'Courses',
    id: 'courses',
    children: [
      { id: 'course_add', label: 'Add Course' },
      { id: 'course_edit', label: 'Edit Course' },
      // { id: 'course_update', label: 'Update Course' },
      { id: 'course_delete', label: 'Delete Course' },
      { id: 'course_view_settings', label: 'View Course Settings' },
    ],
  },
  {
    title: 'Live Stream',
    id: 'live_stream',
    children: [
      { id: 'stream_create', label: 'Create Stream' },
      { id: 'stream_edit', label: 'Edit Stream' },
      { id: 'stream_delete', label: 'Delete Stream' },
      { id: 'stream_schedule', label: 'Schedule Stream' },
      { id: 'stream_view_settings', label: 'View Stream Settings' },
    ],
  },
  {
    title: 'Videos',
    id: 'videos',
    children: [
      { id: 'video_add', label: 'Add Video' },
      { id: 'video_update', label: 'Update Video' },
      { id: 'video_delete', label: 'Delete Video' },
    ],
  },
  {
    title: 'Blog',
    id: 'blog',
    children: [
      { id: 'blog_create', label: 'Create Blog' },
      { id: 'blog_edit', label: 'Edit Blog' },
      { id: 'blog_delete', label: 'Delete Blog' },
      { id: 'blog_view_only', label: 'View Blog Only' },
    ],
  },
  {
    title: 'Board (Feed)',
    id: 'board',
    children: [
      { id: 'post_create', label: 'Create Post' },
      { id: 'post_comment', label: 'Comment' },
      { id: 'post_edit', label: 'Edit Post' },
      // { id: 'post_update', label: 'Update Post' },
      { id: 'post_delete', label: 'Delete Post' },
    ],
  },
  {
    title: 'Chat',
    id: 'chat',
    children: [
      { id: 'channel_add', label: 'Add Channel' },
      { id: 'channel_member_add', label: 'Add Member to Channel' },
      { id: 'channel_member_remove', label: 'Remove Member from Channel' },
      { id: 'channel_edit', label: 'Edit Channel' },
      // { id: 'channel_update', label: 'Update Channel' },
      { id: 'channel_delete', label: 'Delete Channel' },
    ],
  },
  {
    title: 'Settings (View-Only)',
    id: 'settings',
    children: [{ id: 'settings_view', label: 'View Settings Only' }],
  },
];

export const COMMUNITY_REFERRALS = [
  {
    id: '1',
    name: 'CryptoManji Academy',
    link: 'https://www.bellndesk.com/cryptomanji?ref=cryptomanji',
    commission: '15%',
    initial: 'C',
    logo: null,
    program: null,
  },
  {
    id: '2',
    name: 'La Plaza del Trader',
    link: 'https://www.bellndesk.com/laplazadeltrader?ref=cryptomanji',
    commission: '10%',
    initial: 'L',
    logo: 'https://picsum.photos/seed/plaza/100/100',
    program: null,
  },
  {
    id: '3',
    name: 'Next by Soren Azorian',
    link: 'https://www.bellndesk.com/sorenazorian?ref=cryptomanji',
    commission: '10%',
    initial: 'N',
    logo: 'https://picsum.photos/seed/next/100/100',
    program: null,
  },
];

export const BELLNDESK_REFERRALS = [
  {
    id: '1',
    name: 'Bell n Desk Premium',
    link: 'https://www.bellndesk.com/premium?ref=cryptomanji',
    commission: '20%',
    initial: 'B',
    program: null,
  },
  {
    id: '2',
    name: 'Grow with Bell n Desk',
    link: 'https://www.bellndesk.com/premium?ref=cryptomanji',
    commission: '20%',
    initial: 'B',
    program: 'Partner Program',
  },
];

export const ACCOUNT_SETTINGS = [
  {
    icon: 'User',
    label: 'Edit Profile',
    bgColor: '#007AFF',
    routeName: 'Profile',
  },
  { icon: 'Bell', label: 'Notifications', bgColor: '#FF9500' },
  { icon: 'Shield', label: 'Security & Privacy', bgColor: '#4CD964' },
  { icon: 'CreditCard', label: 'Payments', bgColor: '#5856D6' },
  {
    icon: 'Globe',
    label: 'Language',
    bgColor: '#FF2D55',
    routeName: 'LanguageSelection',
  },
];

export const COMMUNITY_SETTINGS = [
  {
    icon: 'Link',
    label: 'My Referral',
    bgColor: '#FF2D55',
    routeName: 'MyReferral',
  },
  { icon: 'Users', label: 'Community Management', bgColor: '#AF52DE' },
];

export const SUPPORT_SETTINGS = [
  {
    icon: 'MessageCircleQuestionMark',
    label: 'FAQ',
    bgColor: '#8E8E93',
    routeName: 'FAQ',
  },
  {
    icon: 'LifeBuoy',
    label: 'Support',
    bgColor: '#007AFF',
    routeName: 'Support',
  },
  {
    icon: 'DollarSign',
    label: 'Pricing',
    bgColor: '#34C759',
    routeName: 'ChoosePlan',
  },
  { icon: 'Info', label: 'About Us', bgColor: '#5AC8FA' },
];

export const LEGAL_SETTINGS = [
  {
    icon: 'FileText',
    label: 'Terms and Conditions',
    bgColor: '#34C759',
    routeName: 'TermsAndConditions',
  },
  {
    icon: 'Lock',
    label: 'Privacy Policy',
    bgColor: '#FF3B30',
    routeName: 'PrivacyPolicy',
  },
  {
    icon: 'Cookie',
    label: 'Cookie Policy',
    bgColor: '#FF9500',
    routeName: 'CookiePolicy',
  },
];

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
];

export const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Succeeded', value: 'succeeded' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
];

export const sortOptions = [
  { label: 'Date', value: 'createdAt' },
  { label: 'Amount', value: 'amount' },
  { label: 'Status', value: 'status' },
];

export const orderOptions = [
  { label: 'Desc', value: 'desc' },
  { label: 'Asc', value: 'asc' },
];
