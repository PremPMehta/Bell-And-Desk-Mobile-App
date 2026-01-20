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
  'https://picsum.photos/200/300/?blur',
  'https://picsum.photos/200/300/?blur',
  'https://picsum.photos/200/300/?blur',
];

export const categories = [
  'All',
  'Design',
  'Development',
  'Marketing',
  'Sales',
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
  { id: '1', value: 'Technology' },
  { id: '2', value: 'Business' },
  { id: '3', value: 'Art' },
];

export const COURSE_TYPE_DATA = [
  { id: '1', value: 'Free' },
  { id: '2', value: 'Paid' },
];

export const MEMBER_FILTER_TABS = [
  'All',
  'Active',
  'Inactive',
  'Banned',
  'Subscribers',
  'Pending Approval',
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
      { id: 'course_update', label: 'Update Course' },
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
    title: 'Board (Feed)',
    id: 'board',
    children: [
      { id: 'post_create', label: 'Create Post' },
      { id: 'post_comment', label: 'Comment' },
      { id: 'post_edit', label: 'Edit Post' },
      { id: 'post_update', label: 'Update Post' },
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
      { id: 'channel_update', label: 'Update Channel' },
      { id: 'channel_delete', label: 'Delete Channel' },
    ],
  },
  {
    title: 'Settings (View-Only)',
    id: 'settings',
    children: [{ id: 'settings_view', label: 'View Settings Only' }],
  },
];
