import { Link } from 'wouter';
import { mockPrograms, mockUser, getReviewRequests } from '../../../../shared/store/mockData.js';
import { ROUTES } from '../../../../shared/constants/app.js';
import StatusBadge from '../../../../shared/components/StatusBadge.jsx';

function calcCompletion(tracks) {
  let total = 0;
  let passed = 0;
  for (const track of tracks) {
    total += track.lessons.length;
    passed += track.lessons.filter((l) => l.status === 'Passed').length;
  }
  return total === 0 ? 0 : Math.round((passed / total) * 100);
}

export default function InternDashboardPage() {
  const program = mockPrograms[0];
  const reviews = getReviewRequests();
  const completion = calcCompletion(program?.tracks || []);

  const totalLessons = program.tracks.reduce((s, t) => s + t.lessons.length, 0);
  const passedLessons = program.tracks.reduce(
    (s, t) => s + t.lessons.filter((l) => l.status === 'Passed').length, 0
  );
  const pendingReviews = reviews.filter((r) => r.status === 'Pending').length;
  const passedReviews = reviews.filter((r) => r.status === 'Passed').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
        <h1 className="text-2xl font-bold mb-1">
          Xin chào, {mockUser.name}! 👋
        </h1>
        <p className="text-blue-100 text-sm">
          Tiếp tục hành trình học tập của bạn nhé.
        </p>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-100">Tiến độ lộ trình</span>
            <span className="text-sm font-bold">{completion}%</span>
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-xs text-blue-100 mt-2">
            Đã hoàn thành {passedLessons}/{totalLessons} bài học
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="📚"
          label="Tổng bài học"
          value={totalLessons}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon="✅"
          label="Đã hoàn thành"
          value={passedLessons}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon="⏳"
          label="Chờ xét duyệt"
          value={pendingReviews}
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          icon="🏆"
          label="Đã pass"
          value={passedReviews}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Program info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              [{program.code}] {program.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              📅 {program.startDate} – {program.endDate}
            </p>
          </div>
          <StatusBadge status={program.status} />
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Phần trăm hoàn thành</span>
            <span className="text-sm font-bold text-blue-600">{completion}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickAction
          href={ROUTES.TRAINING}
          icon="📋"
          title="Xem lộ trình đào tạo"
          desc="Theo dõi tiến độ và đặt lịch kiểm tra các bài học"
          color="text-blue-600 bg-blue-50"
        />
        <QuickAction
          href={ROUTES.REVIEW_REQUESTS}
          icon="🔎"
          title="Yêu cầu kiểm tra"
          desc={`Có ${reviews.length} yêu cầu kiểm tra của bạn`}
          color="text-purple-600 bg-purple-50"
        />
      </div>

      {/* Recent reviews */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Yêu cầu kiểm tra gần đây</h3>
            <Link
              href={ROUTES.REVIEW_REQUESTS}
              className="text-sm text-blue-600 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="px-6 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{r.lessonName}</p>
                  <p className="text-xs text-gray-500">{r.attemptLabel} · {r.createdAt}</p>
                </div>
                <StatusBadge status={r.status} />
                {r.score !== null && (
                  <span className="text-sm font-semibold text-gray-700">
                    {r.score}/10
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color} mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon, title, desc, color }) {
  return (
    <Link href={href} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex items-start gap-4 group">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc}</p>
        </div>
    </Link>
  );
}
