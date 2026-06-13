// Firebase push IDs encode their creation time (ms since epoch) in the first 8
// characters, using this 64-character ordered alphabet. Decoding it gives the
// real wall-clock time a reading was written — which is reliable even when the
// device's own `ts` field is just millis-since-boot and resets on every reboot.
const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

/** Decode a Firebase push ID to its creation time in ms since epoch, or null if it is not a valid push ID. */
export function pushIdToMs(pushId: string): number | null {
  if (!pushId || pushId.length < 8) {
    return null;
  }

  let ms = 0;
  for (let i = 0; i < 8; i += 1) {
    const index = PUSH_CHARS.indexOf(pushId.charAt(i));
    if (index === -1) {
      return null;
    }
    ms = ms * 64 + index;
  }

  return ms;
}
