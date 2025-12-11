"use client";

interface ChipProps {
  label: string;
  color: string;
  onRemove?: () => void;
}

function Chip({ label, color, onRemove }: ChipProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[13px] text-[#f2efed]"
      style={{ backgroundColor: color }}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 w-4 h-4 rounded-full bg-[rgba(255,255,255,0.2)] flex items-center justify-center text-xs hover:bg-[rgba(255,255,255,0.3)]"
        >
          ×
        </button>
      )}
    </span>
  );
}

export default function ReviewResultsChart() {
  // Mock data for the chart
  const chartData = [
    { week: "Wk1", values: [8, 10, 6] },
    { week: "Wk2", values: [10, 8, 9] },
    { week: "Wk3", values: [9, 11, 7] },
    { week: "Wk4", values: [11, 9, 10] },
    { week: "End", values: [10, 8, 5] },
  ];

  return (
    <div className="flex-1">
      <div className="mb-4">
        <h3 className="text-[16px] font-medium text-[#f2efed]">
          Review results overtime
        </h3>
        <p className="text-[14px] text-[rgba(242,239,237,0.7)]">
          Selected review responses from supervisors
        </p>
      </div>

      {/* Criteria */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-semibold text-[rgba(242,239,237,0.7)] uppercase">
            Criteria:
          </span>
          <span className="text-[12px] text-[rgba(242,239,237,0.5)]">
            Most selected review results within the cycle
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap bg-[#1c1a21] border border-[rgba(242,239,237,0.25)] rounded p-2">
          <Chip label="Late Upload" color="#7c3aed" onRemove={() => {}} />
          <Chip label="Video Muted" color="#6366f1" onRemove={() => {}} />
          <Chip label="Late Camera Activation" color="#f59e0b" onRemove={() => {}} />
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[200px] mt-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[12px] text-[rgba(242,239,237,0.5)] w-6">
          <span>20</span>
          <span>15</span>
          <span>10</span>
          <span>5</span>
        </div>

        {/* Chart area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-b border-[rgba(242,239,237,0.1)]"
              />
            ))}
          </div>

          {/* SVG Chart */}
          <svg className="w-full h-[calc(100%-24px)]" viewBox="0 0 400 150" preserveAspectRatio="none">
            {/* Purple line (Late Upload) */}
            <polyline
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              points="0,75 100,50 200,60 300,40 400,50"
            />
            {/* Blue line (Video Muted) */}
            <polyline
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              points="0,50 100,75 200,40 300,60 400,75"
            />
            {/* Yellow line (Late Camera Activation) */}
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              points="0,100 100,60 200,80 300,50 400,120"
            />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between text-[12px] text-[rgba(242,239,237,0.5)] mt-2">
            <span>Wk1</span>
            <span>Wk2</span>
            <span>Wk3</span>
            <span>Wk4</span>
            <span>End</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
          <span className="text-[12px] text-[rgba(242,239,237,0.7)]">Late Upload</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
          <span className="text-[12px] text-[rgba(242,239,237,0.7)]">Video Muted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <span className="text-[12px] text-[rgba(242,239,237,0.7)]">Late Camera Activation</span>
        </div>
      </div>
    </div>
  );
}

