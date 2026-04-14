export default function Input({ label, type = "text", ...props }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        type={type}
        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />
    </div>
  );
}