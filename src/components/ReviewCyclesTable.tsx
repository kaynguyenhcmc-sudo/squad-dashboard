"use client";

interface ReviewCycle {
  id: number;
  supervisor: string;
  completedReviews: string;
  group: string;
}

const mockData: ReviewCycle[] = [
  { id: 1, supervisor: "Tanioka, Sidney (stanioka)", completedReviews: "8/12", group: "Shift B" },
  { id: 2, supervisor: "Nelson, Gertrude (8781)", completedReviews: "4/12", group: "Shift A" },
  { id: 3, supervisor: "Carter, Darrell (5591)", completedReviews: "0 (0%)", group: "1" },
];

export default function ReviewCyclesTable() {
  return (
    <div className="flex-1">
      <div className="mb-4">
        <h3 className="text-[16px] font-medium text-[#f2efed]">Review cycles</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-2 py-0.5 bg-[#6bc1ff] text-[#141217] text-[12px] font-medium rounded">
            Current
          </span>
          <span className="text-[14px] text-[#6bc1ff]">Ongoing</span>
          <span className="text-[14px] text-[rgba(242,239,237,0.7)]">
            12/20 | 8 reviews remaining
          </span>
        </div>
      </div>

      {/* Cycle Selector */}
      <div className="mb-4">
        <label className="text-[12px] font-medium text-[rgba(242,239,237,0.7)] uppercase mb-1 block">
          Cycle
        </label>
        <select className="w-full h-10 px-3 bg-[#1c1a21] border border-[rgba(242,239,237,0.25)] rounded text-[14px] text-[#f2efed] focus:outline-none focus:border-[#6bc1ff]">
          <option>1/3/2025 - 31/3/2025</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-[rgba(242,239,237,0.15)] rounded overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-2 bg-[#1c1a21] text-[12px] font-semibold text-[rgba(242,239,237,0.5)] uppercase border-b border-[rgba(242,239,237,0.15)]">
          <span>#</span>
          <span>Supervisor</span>
          <span>Completed reviews</span>
          <span>Group</span>
        </div>

        {/* Rows */}
        {mockData.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[40px_1fr_1fr_80px] gap-4 px-4 py-4 text-[14px] text-[#f2efed] border-b border-[rgba(242,239,237,0.1)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]"
          >
            <span className="text-[rgba(242,239,237,0.5)]">{row.id}</span>
            <span>{row.supervisor}</span>
            <span>{row.completedReviews}</span>
            <span>{row.group}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

