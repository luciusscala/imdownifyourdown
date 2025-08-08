import { Card } from "@/components/ui/card";
import { NavButton } from "@/components/nav-button";
import Link from "next/link";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'outline' | 'ghost';
}

interface BubbleNavProps {
  items: NavItem[];
}

export function BubbleNav({ items }: BubbleNavProps) {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/90 backdrop-blur-md border-white/20 shadow-lg shadow-black/10 rounded-full px-8 py-4">
        <div className="flex items-center gap-6">
          {items.map((item, index) => (
            <NavButton
              key={index}
              asChild
              variant={item.variant || 'default'}
              size="sm"
            >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </NavButton>
          ))}
        </div>
      </Card>
    </div>
  );
} 