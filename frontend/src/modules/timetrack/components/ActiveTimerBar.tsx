import { useEffect } from 'react';
import useStopwatch from '../../../hooks/useStopwatch';

/**
 * Headless component that synchronizes the active timer state across the application.
 * The visual timer has been removed as per the user's request, focusing time visibility
 * strictly within the task table rows.
 */
export default function ActiveTimerBar() {
  // Calling useStopwatch globally mounts the timer interval syncing
  useStopwatch();

  return null;
}
