"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function GTMPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url =
            pathname + (searchParams.toString() ? `?${searchParams}` : "");

        window.dataLayer?.push({
            event: "pageview",
            page: url,
        });
    }, [pathname, searchParams]);

    return null;
}
