'use client';

import { StaggerDiv, StaggerDivItem } from '@/lib/components/motion';

interface Card {
  href: string;
  title: string;
  description: string;
}

export default function DashboardGrid({ cards }: { cards: Card[] }) {
  return (
    <StaggerDiv className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <StaggerDivItem key={card.href}>
          <a
            href={card.href}
            className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition flex flex-col gap-2 h-full"
          >
            <h3 className="font-semibold text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-500">{card.description}</p>
            <span className="text-indigo-600 text-sm font-medium mt-auto">Go →</span>
          </a>
        </StaggerDivItem>
      ))}
    </StaggerDiv>
  );
}
