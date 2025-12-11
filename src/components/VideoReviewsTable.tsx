"use client";

interface VideoReview {
  id: number;
  title: string;
  officer: string;
  date: string;
  duration: string;
  status: "Reviewed" | "Pending" | "In Progress";
  reviewer?: string;
}

const mockData: VideoReview[] = [
  { id: 1, title: "Traffic Stop - Highway 101", officer: "Smith, John (1234)", date: "02/15/2025", duration: "12:34", status: "Reviewed", reviewer: "Nelson, G." },
  { id: 2, title: "Domestic Disturbance Call", officer: "Johnson, Mary (5678)", date: "02/14/2025", duration: "23:45", status: "Pending" },
  { id: 3, title: "Welfare Check", officer: "Williams, Robert (9012)", date: "02/14/2025", duration: "08:12", status: "Reviewed", reviewer: "Tanioka, S." },
  { id: 4, title: "Vehicle Pursuit", officer: "Brown, Patricia (3456)", date: "02/13/2025", duration: "15:22", status: "In Progress", reviewer: "Nelson, G." },
  { id: 5, title: "Foot Patrol - Downtown", officer: "Davis, Michael (7890)", date: "02/13/2025", duration: "45:00", status: "Pending" },
  { id: 6, title: "Accident Response", officer: "Smith, John (1234)", date: "02/12/2025", duration: "18:30", status: "Reviewed", reviewer: "Carter, D." },
  { id: 7, title: "Community Event Coverage", officer: "Johnson, Mary (5678)", date: "02/12/2025", duration: "1:02:15", status: "Reviewed", reviewer: "Tanioka, S." },
  { id: 8, title: "Building Check", officer: "Williams, Robert (9012)", date: "02/11/2025", duration: "05:45", status: "Pending" },
];

function StatusBadge({ status }: { status: VideoReview["status"] }) {
  const styles = {
    Reviewed: "bg-[#22c55e] text-white",
    Pending: "bg-[rgba(242,239,237,0.2)] text-[rgba(242,239,237,0.7)]",
    "In Progress": "bg-[#f59e0b] text-[#141217]",
  };

  return (
    <span className={`px-2 py-1 rounded text-[12px] font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function VideoReviewsTable() {
  return (
    <div className="mt-8">
      <div className="mb-4">
        <h3 className="text-[16px] font-medium text-[#f2efed]">Video Reviews</h3>
        <div className="flex gap-8 mt-2">
          <div className="bg-[#1c1a21] rounded px-4 py-2">
            <p className="text-[12px] text-[rgba(242,239,237,0.5)]">Total Videos</p>
            <p className="text-[20px] font-semibold text-[#f2efed]">156</p>
          </div>
          <div className="bg-[#1c1a21] rounded px-4 py-2">
            <p className="text-[12px] text-[rgba(242,239,237,0.5)]">Reviewed</p>
            <p className="text-[20px] font-semibold text-[#22c55e]">98</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[rgba(242,239,237,0.15)] rounded overflow-hidden overflow-x-auto">
        {/* Header */}
        <div className="grid grid-cols-[minmax(200px,2fr)_minmax(150px,1.5fr)_minmax(90px,1fr)_minmax(80px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] gap-4 px-4 py-2 bg-[#1c1a21] text-[12px] font-semibold text-[rgba(242,239,237,0.5)] uppercase border-b border-[rgba(242,239,237,0.15)] min-w-[720px]">
          <span>Title</span>
          <span>Officer</span>
          <span>Date</span>
          <span>Duration</span>
          <span>Status</span>
          <span>Reviewer</span>
        </div>

        {/* Rows */}
        {mockData.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[minmax(200px,2fr)_minmax(150px,1.5fr)_minmax(90px,1fr)_minmax(80px,1fr)_minmax(100px,1fr)_minmax(100px,1fr)] gap-4 px-4 py-4 text-[14px] text-[#f2efed] border-b border-[rgba(242,239,237,0.1)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)] cursor-pointer min-w-[720px]"
          >
            <span className="text-[#6bc1ff] truncate">{row.title}</span>
            <span className="text-[rgba(242,239,237,0.7)] truncate">{row.officer}</span>
            <span className="text-[rgba(242,239,237,0.7)]">{row.date}</span>
            <span className="text-[rgba(242,239,237,0.7)]">{row.duration}</span>
            <span><StatusBadge status={row.status} /></span>
            <span className="text-[rgba(242,239,237,0.7)]">{row.reviewer || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

