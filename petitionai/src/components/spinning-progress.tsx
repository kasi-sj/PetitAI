export default function SpinningProgress({size=4 }: {
  size?: number
}) {
  return (
    <div className="flex items-center justify-center">
        <svg className={`animate-spin h-${size} w-${size} text-indigo-500`} viewBox="0 0 50 50">
          <circle
            className="opacity-25"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth={`${size}`}
            fill="none"
          />
          <circle 
            className="opacity-75"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth={`${size}`}
            fill="none"
            strokeDasharray="90 150"
            strokeDashoffset="0"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }
  