"use client"

interface StatusIconProps {
  isOnline: boolean;
}

export default function StatusIcon({ isOnline }: StatusIconProps) {
  return (
      <div>
        <div className="relative flex items-center justify-center">
          <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} animate-pulse`} />
          <div
            className={`absolute w-3 h-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            } opacity-20 animate-ping`}
          />
        </div>
        <span className={`text-sm font-medium ${isOnline ? "text-green-700" : "text-red-700"}`}>
        {isOnline ? "Online now" : "Offline"}
      </span>
      </div>
  );
}