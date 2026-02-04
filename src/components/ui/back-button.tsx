'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
    className?: string;
    label?: string;
    fallbackUrl?: string;
}

export function BackButton({ className, label = 'Back', fallbackUrl }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // If we have a fallback URL and history might be empty (e.g. direct link), we use fallback
        // For simplicity in this implementation, we'll try router.back() first
        if (window.history.length > 1) {
            router.back();
        } else if (fallbackUrl) {
            router.push(fallbackUrl);
        } else {
            router.push('/'); // absolute fallback
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className={cn(
                "group flex items-center gap-1.5 px-2 -ml-2 text-muted-foreground hover:text-foreground transition-all tap-scale",
                className
            )}
        >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">{label}</span>
        </Button>
    );
}
