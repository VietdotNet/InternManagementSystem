export default function StatusBadge({ status }) {
  const config = {
    Passed: { bg: 'bg-green-500', text: 'text-white', label: 'Passed' },
    NotPassed: { bg: 'bg-red-500', text: 'text-white', label: 'NotPassed' },
    Pending: { bg: 'bg-yellow-500', text: 'text-white', label: 'Pending' },
    InReview: { bg: 'bg-blue-500', text: 'text-white', label: 'InReview' },
    NotStarted: { bg: 'bg-gray-500', text: 'text-white', label: 'NotStarted' },
    InProgress: { bg: 'bg-blue-400', text: 'text-white', label: 'InProgress' },
    Ongoing: { bg: 'bg-green-500', text: 'text-white', label: 'Ongoing' },
  };

  const c = config[status] || { bg: 'bg-gray-400', text: 'text-white', label: status };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}
