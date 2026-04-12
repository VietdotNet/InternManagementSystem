const STORAGE_KEYS = {
  USERS: "internhub_users",
  PROGRAMS: "internhub_programs",
  TRACKS: "internhub_tracks",
};

const INITIAL_MENTORS = [
  { id: "m1", name: "Trần Duy Hưng", email: "fojiwe5204@pazard.com", role: "mentor", avatar: "TH", department: "Backend", status: "active", createdAt: "2024-01-10" },
  { id: "m2", name: "Nguyễn Quốc Việt", email: "vietnqhe172106@fpt.edu.vn", role: "mentor", avatar: "NV", department: "Frontend", status: "active", createdAt: "2024-01-12" },
  { id: "m3", name: "Khuất Duy Tiến", email: "tosabil602@duoley.com", role: "mentor", avatar: "KT", department: "Mobile", status: "active", createdAt: "2024-01-15" },
  { id: "m4", name: "Nguyen Duy Anh", email: "wanicab810@isfew.com", role: "mentor", avatar: "NA", department: "DevOps", status: "active", createdAt: "2024-02-01" },
];

const INITIAL_INTERNS = [
  { id: "i1", name: "Lê Minh Khoa", email: "leminhkhoa@gmail.com", role: "intern", avatar: "LK", programId: "p1", position: "Frontend Developer", status: "active", createdAt: "2024-03-01" },
  { id: "i2", name: "Phạm Thu Hà", email: "phamthuha@gmail.com", role: "intern", avatar: "PH", programId: "p1", position: "Backend Developer", status: "active", createdAt: "2024-03-05" },
  { id: "i3", name: "Hoàng Văn Nam", email: "hoangvannam@gmail.com", role: "intern", avatar: "HN", programId: "p2", position: "Mobile Developer", status: "active", createdAt: "2024-03-10" },
  { id: "i4", name: "Trịnh Thị Lan", email: "trinhthilan@gmail.com", role: "intern", avatar: "TL", programId: "p2", position: "UI/UX Designer", status: "inactive", createdAt: "2024-03-15" },
  { id: "i5", name: "Đỗ Quang Huy", email: "doquanghuy@gmail.com", role: "intern", avatar: "DH", programId: "p3", position: "DevOps Engineer", status: "active", createdAt: "2024-04-01" },
];

const INITIAL_PROGRAMS = [
  { id: "p1", name: "202603-JAVA", startDate: "2024-03-01", endDate: "2024-06-01", mentorIds: ["m1", "m2"], status: "active", tracks: ["Java Core", "Spring Boot", "MySQL"], createdAt: "2024-02-20" },
  { id: "p2", name: "202604-REACT", startDate: "2024-04-01", endDate: "2024-07-01", mentorIds: ["m2", "m3"], status: "active", tracks: ["React", "TypeScript", "Node.js"], createdAt: "2024-03-15" },
  { id: "p3", name: "202605-DEVOPS", startDate: "2024-05-01", endDate: "2024-08-01", mentorIds: ["m4"], status: "upcoming", tracks: ["Docker", "Kubernetes", "CI/CD"], createdAt: "2024-04-10" },
];

function getFromStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, [...INITIAL_MENTORS, ...INITIAL_INTERNS]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROGRAMS)) {
    saveToStorage(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
  }
}

initStorage();

export const store = {
  getUsers() {
    return getFromStorage(STORAGE_KEYS.USERS, [...INITIAL_MENTORS, ...INITIAL_INTERNS]);
  },
  getMentors() {
    return this.getUsers().filter((u) => u.role === "mentor");
  },
  getInterns() {
    return this.getUsers().filter((u) => u.role === "intern");
  },
  getUserById(id) {
    return this.getUsers().find((u) => u.id === id);
  },
  addUser(user) {
    const users = this.getUsers();
    const newUser = { ...user, id: `u_${Date.now()}`, avatar: user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(), createdAt: new Date().toISOString().split("T")[0] };
    saveToStorage(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },
  deleteUser(id) {
    const users = this.getUsers().filter((u) => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, users);
  },
  updateUser(id, updates) {
    const users = this.getUsers().map((u) => (u.id === id ? { ...u, ...updates } : u));
    saveToStorage(STORAGE_KEYS.USERS, users);
  },

  getPrograms() {
    return getFromStorage(STORAGE_KEYS.PROGRAMS, INITIAL_PROGRAMS);
  },
  getProgramById(id) {
    return this.getPrograms().find((p) => p.id === id);
  },
  addProgram(program) {
    const programs = this.getPrograms();
    const newProgram = { ...program, id: `p_${Date.now()}`, createdAt: new Date().toISOString().split("T")[0] };
    saveToStorage(STORAGE_KEYS.PROGRAMS, [...programs, newProgram]);
    return newProgram;
  },
  deleteProgram(id) {
    const programs = this.getPrograms().filter((p) => p.id !== id);
    saveToStorage(STORAGE_KEYS.PROGRAMS, programs);
  },
  updateProgram(id, updates) {
    const programs = this.getPrograms().map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveToStorage(STORAGE_KEYS.PROGRAMS, programs);
  },

  getStats() {
    const users = this.getUsers();
    const programs = this.getPrograms();
    return {
      totalInterns: users.filter((u) => u.role === "intern").length,
      totalMentors: users.filter((u) => u.role === "mentor").length,
      totalPrograms: programs.length,
      activePrograms: programs.filter((p) => p.status === "active").length,
      activeInterns: users.filter((u) => u.role === "intern" && u.status === "active").length,
      upcomingPrograms: programs.filter((p) => p.status === "upcoming").length,
    };
  },
};


export const mockProgram = {
  id: 1,
  code: "202603",
  name: "Intern Java - dotNET",
  startDate: "3/9/2026",
  endDate: "5/6/2026",
  status: "Ongoing",
};

export const mockTrack = {
  id: 1,
  name: "Intern .NET",
  programId: 1,
  completionPercent: 25,
};

export const mockLessons = [
  { id: 1, trackId: 1, title: "Linux", order: 1, status: "Passed", attempts: 2, maxAttempts: 3, requiresPrevious: false, canRequestReview: false },
  { id: 2, trackId: 1, title: "Git cơ bản", order: 2, status: "NotStarted", attempts: 0, maxAttempts: 3, requiresPrevious: true, canRequestReview: true },
  { id: 3, trackId: 1, title: "ASP.NET core MVC", order: 3, status: "NotStarted", attempts: 0, maxAttempts: 3, requiresPrevious: true, canRequestReview: false },
  { id: 4, trackId: 1, title: "EF core", order: 4, status: "NotStarted", attempts: 0, maxAttempts: 3, requiresPrevious: true, canRequestReview: false },
];

export const mockReviews = [
  { id: 1, lessonId: 1, lessonTitle: "Linux", trackName: "Intern .NET", attempt: 1, createdAt: "2026-03-04T10:57:00.000Z", status: "NotPassed", score: null, note: "Lần đầu thử" },
  { id: 2, lessonId: 1, lessonTitle: "Linux", trackName: "Intern .NET", attempt: 2, createdAt: "2026-03-04T10:59:00.000Z", status: "Passed", score: 8, note: "abc" },
];

