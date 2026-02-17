import { useState, useEffect } from 'react';

const ADULT_GATE_KEY = 'rockhog_adult_consent';

export function useAdultGate() {
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(ADULT_GATE_KEY);
      setHasConsent(stored === 'true');
    } catch (error) {
      console.warn('Failed to read adult gate state:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const grantConsent = () => {
    try {
      sessionStorage.setItem(ADULT_GATE_KEY, 'true');
      setHasConsent(true);
    } catch (error) {
      console.warn('Failed to store adult gate state:', error);
    }
  };

  const revokeConsent = () => {
    try {
      sessionStorage.removeItem(ADULT_GATE_KEY);
      setHasConsent(false);
    } catch (error) {
      console.warn('Failed to clear adult gate state:', error);
    }
  };

  return {
    hasConsent,
    isLoading,
    grantConsent,
    revokeConsent,
  };
}

