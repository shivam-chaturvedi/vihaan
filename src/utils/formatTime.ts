/** Convert device ts to ms: if ts looks like Unix ms (>= 1e12), use as-is; else treat as seconds */
function toMs(ts: number): number {
  return ts >= 1e12 ? ts : ts * 1000;
}

/**
 * When device sends seconds-since-boot (small ts), pass referenceTs (e.g. latest reading ts)
 * so we map device time to system time: referenceTs = "now", others shown in real local time.
 */
function getDisplayMs(ts: number, referenceTs?: number | null): number {
  if (referenceTs != null && ts < 1e12) {
    const offset = Date.now() - toMs(referenceTs);
    return toMs(ts) + offset;
  }
  return toMs(ts);
}

/** Relative time: "just now", "5 minutes ago". Use referenceTs when ts is device seconds-since-boot. */
export function formatTime(ts: number, referenceTs?: number | null): string {
  const displayMs = getDisplayMs(ts, referenceTs);
  const diff = Date.now() - displayMs;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return new Date(displayMs).toLocaleString();
  }
}

/** Full date/time in local format. Use referenceTs when device sends seconds-since-boot. */
export function formatDateTime(ts: number, referenceTs?: number | null): string {
  const displayMs = getDisplayMs(ts, referenceTs);
  return new Date(displayMs).toLocaleString();
}

/** Get display timestamp in ms for charts/export. Use referenceTs when device sends seconds-since-boot. */
export function getDisplayTimestampMs(ts: number, referenceTs?: number | null): number {
  return getDisplayMs(ts, referenceTs);
}
