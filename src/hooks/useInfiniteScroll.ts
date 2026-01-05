'use client';

import { useEffect, useRef } from 'react';
import { useInView, type IntersectionOptions, type InViewHookResponse } from 'react-intersection-observer';

export type InfiniteScrollPredicateContext = {
    enabled: boolean;
    inView: boolean;
    entry: InViewHookResponse['entry'];
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
};

type UseInfiniteScrollOptions = IntersectionOptions & {
    enabled?: boolean;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    isLoadingMore?: boolean;
    onInViewChange?: (inView: boolean) => void;
    debounceMs?: number;
    cooldownMs?: number;
    loadMoreWhen?: (ctx: InfiniteScrollPredicateContext) => boolean;
    onLoadMore: () => void;
};

type UseInfiniteScrollResult = {
    sentinelRef: InViewHookResponse['ref'];
    inView: boolean;
    entry: InViewHookResponse['entry'];
    isLoadingMore: boolean;
};

export const useInfiniteScroll = (options: UseInfiniteScrollOptions): UseInfiniteScrollResult => {
    const {
        enabled = true,
        hasNextPage,
        isFetchingNextPage,
        isLoadingMore,
        onInViewChange,
        debounceMs,
        cooldownMs,
        loadMoreWhen,
        onLoadMore,
        ...intersectionOptions
    } = options;

    const lastTriggeredAtRef = useRef<number>(0);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { ref: sentinelRef, inView, entry } = useInView({
        ...intersectionOptions,
        skip: !enabled,
    });

    useEffect(() => {
        if (!onInViewChange) return;
        onInViewChange(inView);
    }, [inView, onInViewChange]);

    useEffect(() => {
        if (!enabled) return;

        const ctx: InfiniteScrollPredicateContext = {
            enabled,
            inView,
            entry,
            hasNextPage,
            isFetchingNextPage,
        };

        const shouldLoad = loadMoreWhen
            ? loadMoreWhen(ctx)
            : inView && hasNextPage !== false && !isFetchingNextPage;

        if (!shouldLoad) return;

        if (cooldownMs != null && cooldownMs > 0) {
            const now = Date.now();
            if (now - lastTriggeredAtRef.current < cooldownMs) return;
        }

        const trigger = () => {
            lastTriggeredAtRef.current = Date.now();
            onLoadMore();
        };

        if (debounceMs != null && debounceMs > 0) {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                debounceTimerRef.current = null;
                trigger();
            }, debounceMs);

            return () => {
                if (debounceTimerRef.current) {
                    clearTimeout(debounceTimerRef.current);
                    debounceTimerRef.current = null;
                }
            };
        }

        trigger();
        return;
    }, [cooldownMs, debounceMs, enabled, entry, hasNextPage, inView, isFetchingNextPage, loadMoreWhen, onLoadMore]);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
        };
    }, []);

    return {
        sentinelRef,
        inView,
        entry,
        isLoadingMore: isLoadingMore ?? !!isFetchingNextPage,
    };
};
