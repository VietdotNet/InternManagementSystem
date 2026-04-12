import { format } from "date-fns";

export function ChatMessage({ message }) {
  const isIntern = message.sender === "intern";

  return (
    <div
      className={`flex flex-col gap-1 max-w-[80%] ${isIntern ? "ml-auto items-end" : "mr-auto items-start"}`}
      data-testid={`message-${message.id}`}
    >
      <span className="text-xs text-muted-foreground px-1">{message.senderName}</span>
      <div
        className={`px-3 py-2 rounded-lg text-sm ${
          isIntern
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-gray-100 text-foreground rounded-bl-none"
        }`}
      >
        {message.content}
      </div>
      <span className="text-xs text-muted-foreground px-1">
        {format(new Date(message.createdAt), "HH:mm dd/MM")}
      </span>
    </div>
  );
}
