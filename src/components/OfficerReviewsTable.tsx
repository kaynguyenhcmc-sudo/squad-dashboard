"use client";

interface OfficerReview {
  id: number;
  officer: string;
  badge: string;
  reviewed: number;
  pending: number;
  lateUpload: number;
  videoMuted: number;
  lateCameraActivation: number;
}

const mockData: OfficerReview[] = [
  { id: 1, officer: "Smith, John", badge: "1234", reviewed: 8, pending: 4, lateUpload: 2, videoMuted: 1, lateCameraActivation: 3 },
  { id: 2, officer: "Johnson, Mary", badge: "5678", reviewed: 10, pending: 2, lateUpload: 0, videoMuted: 2, lateCameraActivation: 1 },
  { id: 3, officer: "Williams, Robert", badge: "9012", reviewed: 6, pending: 6, lateUpload: 3, videoMuted: 0, lateCameraActivation: 2 },
  { id: 4, officer: "Brown, Patricia", badge: "3456", reviewed: 12, pending: 0, lateUpload: 1, videoMuted: 1, lateCameraActivation: 0 },
  { id: 5, officer: "Davis, Michael", badge: "7890", reviewed: 4, pending: 8, lateUpload: 4, videoMuted: 2, lateCameraActivation: 4 },
];

export default function OfficerReviewsTable() {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[16px] font-medium text-[#f2efed]">
            Officer&apos;s review results and distribution
          </h3>
          <p className="text-[14px] text-[rgba(242,239,237,0.7)]">
            Sorted review results and count from supervisors to officers
          </p>
        </div>
        <select className="w-[300px] h-10 px-3 bg-[#1c1a21] border border-[rgba(242,239,237,0.25)] rounded text-[14px] text-[#f2efed] focus:outline-none focus:border-[#6bc1ff]">
          <option>All Officers</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-[rgba(242,239,237,0.15)] rounded overflow-hidden overflow-x-auto">
        {/* Header */}
        <div className="grid grid-cols-[minmax(150px,2fr)_minmax(70px,1fr)_minmax(70px,1fr)_minmax(70px,1fr)_minmax(90px,1fr)_minmax(90px,1fr)_minmax(120px,1.5fr)] gap-4 px-4 py-2 bg-[#1c1a21] text-[12px] font-semibold text-[rgba(242,239,237,0.5)] uppercase border-b border-[rgba(242,239,237,0.15)] min-w-[700px]">
          <span>Officer</span>
          <span>Badge</span>
          <span>Reviewed</span>
          <span>Pending</span>
          <span>Late Upload</span>
          <span>Video Muted</span>
          <span>Late Camera Act.</span>
        </div>

        {/* Rows */}
        {mockData.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[minmax(150px,2fr)_minmax(70px,1fr)_minmax(70px,1fr)_minmax(70px,1fr)_minmax(90px,1fr)_minmax(90px,1fr)_minmax(120px,1.5fr)] gap-4 px-4 py-4 text-[14px] text-[#f2efed] border-b border-[rgba(242,239,237,0.1)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)] min-w-[700px]"
          >
            <span className="text-[#6bc1ff] truncate">{row.officer}</span>
            <span className="text-[rgba(242,239,237,0.7)]">{row.badge}</span>
            <span>{row.reviewed}</span>
            <span>{row.pending}</span>
            <span>{row.lateUpload}</span>
            <span>{row.videoMuted}</span>
            <span>{row.lateCameraActivation}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

