export const APP_NAME = "InternHub";
export const APP_TAGLINE = "Hệ thống quản lý thực tập sinh";
export const APP_VERSION = "1.0.0";

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  INTERNS: "/interns",
  COMPANIES: "/companies",
  EVALUATIONS: "/evaluations",
  REPORTS: "/reports",
  SETTINGS: "/settings",
   TRAINING: '/training',
  REVIEW_REQUESTS: '/review-requests',
};

export const ROLES = {
  ADMIN: "admin",
  MENTOR: "mentor",
  INTERN: "intern",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Quản trị viên",
  [ROLES.MENTOR]: "Người hướng dẫn",
  [ROLES.INTERN]: "Thực tập sinh",
};

export const LESSON_STATUS = {
  PASSED: "Passed",
  NOT_STARTED: "NotStarted",
  IN_PROGRESS: "InProgress",
};

export const REVIEW_STATUS = {
  PENDING: 'Pending',
  PASSED: 'Passed',
  NOT_PASSED: 'NotPassed',
  IN_REVIEW: 'InReview',
};
export const PROGRAM_STATUS = {
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  UPCOMING: "Upcoming",
};

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/roadmap", label: "Training Roadmap", icon: "Map" },
  { href: "/reviews", label: "My Reviews", icon: "ListChecks" },
];

export const MOCK_INTERN = {
  id: 1,
  name: "Nguyễn Quốc Việt",
  role: "Software Intern",
  initials: "NV",
};
