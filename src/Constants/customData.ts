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
