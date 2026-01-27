"use client";

import Image from 'next/image'
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

import CompanyLogoDark from '../../public/logo/medbridges-4k-black.png'
import CompanyLogoLight from '../../public/logo/medbridges-4k-white.png'

export const CompanyLogo = ({ className }: { className?: string }) => {
    const { theme } = useTheme();
    return <Image
        src={theme === 'dark' ? CompanyLogoLight : CompanyLogoDark}
        alt="MedBridges"
        className={cn("h-full w-full object-contain", className)}
        priority
    />
}