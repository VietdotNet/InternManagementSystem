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


export const mockPrograms = [
  {
    id: 1,
    code: '202603',
    title: 'Intern Java - dotNET',
    status: 'Ongoing',
    startDate: '3/9/2026',
    endDate: '5/6/2026',
    mentorId: 10,
    tracks: [
      {
        id: 1,
        name: 'Intern .NET',
        icon: '🪟',
        interns: [
          { id: 2, name: 'Trần Xuân Huy', email: 'huy.tx@intern.dev', joinDate: '01/03/2026', status: 'Active' },
          { id: 3, name: 'Nguyễn Văn Nhật', email: 'nhat.nv@intern.dev', joinDate: '01/03/2026', status: 'Active' },
          { id: 4, name: 'Chu Danh Quyền', email: 'quyen.cd@intern.dev', joinDate: '24/03/2026', status: 'Active' },
          { id: 5, name: 'Nguyễn Văn Linh', email: 'linh.nv@intern.dev', joinDate: '25/03/2026', status: 'Active' },
          { id: 1, name: 'Nguyễn Quốc Việt', email: 'viet.nq@intern.dev', joinDate: '25/03/2026', status: 'Active' },
        ],
        lessons: [
          { id: 1, name: 'Linux', order: 1, prerequisiteId: null },
          { id: 2, name: 'Git cơ bản', order: 2, prerequisiteId: null },
          { id: 3, name: 'ASP.NET core MVC', order: 3, prerequisiteId: 2 },
          { id: 4, name: 'EF core', order: 4, prerequisiteId: 3 },
          { id: 5, name: 'ASP.NET core API', order: 6, prerequisiteId: 4 },
        ],
      },
      {
        id: 2,
        name: 'Intern Java',
        icon: '☕',
        interns: [
          { id: 6, name: 'Trần Khánh Huyền', email: 'huyen.tk@intern.dev', joinDate: '02/04/2026', status: 'Active' },
        ],
        lessons: [
          { id: 6, name: 'Linux', order: 1, prerequisiteId: null },
          { id: 7, name: 'Git cơ bản', order: 2, prerequisiteId: null },
          { id: 8, name: 'Java Core', order: 3, prerequisiteId: null },
          { id: 9, name: 'Spring Boot', order: 4, prerequisiteId: 8 },
        ],
      },
    ],
  },
  {
    id: 2,
    code: '202605',
    title: 'Intern React - Vue',
    status: 'Ongoing',
    startDate: '5/3/2026',
    endDate: '7/6/2026',
    mentorId: 10,
    tracks: [
      {
        id: 3,
        name: 'Intern React',
        icon: '⚛️',
        interns: [
          { id: 7, name: 'Lê Thị Mai', email: 'mai.lt@intern.dev', joinDate: '05/03/2026', status: 'Active' },
        ],
        lessons: [
          { id: 10, name: 'HTML/CSS cơ bản', order: 1, prerequisiteId: null },
          { id: 11, name: 'JavaScript ES6', order: 2, prerequisiteId: null },
          { id: 12, name: 'React Hooks', order: 3, prerequisiteId: 11 },
          { id: 13, name: 'Redux Toolkit', order: 4, prerequisiteId: 12 },
        ],
      },
    ],
  },
  {
    id: 3,
    code: '202710',
    title: 'Intern .NET - GO',
    status: 'Ongoing',
    startDate: '10/22/2026',
    endDate: '10/26/2026',
    mentorId: 10,
    tracks: [
      {
        id: 4,
        name: 'Intern .NET',
        icon: '🪟',
        interns: [
          { id: 8, name: 'Phạm Đức Hùng', email: 'hung.pd@intern.dev', joinDate: '22/10/2026', status: 'Active' },
        ],
        lessons: [
          { id: 14, name: 'C# Basics', order: 1, prerequisiteId: null },
          { id: 15, name: 'ASP.NET Core', order: 2, prerequisiteId: null },
        ],
      },
    ],
  },
  {
    id: 4,
    code: '202601',
    title: 'Intern Java - NodeJs',
    status: 'Ongoing',
    startDate: '3/20/2026',
    endDate: '4/11/2026',
    mentorId: 10,
    tracks: [
      {
        id: 5,
        name: 'Intern NodeJs',
        icon: '🟢',
        interns: [
          { id: 9, name: 'Vũ Thị Lan', email: 'lan.vt@intern.dev', joinDate: '20/03/2026', status: 'Active' },
        ],
        lessons: [
          { id: 16, name: 'Node.js Basics', order: 1, prerequisiteId: null },
          { id: 17, name: 'Express.js', order: 2, prerequisiteId: 16 },
          { id: 18, name: 'MongoDB', order: 3, prerequisiteId: null },
        ],
      },
    ],
  },
];

export const USERS = {
  intern: {
    id: 1,
    name: 'Nguyễn Quốc Việt',
    email: 'viet.nq@intern.dev',
    password: 'intern123',
    role: 'intern',
    avatar: 'NV',
    programId: 1,
  },
  mentor: {
    id: 10,
    name: 'Trần Văn Mentor',
    email: 'mentor@company.dev',
    password: 'mentor123',
    role: 'mentor',
    avatar: 'TM',
  },
};

export const mockUser = USERS.intern;
export const mockMentor = USERS.mentor;

let reviewRequests = [
  {
    id: 1,
    programId: 1,
    internId: 1,
    internName: 'Nguyễn Quốc Việt',
    trackId: 1,
    trackName: 'Intern .NET',
    lessonId: 1,
    lessonName: 'Linux',
    attempt: 2,
    attemptLabel: 'Kiểm tra lần 2',
    createdAt: '03/04/2026 10:59',
    status: 'Passed',
    score: 8,
    note: 'abc',
    mentorNotes: 'Intern đã hoàn thành tốt.',
    messages: [
      { id: 1, senderId: 10, senderName: 'Trần Văn Mentor', senderRole: 'mentor', text: 'Bạn đã hoàn thành tốt bài Linux. Chúc mừng!', time: '03/04/2026 11:05' },
      { id: 2, senderId: 1, senderName: 'Nguyễn Quốc Việt', senderRole: 'intern', text: 'Cảm ơn mentor!', time: '03/04/2026 11:10' },
    ],
  },
  {
    id: 2,
    programId: 1,
    internId: 1,
    internName: 'Nguyễn Quốc Việt',
    trackId: 1,
    trackName: 'Intern .NET',
    lessonId: 1,
    lessonName: 'Linux',
    attempt: 1,
    attemptLabel: 'Kiểm tra lần 1',
    createdAt: '03/04/2026 10:57',
    status: 'NotPassed',
    score: null,
    note: 'Chưa nắm được lệnh cơ bản',
    mentorNotes: 'Cần ôn tập thêm.',
    messages: [
      { id: 3, senderId: 10, senderName: 'Trần Văn Mentor', senderRole: 'mentor', text: 'Bạn cần ôn lại các lệnh Linux cơ bản như ls, cd, mkdir, rm, chmod...', time: '03/04/2026 11:00' },
    ],
  },
  {
    id: 3,
    programId: 1,
    internId: 6,
    internName: 'Trần Khánh Huyền',
    trackId: 2,
    trackName: 'Intern Java',
    lessonId: 7,
    lessonName: 'Git cơ bản',
    attempt: 1,
    attemptLabel: 'Kiểm tra lần 1',
    createdAt: '02/04/2026 03:58',
    status: 'Pending',
    score: null,
    note: 'Em đã ôn xong Git',
    mentorNotes: '',
    messages: [],
  },
  {
    id: 4,
    programId: 1,
    internId: 6,
    internName: 'Trần Khánh Huyền',
    trackId: 2,
    trackName: 'Intern Java',
    lessonId: 6,
    lessonName: 'Linux',
    attempt: 1,
    attemptLabel: 'Kiểm tra lần 1',
    createdAt: '02/04/2026 02:28',
    status: 'Passed',
    score: 7,
    note: '',
    mentorNotes: 'Tốt lắm!',
    messages: [],
  },
  {
    id: 5,
    programId: 1,
    internId: 2,
    internName: 'Trần Xuân Huy',
    trackId: 1,
    trackName: 'Intern .NET',
    lessonId: 1,
    lessonName: 'Linux',
    attempt: 2,
    attemptLabel: 'Kiểm tra lần 2',
    createdAt: '02/04/2026 02:23',
    status: 'Pending',
    score: null,
    note: 'Mình đã luyện tập thêm rồi',
    mentorNotes: '',
    messages: [],
  },
  {
    id: 6,
    programId: 1,
    internId: 2,
    internName: 'Trần Xuân Huy',
    trackId: 1,
    trackName: 'Intern .NET',
    lessonId: 1,
    lessonName: 'Linux',
    attempt: 1,
    attemptLabel: 'Kiểm tra lần 1',
    createdAt: '02/04/2026 02:21',
    status: 'NotPassed',
    score: null,
    note: '',
    mentorNotes: '',
    messages: [],
  },
];

let nextReviewId = 7;
let nextLessonId = 100;

export function getReviewRequests() {
  return [...reviewRequests];
}

export function getReviewRequestsByProgram(programId) {
  return reviewRequests.filter((r) => r.programId === programId);
}

export function updateReviewRequest(id, updates) {
  reviewRequests = reviewRequests.map((r) =>
    r.id === id ? { ...r, ...updates } : r
  );
  return reviewRequests.find((r) => r.id === id);
}

export function addReviewRequest(internId, internName, programId, trackId, trackName, lessonId, lessonName, note) {
  const existing = reviewRequests.filter((r) => r.internId === internId && r.lessonId === lessonId);
  const attempt = existing.length + 1;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const newReview = {
    id: nextReviewId++,
    programId,
    internId,
    internName,
    trackId,
    trackName,
    lessonId,
    lessonName,
    attempt,
    attemptLabel: `Kiểm tra lần ${attempt}`,
    createdAt: dateStr,
    status: 'Pending',
    score: null,
    note,
    mentorNotes: '',
    messages: [],
  };
  reviewRequests = [newReview, ...reviewRequests];
  return newReview;
}

export function addMessage(reviewId, text, senderRole, senderName, senderId) {
  const review = reviewRequests.find((r) => r.id === reviewId);
  if (!review) return null;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const msg = {
    id: Date.now(),
    senderId,
    senderName,
    senderRole,
    text,
    time: dateStr,
  };
  review.messages = [...review.messages, msg];
  return msg;
}

export function addLesson(trackId, programId, name, order) {
  const program = mockPrograms.find((p) => p.id === programId);
  if (!program) return null;
  const track = program.tracks.find((t) => t.id === trackId);
  if (!track) return null;
  const lesson = { id: nextLessonId++, name, order: Number(order), prerequisiteId: null };
  track.lessons = [...track.lessons, lesson].sort((a, b) => a.order - b.order);
  return lesson;
}

export function updateLesson(trackId, programId, lessonId, name, order) {
  const program = mockPrograms.find((p) => p.id === programId);
  if (!program) return null;
  const track = program.tracks.find((t) => t.id === trackId);
  if (!track) return null;
  track.lessons = track.lessons
    .map((l) => (l.id === lessonId ? { ...l, name, order: Number(order) } : l))
    .sort((a, b) => a.order - b.order);
  return track.lessons.find((l) => l.id === lessonId);
}

export function deleteLesson(trackId, programId, lessonId) {
  const program = mockPrograms.find((p) => p.id === programId);
  if (!program) return;
  const track = program.tracks.find((t) => t.id === trackId);
  if (!track) return;
  track.lessons = track.lessons.filter((l) => l.id !== lessonId);
}

export function getLessonCanRequest(lessonId, tracks) {
  for (const track of tracks) {
    const lesson = track.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      if (!lesson.prerequisiteId) return { canRequest: true };
      const prereq = track.lessons.find((l) => l.id === lesson.prerequisiteId);
      if (prereq && prereq.status === 'Passed') return { canRequest: true };
      return { canRequest: false, reason: 'Cần phải pass bài học trước' };
    }
  }
  return { canRequest: false, reason: 'Không tìm thấy bài học' };
}

export function loginUser(email, password) {
  for (const key of Object.keys(USERS)) {
    const user = USERS[key];
    if (user.email === email && user.password === password) return user;
  }
  return null;
}
