"use client";

import { ChevronRightIcon } from "./icons";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center h-14 px-6 bg-[#141217]">
      <ol className="flex items-center gap-1 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRightIcon className="w-4 h-4 text-[rgba(242,239,237,0.5)]" />
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-[#6bc1ff] hover:underline"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-[rgba(242,239,237,0.7)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

