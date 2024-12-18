import {Capacitor} from "@capacitor/core";

export function spotbie_UTC(time: string): string | Date {
  if (Capacitor.getPlatform() === 'ios') {
    const formattedTime = time.replace(' ', 'T') + 'Z';
    return new Date(formattedTime);
  }
  return new Date(time + ' UTC');
}
