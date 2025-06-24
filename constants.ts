import { AcademicCapIcon, AdjustmentsHorizontalIcon, BriefcaseIcon, ChatBubbleLeftEllipsisIcon, CogIcon, CreditCardIcon, EnvelopeIcon, HomeIcon, LifebuoyIcon, MegaphoneIcon, MoonIcon, PresentationChartLineIcon, SunIcon, UserGroupIcon, UsersIcon, VideoCameraIcon } from './components/icons/index';
import { ChartDataPoint, DemographicData, LogEntry, MainViewKey, ModuleKey, RankedListItem, RightSidebarItemType } from './types';


export interface HeaderButtonConfig {
  key: string;
  label: string;
}

export interface SubModuleSidebarConfig {
  title: string;
  actions: string[];
}

export const HEADER_MODULES: { key: ModuleKey; label: string }[] = [
  { key: ModuleKey.School, label: "School" },
  { key: ModuleKey.Student, label: "Student" },
  { key: ModuleKey.Parents, label: "Parents" },
  { key: ModuleKey.Teacher, label: "Teacher" },
  { key: ModuleKey.Marketing, label: "Marketing" },
  { key: ModuleKey.Finance, label: "finance" },
];

// Sidebar Actions for the Default "School" view (driven by HEADER_MODULES)
export const LEFT_SIDEBAR_ACTIONS: Record<ModuleKey, string[]> = {
  [ModuleKey.School]: ["Manage School Profile", "Academic Year Setup", "User Role Management", "System Health Check", "View Audit Logs"],
  [ModuleKey.Student]: ["Student Database", "Admission Forms", "Grade Submissions", "Attendance Records", "Behavioral Reports"],
  [ModuleKey.Parents]: ["Parent Communication Log", "Online Fee Payment", "Meeting Scheduler", "Access Permissions", "Support Tickets"],
  [ModuleKey.Teacher]: ["Class & Subject Setup", "Student Performance", "Resource Uploads", "Assignment Management", "Collaboration Tools"],
  [ModuleKey.Marketing]: ["New Campaign Setup", "Lead Management", "Email Marketing Tools", "Social Media Integration", "Analytics & Reporting"],
  [ModuleKey.Finance]: ["Budget Allocation", "Expense Tracking", "Payment Processing", "Financial Reporting", "Grant Management"],
  [ModuleKey.Analytics]: [],
};

// --- Configurations for Specialized Dashboard Views ---

// Analytics Dashboard
export const ANALYTICS_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "analytics-real-time", label: "Real-Time" },
  { key: "analytics-audience", label: "Audience" },
  { key: "analytics-behavior", label: "Behavior" },
  { key: "analytics-conversions", label: "Conversions" },
  { key: "analytics-custom-reports", label: "Custom Reports" },
  { key: "analytics-settings", label: "Settings" },
];
export const ANALYTICS_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "analytics-real-time": { title: "Real-Time Monitoring", actions: ["View Live Users", "Active Events Stream", "Current Traffic Sources", "Real-Time Alerts"] },
  "analytics-audience": { title: "Audience Insights", actions: ["Demographics Analysis", "Geographic Breakdown", "User Segments", "Retention Tracking"] },
  "analytics-behavior": { title: "Behavior Flow", actions: ["Content Engagement", "Page Views & Paths", "User Journey Mapping", "Exit Pages"] },
  "analytics-conversions": { title: "Conversion Tracking", actions: ["Goal Completions", "Funnel Visualization", "E-commerce Performance", "Campaign ROI"] },
  "analytics-custom-reports": { title: "Reporting Tools", actions: ["Build New Report", "Saved Reports", "Scheduled Exports", "Data API Access"] },
  "analytics-settings": { title: "Analytics Setup", actions: ["Tracking Codes", "Goal Configuration", "Data Filters", "User Permissions"] },
};

// Academics Dashboard
export const ACADEMICS_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "academics-courses", label: "Courses" },
  { key: "academics-students", label: "Students" },
  { key: "academics-grading", label: "Grading" },
  { key: "academics-attendance", label: "Attendance" },
  { key: "academics-reports", label: "Reports" },
  { key: "academics-setup", label: "Setup" },
];
export const ACADEMICS_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "academics-courses": { title: "Course Management", actions: ["View Course Catalog", "Add New Course", "Edit Course Details", "Manage Course Materials"] },
  "academics-students": { title: "Student Records", actions: ["Search Students", "View Student Profiles", "Manage Enrollments", "Track Academic History"] },
  "academics-grading": { title: "Grading & Assessment", actions: ["Enter Grades", "View Gradebook", "Manage Rubrics", "Generate Progress Reports"] },
  "academics-attendance": { title: "Attendance Tracking", actions: ["Record Daily Attendance", "View Attendance Summaries", "Manage Excused Absences", "Generate Attendance Reports"] },
  "academics-reports": { title: "Academic Reports", actions: ["Class Performance", "Student Transcripts", "Graduation Progress", "Custom Report Builder"] },
  "academics-setup": { title: "Academics Configuration", actions: ["Grading Scales", "Academic Calendar", "Term Management", "Subject Setup"] },
};

// LifeStyle Dashboard
export const LIFESTYLE_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "lifestyle-dining", label: "Dining" },
  { key: "lifestyle-booking", label: "Book Hotel & Travel" },
  { key: "lifestyle-health-gym", label: "Health & Gym" },
  { key: "lifestyle-trainers", label: "Personal Trainers" },
  { key: "lifestyle-cleaning", label: "Cleaning Services" },
  { key: "lifestyle-pet-care", label: "Pet Care" },
  { key: "lifestyle-gardening", label: "Gardening" },
  { key: "lifestyle-groceries", label: "Groceries" },
  { key: "lifestyle-home-maintenance", label: "Home Maintenance" },
];
export const LIFESTYLE_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "lifestyle-dining": {
    title: "Dining Options",
    actions: ["Restaurant Reservations", "Order Meal Delivery", "View Menus & Reviews", "Catering Requests", "Special Diet Options"]
  },
  "lifestyle-booking": {
    title: "Travel & Stays",
    actions: ["Search Hotels", "Book Flights", "Arrange Car Rentals", "View Travel Itineraries", "Manage Bookings"]
  },
  "lifestyle-health-gym": {
    title: "Health & Fitness",
    actions: ["Gym Membership", "Book Fitness Class", "View Class Schedules", "Health Checkups", "Wellness Programs"]
  },
  "lifestyle-trainers": {
    title: "Personal Training",
    actions: ["Find a Trainer", "Book Training Session", "View Trainer Profiles", "Manage Training Plan", "Track Progress"]
  },
  "lifestyle-cleaning": {
    title: "Cleaning Services",
    actions: ["Schedule Home Cleaning", "View Service Providers", "Manage Appointments", "Rate Service", "Special Requests"]
  },
  "lifestyle-pet-care": {
    title: "Pet Care Services",
    actions: ["Find Pet Sitters", "Book Grooming", "Veterinary Visits", "Pet Walking", "View Pet Profiles"]
  },
  "lifestyle-gardening": {
    title: "Gardening Services",
    actions: ["Request Landscaping", "Order Plants & Supplies", "Gardening Consultations", "Seasonal Planting Guide", "Tool Rentals"]
  },
  "lifestyle-groceries": {
    title: "Grocery Services",
    actions: ["Order Groceries Online", "View Local Store Deals", "Manage Shopping Lists", "Recipe Ingredient Finder", "Subscription Boxes"]
  },
  "lifestyle-home-maintenance": {
    title: "Home Maintenance",
    actions: ["Request Repair Service", "Find Certified Handyman", "Plumbing Appointments", "Electrical Work Quotes", "Appliance Repair"]
  },
};

// Media Dashboard
export const MEDIA_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "media-movies", label: "Movies" },
  { key: "media-series", label: "TV Series" },
  { key: "media-documentaries", label: "Documentaries" },
  { key: "media-anime", label: "Anime" },
  { key: "media-islamic", label: "Islamic" },
  { key: "media-tv", label: "Live TV" },
  { key: "media-torrent", label: "Torrent Stream" },
  { key: "media-uploads", label: "My Media" },
  { key: "media-settings", label: "Settings" },
];

export const MEDIA_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "media-movies": {
    title: "Movies Library",
    actions: [
      "Popular Movies",
      "New Releases",
      "Browse by Genre",
      "Watch History",
      "My Watchlist"
    ]
  },
  "media-series": {
    title: "TV Series",
    actions: [
      "Popular Series",
      "Latest Episodes",
      "Continue Watching",
      "My Shows",
      "Browse Series"
    ]
  },
  "media-documentaries": {
    title: "Documentaries",
    actions: [
      "Featured Docs",
      "Nature & Wildlife",
      "Science & Tech",
      "History",
      "Biography"
    ]
  },
  "media-anime": {
    title: "Anime Collection",
    actions: [
      "Popular Anime",
      "New Releases",
      "Ongoing Series",
      "Movies",
      "My Collection"
    ]
  },
  "media-islamic": {
    title: "Islamic Content",
    actions: [
      "Quran Recitations",
      "Islamic Lectures",
      "Documentary Series",
      "Children's Content",
      "Educational Programs"
    ]
  },
  "media-tv": {
    title: "Live TV",
    actions: [
      "Favorites",
      "All Channels",
      "By Type",
      "By Country"
    ]
  },
  "media-torrent": {
    title: "Torrent Stream",
    actions: [
      "Search Movies",
      "Search TV Shows",
      "Search Anime",
      "Trending Content",
      "Active Streams"
    ]
  },
  "media-uploads": {
    title: "My Media",
    actions: [
      "Upload Files",
      "My Videos",
      "Shared Media",
      "Storage Usage",
      "Download Queue"
    ]
  },
  "media-settings": {
    title: "Media Settings",
    actions: [
      "Streaming Quality",
      "Download Settings",
      "Parental Controls",
      "Language & Subtitles",
      "Integration Settings"
    ]
  },
};

// Design Dashboard
export const DESIGN_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "design-editor", label: "Editor" },
  { key: "design-branding", label: "Branding" },
  { key: "design-templates", label: "Templates" },
  { key: "design-assets", label: "Assets" },
  { key: "design-requests", label: "Requests" },
  { key: "design-guidelines", label: "Guidelines" },
  { key: "design-projects", label: "Projects" },
];
export const DESIGN_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "design-editor": { title: "Design Editor", actions: ["Create New Design", "Visual Editor", "Code Editor", "Dashboard Builder", "AI Assistant", "Export Project"] },
  "design-branding": { title: "Branding Kits", actions: ["View Brand Guidelines", "Logo Assets", "Color Palettes", "Typography Standards"] },
  "design-templates": { title: "Design Templates", actions: ["Browse Templates", "Create From Template", "My Saved Templates", "Request New Template"] },
  "design-assets": { title: "Asset Library", actions: ["Search Assets", "Icon Sets", "Stock Photography", "Illustration Library"] },
  "design-requests": { title: "Design Requests", actions: ["Submit New Request", "Track My Requests", "Request Queue", "Approval Workflow"] },
  "design-guidelines": { title: "Style Guides", actions: ["UI/UX Guidelines", "Print Design Standards", "Web Style Guide", "Accessibility Guide"] },
  "design-projects": { title: "Current Projects", actions: ["View Project Board", "My Assigned Tasks", "Project Timelines", "Completed Projects"] },
};

// Email Dashboard
export const EMAIL_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "email-campaigns", label: "Campaigns" },
  { key: "email-lists", label: "Lists" },
  { key: "email-templates", label: "Templates" },
  { key: "email-automation", label: "Automation" },
  { key: "email-stats", label: "Stats" },
  { key: "email-configure", label: "Configure" },
];
export const EMAIL_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "email-campaigns": { title: "Email Campaigns", actions: ["View All Campaigns", "Create New Campaign", "Scheduled Campaigns", "Campaign Drafts"] },
  "email-lists": { title: "Audience Lists", actions: ["Manage Lists", "Import Contacts", "Segmentation", "Subscriber Management"] },
  "email-templates": { title: "Email Templates", actions: ["Browse Templates", "Create New Template", "My Saved Templates", "Template Editor"] },
  "email-automation": { title: "Automation Workflows", actions: ["View Automations", "Create New Workflow", "Triggered Emails", "Automation Analytics"] },
  "email-stats": { title: "Campaign Statistics", actions: ["Open Rates", "Click-Through Rates", "Delivery Reports", "Engagement Over Time"] },
  "email-configure": { title: "Email Settings", actions: ["Sender Profiles", "Domain Authentication", "Unsubscribe Settings", "API Integrations"] },
};

// Contact Dashboard
export const CONTACT_HEADER_BUTTONS: HeaderButtonConfig[] = [
  { key: "contact-directory", label: "Directory" },
  { key: "contact-tickets", label: "Tickets" },
  { key: "contact-chat", label: "Chat" },
  { key: "contact-feedback", label: "Feedback" },
  { key: "contact-groups", label: "Groups" },
  { key: "contact-settings", label: "Settings" },
];
export const CONTACT_SUB_MODULE_SIDEBAR_CONFIG: Record<string, SubModuleSidebarConfig> = {
  "contact-directory": { title: "Contact Directory", actions: ["Search Contacts", "View Staff Directory", "Student Contacts", "Department Listings"] },
  "contact-tickets": { title: "Support Tickets", actions: ["My Open Tickets", "All Tickets", "Create New Ticket", "Ticket Categories"] },
  "contact-chat": { title: "Live Chat", actions: ["Start New Chat", "Chat History", "Agent Availability", "Chat Transcripts"] },
  "contact-feedback": { title: "Feedback Forms", actions: ["View Submitted Feedback", "Create Feedback Form", "Feedback Analysis", "Response Tracking"] },
  "contact-groups": { title: "Contact Groups", actions: ["Manage Groups", "Create New Group", "Group Messaging", "Member Management"] },
  "contact-settings": { title: "Communication Settings", actions: ["Notification Preferences", "Contact Methods", "Privacy Settings", "Integration Options"] },
};


export const RIGHT_SIDEBAR_ITEMS: RightSidebarItemType[] = [
  { name: "School", icon: HomeIcon, color: "text-purple-400", path: "/school", viewKey: MainViewKey.Default },
  { name: "Analytics", icon: PresentationChartLineIcon, color: "text-blue-400", path: "/analytics", viewKey: MainViewKey.Analytics },
  { name: "Academics", icon: AcademicCapIcon, color: "text-green-400", path: "/academics", viewKey: MainViewKey.Academics },
  { name: "LifeStyle", icon: LifebuoyIcon, color: "text-yellow-400", path: "/lifestyle", viewKey: MainViewKey.LifeStyle },
  { name: "Media", icon: VideoCameraIcon, color: "text-red-400", path: "/media", viewKey: MainViewKey.Media },
  { name: "Design", icon: AdjustmentsHorizontalIcon, color: "text-indigo-400", path: "/design", viewKey: MainViewKey.Design },
  { name: "Email", icon: EnvelopeIcon, color: "text-pink-400", path: "/email", viewKey: MainViewKey.Email },
  { name: "Contact", icon: ChatBubbleLeftEllipsisIcon, color: "text-teal-400", path: "/contact", viewKey: MainViewKey.Contact },
];

export const BOTTOM_DOCK_ICONS: { name: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }[] = [
  { name: "Paint Brush", icon: UsersIcon, color: "bg-red-500" },
  { name: "User", icon: UserGroupIcon, color: "bg-green-500" },
  { name: "Cloud", icon: SunIcon, color: "bg-blue-500" },
  { name: "Settings", icon: CogIcon, color: "bg-yellow-500" },
  { name: "Twitter", icon: MegaphoneIcon, color: "bg-sky-500" },
  { name: "Calculator", icon: CreditCardIcon, color: "bg-purple-500" },
  { name: "Folder", icon: BriefcaseIcon, color: "bg-orange-500" },
  { name: "Mail", icon: EnvelopeIcon, color: "bg-pink-500" },
];

export const MONTHLY_ACTIVITY_DATA: ChartDataPoint[] = [ { name: 'Jan', value: 1234 }, { name: 'Feb', value: 2234 }, { name: 'Mar', value: 1800 }, { name: 'Apr', value: 2780 }, { name: 'May', value: 1890 }, { name: 'Jun', value: 2390 }, { name: 'Jul', value: 3490 }, { name: 'Aug', value: 2000 }, { name: 'Sep', value: 2500 }, { name: 'Oct', value: 3100 }, { name: 'Nov', value: 2800 }, { name: 'Dec', value: 3000 },];
export const RANKED_LIST_DATA: RankedListItem[] = [ { id: '1', rank: 1, name: 'Project Alpha', details: 'Completed ahead of schedule', iconColor: 'text-green-400' }, { id: '2', rank: 2, name: 'Team Phoenix', details: 'Exceeded performance targets', iconColor: 'text-blue-400' }, { id: '3', rank: 3, name: 'Initiative Beta', details: 'Innovative approach', iconColor: 'text-purple-400' },];
export const RESOURCE_USAGE_DATA: ChartDataPoint[] = [ { name: 'A', value: 200 }, { name: 'B', value: 150 }, { name: 'C', value: 180 }, { name: 'D', value: 120 }, { name: 'E', value: 210 }, { name: 'F', value: 90 }, { name: 'G', value: 160 }, { name: 'H', value: 110 }, { name: 'I', value: 190 },];
export const SYSTEM_LOG_DATA: LogEntry[] = [ { id: '1', timestamp: '10:15:32', message: 'User JohnDoe logged in.' }, { id: '2', timestamp: '10:16:01', message: 'System update initiated.' }, { id: '3', timestamp: '10:18:45', message: 'New student record added.' }, { id: '4', timestamp: '10:20:11', message: 'Report generated: Monthly Attendance.' },];
export const USER_DEMOGRAPHICS_DATA: DemographicData[] = [ { category: '<18', value: 250 }, { category: '18-24', value: 1200 }, { category: '25-34', value: 2300 }, { category: '35-44', value: 1800 }, { category: '45-59', value: 950 }, { category: '60+', value: 300 },];
export const DONUT_CHART_DATA = [ { name: 'Group A', value: 400, fill: '#8884d8' }, { name: 'Group B', value: 300, fill: '#82ca9d' }, { name: 'Group C', value: 300, fill: '#ffc658' }, { name: 'Group D', value: 200, fill: '#ff8042' },];
export const MULTI_COLOR_BAR_DATA: ChartDataPoint[] = [ { name: 'Jan', value: 400, fill: '#8884d8'}, { name: 'Feb', value: 300, fill: '#82ca9d' }, { name: 'Mar', value: 600, fill: '#ffc658' }, { name: 'Apr', value: 200, fill: '#ff8042' }, { name: 'May', value: 700, fill: '#00C49F' }, { name: 'Jun', value: 500, fill: '#FFBB28' },];
export const WEATHER_ICONS = { sun: SunIcon, cloud: MoonIcon, };
export const SAMPLE_ANALYTIC_CHART_DATA: ChartDataPoint[] = [ { name: 'Metric A', value: 450 }, { name: 'Metric B', value: 620 }, { name: 'Metric C', value: 300 }, { name: 'Metric D', value: 780 }, { name: 'Metric E', value: 500 },];
export const SAMPLE_ACADEMICS_CHART_DATA: ChartDataPoint[] = [ { name: 'Course Alpha', value: 85 }, { name: 'Course Beta', value: 92 }, { name: 'Course Gamma', value: 78 }, { name: 'Course Delta', value: 88 },];
export const SAMPLE_LIFESTYLE_CHART_DATA: ChartDataPoint[] = [...SAMPLE_ANALYTIC_CHART_DATA].sort(() => 0.5 - Math.random());
export const SAMPLE_MEDIA_CHART_DATA: ChartDataPoint[] = [...SAMPLE_ACADEMICS_CHART_DATA].sort(() => 0.5 - Math.random());
export const SAMPLE_DESIGN_CHART_DATA: ChartDataPoint[] = [...SAMPLE_ANALYTIC_CHART_DATA].sort(() => 0.5 - Math.random());
export const SAMPLE_EMAIL_CHART_DATA: ChartDataPoint[] = [...SAMPLE_ACADEMICS_CHART_DATA].sort(() => 0.5 - Math.random());
export const SAMPLE_CONTACT_CHART_DATA: ChartDataPoint[] = [...SAMPLE_ANALYTIC_CHART_DATA].sort(() => 0.5 - Math.random());

// Data for LifeStyle widgets
export const DINING_DATA_PLACEHOLDER = [{ id: '1', name: 'Campus Cafe', status: 'Open', cuisine: 'Various' }];
export const TRAVEL_BOOKING_DATA_PLACEHOLDER = [{ id: '1', destination: 'City Conference', date: '2024-09-15', status: 'Confirmed' }];
export const HEALTH_GYM_DATA_PLACEHOLDER = [{ id: '1', class: 'Yoga Session', time: 'Tomorrow 10:00 AM', availability: '5 spots left' }];
export const GARDENING_DATA_PLACEHOLDER = [{ id: '1', service: 'Lawn Mowing', schedule: 'Next Tuesday' }];
export const GROCERIES_DATA_PLACEHOLDER = [{ id: '1', store: 'Campus Mart', order: '#G12345', status: 'Out for delivery' }];
export const HOME_MAINTENANCE_DATA_PLACEHOLDER = [{ id: '1', request: 'Leaky Faucet', room: 'A-101', status: 'Pending' }];
export const PERSONAL_TRAINERS_DATA_PLACEHOLDER = [{ id: '1', trainer: 'Alex Ray', specialty: 'Strength Training', availability: 'Mon, Wed, Fri' }];
export const CLEANING_SERVICES_DATA_PLACEHOLDER = [{ id: '1', service: 'Standard Home Clean', provider: 'Sparkle Cleaners', nextSlot: 'Tomorrow 2 PM' }];
export const PET_CARE_DATA_PLACEHOLDER = [{ id: '1', petName: 'Buddy', service: 'Dog Walking', time: 'Today 4 PM' }];
