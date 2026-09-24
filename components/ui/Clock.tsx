"use client";

import { useEffect, useState } from "react";

type Props = { timeZone: string; className?: string };

function read(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "shortOffset",
  }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const offset = get("timeZoneName");
  // Paris is GMT+1 in winter (CET) and GMT+2 in summer (CEST).
  const zone = offset === "GMT+2" ? "CEST" : offset === "GMT+1" ? "CET" : offset;
  return { time: `${get("hour")}:${get("minute")}:${get("second")}`, zone };
}

/** Live clock for a given IANA time zone. Rendered empty on the server to avoid hydration drift. */
export function Clock({ timeZone, className }: Props) {
  const [now, setNow] = useState<{ time: string; zone: string } | null>(null);

  useEffect(() => {
    const update = () => setNow(read(timeZone));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <time className={className} dateTime={now?.time} aria-live="off" suppressHydrationWarning>
      {now ? `${now.time} ${now.zone}` : "--:--:--"}
    </time>
  );
}
