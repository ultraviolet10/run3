import { useState, useCallback } from 'react';

export interface WaitlistApiResponse {
  success: boolean;
  message?: string;
  id?: string;
  error?: string;
  details?: any;
  data?: any;
}

export function useWaitlist() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitToWaitlist = async (data: any): Promise<WaitlistApiResponse> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to join waitlist');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkWaitlistStatus = useCallback(async (fid: string): Promise<WaitlistApiResponse> => {
    try {
      const response = await fetch(`/api/waitlist?fid=${fid}`);
      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      return {
        success: false,
        error: errorMessage
      };
    }
  }, []);

  const getWaitlistStats = async (): Promise<WaitlistApiResponse> => {
    try {
      const response = await fetch('/api/waitlist/stats');
      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  return {
    submitToWaitlist,
    checkWaitlistStatus,
    getWaitlistStats,
    isSubmitting,
    error,
    clearError: () => setError(null)
  };
}
