"use client";

import { useState, useCallback } from "react";
import SideNav from "@/components/SideNav";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageTitleRow from "@/components/PageTitleRow";
import Tabs from "@/components/Tabs";
import ButtonGroup from "@/components/ButtonGroup";
import GoalsProgress from "@/components/GoalsProgress";
import Alert from "@/components/Alert";
import ReviewResultsChart from "@/components/ReviewResultsChart";
import ReviewCyclesTable from "@/components/ReviewCyclesTable";
import OfficerReviewsTable from "@/components/OfficerReviewsTable";
import VideoReviewsTable from "@/components/VideoReviewsTable";

const breadcrumbItems = [
  { label: "Axon Police Department", href: "#" },
  { label: "Patrol Bureau", href: "#" },
  { label: "Zone A", href: "#" },
  { label: "Squad 5" },
];

export default function SquadDashboard() {
  const [isReviewButtonHighlighted, setIsReviewButtonHighlighted] = useState(false);

  // Handle click on non-interactive areas to highlight the Review button
  const handlePageClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if clicked element is the Review now button or its parent link
    const isReviewButton = target.closest('a[href="/review"]');
    
    // If not clicking on Review button, trigger highlight
    if (!isReviewButton) {
      setIsReviewButtonHighlighted(true);
      // Auto-reset after animation completes
      setTimeout(() => {
        setIsReviewButtonHighlighted(false);
      }, 1500);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-[#141217]" onClick={handlePageClick}>
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header Bar */}
        <header className="h-16 bg-[#141217] border-b border-[rgba(242,239,237,0.1)] flex items-center px-6">
          <span className="text-[20px] font-medium text-[rgba(242,239,237,0.5)]">Axon Performance</span>
        </header>

        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Title Row */}
        <div className="py-6">
          <PageTitleRow />
        </div>

        {/* Tabs */}
        <div className="px-6">
          <Tabs />
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6">
          {/* Button Group */}
          <div className="mb-6">
            <ButtonGroup />
          </div>

          {/* Goals & Progress */}
          <div className="mb-8">
            <GoalsProgress
              totalReviewed={12}
              goal={20}
              cycleStart="2/13/2023"
              cycleEnd="2/27/2023"
              isHighlighted={isReviewButtonHighlighted}
            />
          </div>

          {/* Video Review Analytics */}
          <section className="mb-8">
            <h2 className="text-[24px] font-medium text-[#f2efed] mb-4">
              Video Review Analytics
            </h2>

            {/* Alert */}
            <div className="mb-6">
              <Alert
                title="Top highlights"
                description="There's down trend of results in late upload and video muted, while there's x% uptrend in late camera activation. Supervisor Tanioka, Sidney (stanioka) is the top reviewers with x videos reviews done in y groups."
                onClose={() => {}}
              />
            </div>

            {/* Charts and Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ReviewResultsChart />
              <ReviewCyclesTable />
            </div>
          </section>

          {/* Officer Reviews */}
          <section className="mb-8">
            <OfficerReviewsTable />
          </section>

          {/* Video Reviews */}
          <section>
            <VideoReviewsTable />
          </section>
        </div>
      </div>
    </div>
  );
}

