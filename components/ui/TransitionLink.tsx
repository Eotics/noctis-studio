"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, FocusEvent, MouseEvent, PointerEvent } from "react";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { stripBase } from "@/lib/site";

type Props = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & { href: string };

/**
 * Internal link that plays the page transition (or smooth-scrolls for same-page anchors).
 * Routes are prefetched on intent (hover / focus / touch): the transition itself buys the time.
 */
export function TransitionLink({ href, onClick, onPointerEnter, onFocus, target, ...rest }: Props) {
  const { navigate } = usePageTransition();
  const router = useRouter();

  const prefetch = () => {
    const url = new URL(href, window.location.href);
    if (url.origin === window.location.origin && stripBase(url.pathname) !== stripBase(window.location.pathname)) router.prefetch(url.pathname);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  return (
    <Link
      href={href}
      target={target}
      prefetch={false}
      scroll={false}
      onClick={handleClick}
      onPointerEnter={(e: PointerEvent<HTMLAnchorElement>) => {
        onPointerEnter?.(e);
        prefetch();
      }}
      onFocus={(e: FocusEvent<HTMLAnchorElement>) => {
        onFocus?.(e);
        prefetch();
      }}
      {...rest}
    />
  );
}
