import { format, parseISO } from 'date-fns';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

export const formatFileSize = (sizeBit: number): string => {
  const sizeKb = sizeBit / 1024;
  const sizeMb = sizeKb / 1024;
  const sizeGo = sizeMb / 1024;

  if (sizeGo >= 1) {
    return `${sizeGo.toFixed(1)} Go`;
  } else if (sizeMb >= 1) {
    return `${sizeMb.toFixed(1)} Mb`;
  } else {
    return `${sizeKb.toFixed(1)} Kb`;
  }
};

export const downloadFile = (url: string, fileName?: string): void => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName || url.split("/").pop() || "download";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export const downloadMultipleFiles = (
  urls: string[],
  fileNames?: string[]
): void => {
  urls.forEach((url, index) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download =
      fileNames?.[index] || url.split("/").pop() || `download_${index}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });
};

/**
 * Get the user's current timezone
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Convert UTC date string from backend to user's local timezone and format it
 * @param utcDateString - UTC date string from backend (e.g., "2024-01-15T10:30:00Z")
 * @param formatPattern - Date format pattern (default: "dd-MM-yyyy  HH:mm")
 * @returns Formatted date string in user's timezone
 */
export const formatDateInUserTimezone = (
  utcDateString: string, 
  formatPattern: string = "dd-MM-yyyy  HH:mm"
): string => {
  if (!utcDateString) return '';
  
  try {
    const userTimezone = getUserTimezone();
    // Parse the UTC date and convert to user's timezone
    const utcDate = parseISO(utcDateString);
    return formatInTimeZone(utcDate, userTimezone, formatPattern);
  } catch (error) {
    console.error('Error formatting date:', error);
    return utcDateString;
  }
};

/**
 * Convert UTC date string to user's local timezone and return as locale string
 * @param utcDateString - UTC date string from backend
 * @param options - Intl.DateTimeFormatOptions for locale formatting
 * @returns Formatted date string using browser's locale
 */
export const formatDateAsLocaleString = (
  utcDateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!utcDateString) return '';
  
  try {
    const userTimezone = getUserTimezone();
    const utcDate = parseISO(utcDateString);
    const localDate = toZonedTime(utcDate, userTimezone);
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: userTimezone
    };
    
    return localDate.toLocaleString(undefined, options || defaultOptions);
  } catch (error) {
    console.error('Error formatting date as locale string:', error);
    return utcDateString;
  }
};

/**
 * Format date for date input fields (YYYY-MM-DD format)
 * @param utcDateString - UTC date string from backend
 * @returns Date string in YYYY-MM-DD format in user's timezone
 */
export const formatDateForInput = (utcDateString: string): string => {
  if (!utcDateString) return '';
  
  try {
    const userTimezone = getUserTimezone();
    const utcDate = parseISO(utcDateString);
    return formatInTimeZone(utcDate, userTimezone, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
};

/**
 * Format time only (HH:mm format)
 * @param utcDateString - UTC date string from backend
 * @returns Time string in HH:mm format in user's timezone
 */
export const formatTimeInUserTimezone = (utcDateString: string): string => {
  if (!utcDateString) return '';
  
  try {
    const userTimezone = getUserTimezone();
    const utcDate = parseISO(utcDateString);
    return formatInTimeZone(utcDate, userTimezone, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return utcDateString;
  }
};

/**
 * Check if a call is recent (within the last hour) based on user's timezone
 * @param utcDateString - UTC date string of call start time
 * @returns Boolean indicating if call is recent
 */
export const isRecentCall = (utcDateString: string): boolean => {
  if (!utcDateString) return false;
  
  try {
    const userTimezone = getUserTimezone();
    const utcDate = parseISO(utcDateString);
    const localDate = toZonedTime(utcDate, userTimezone);
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    return localDate > oneHourAgo;
  } catch (error) {
    console.error('Error checking if call is recent:', error);
    return false;
  }
};

/**
 * Legacy format function - now with proper timezone handling
 * @param dateString - UTC date string from backend
 * @returns Formatted date string in user's timezone
 */
export const formatDate = (dateString: string) => {
  return formatDateInUserTimezone(dateString, "dd-MM-yyyy  HH:mm");
};
