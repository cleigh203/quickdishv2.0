/**
 * Native device utilities
 * Uses Capacitor APIs, not available in web builds
 */

import { getPlatform } from '@/utils/platform';

/**
 * Get device info (native only)
 */
export const getDeviceInfo = async () => {
  const platform = await getPlatform();
  if (platform === 'web') {
    return null;
  }

  try {
    const { Device } = await import('@capacitor/device');
    return await Device.getInfo();
  } catch {
    return null;
  }
};

/**
 * Get battery info (native only)
 */
export const getBatteryInfo = async () => {
  const platform = await getPlatform();
  if (platform === 'web') {
    return null;
  }

  try {
    const { Device } = await import('@capacitor/device');
    return await Device.getBatteryInfo();
  } catch {
    return null;
  }
};

