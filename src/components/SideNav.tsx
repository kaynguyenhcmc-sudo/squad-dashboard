"use client";

import {
  LogoIcon,
  EvidenceIcon,
  CommunityIcon,
  PerformanceIcon,
  DevicesIcon,
  AnalyticsIcon,
  RecordsIcon,
  FususIcon,
  AirIcon,
  UserIcon,
  AdminIcon,
  ChevronRightIcon,
} from "./icons";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  hasChevron?: boolean;
}

function NavItem({ icon, label, isSelected = false, hasChevron = false }: NavItemProps) {
  return (
    <div
      className={`relative flex items-center min-h-[40px] px-5 w-full cursor-pointer group ${
        isSelected ? "shadow-md" : ""
      }`}
    >
      {isSelected && (
        <div className="absolute inset-0 right-[-8px] bg-[#fec62e] rounded-tr rounded-br shadow-lg" />
      )}
      <div className="relative flex items-center gap-2 w-full py-2">
        <div className={`w-6 h-6 ${isSelected ? "text-black" : "text-[#f2f1f3]"}`}>
          {icon}
        </div>
        <span
          className={`font-medium text-[15px] leading-5 flex-1 truncate ${
            isSelected ? "text-black" : "text-[#f2f1f3]"
          }`}
        >
          {label}
        </span>
        {hasChevron && (
          <ChevronRightIcon
            className={`w-4 h-4 ${isSelected ? "text-black" : "text-[#f2f1f3]"}`}
          />
        )}
      </div>
    </div>
  );
}

export default function SideNav() {
  return (
    <div className="flex flex-col min-h-screen sticky top-0 w-[210px] bg-[#1f1d23] shadow-[4px_0px_8px_0px_rgba(0,0,0,0.1)]">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 pt-[10px] pb-9">
        <LogoIcon className="w-[42px] h-[42px]" />
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-2 flex-1">
        <NavItem icon={<EvidenceIcon className="w-6 h-6" />} label="Evidence" />
        <NavItem icon={<CommunityIcon className="w-6 h-6" />} label="Community" />
        <NavItem
          icon={<PerformanceIcon className="w-6 h-6" />}
          label="Performance"
          isSelected={true}
          hasChevron={true}
        />
        <NavItem icon={<DevicesIcon className="w-6 h-6" />} label="Devices" />
        <NavItem icon={<AnalyticsIcon className="w-6 h-6" />} label="Analytics" />
        <NavItem icon={<RecordsIcon className="w-6 h-6" />} label="Records" />
        <NavItem icon={<FususIcon className="w-6 h-6" />} label="Fusus" />
        <NavItem icon={<AirIcon className="w-6 h-6" />} label="Air" />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-2 py-3 bg-[#1f1d23]">
        <NavItem icon={<UserIcon className="w-6 h-6" />} label="[User First Last]" />
        <NavItem icon={<AdminIcon className="w-6 h-6" />} label="Admin" />
        {/* Mode Switch */}
        <div className="flex items-center gap-1 px-5 py-5">
          <div className="w-[14px] h-2 bg-[#e6a817] rounded-full" />
          <div className="w-[6px] h-[6px] bg-[rgba(54,57,61,0.6)] rounded-full" />
        </div>
      </div>
    </div>
  );
}

