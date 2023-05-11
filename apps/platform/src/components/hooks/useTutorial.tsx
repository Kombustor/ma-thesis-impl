import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const COOKIE_KEYS = {
  DISABLED: 'tutorial.disabled',
  RUNNING: 'tutorial.running',
};

export const useTutorial = () => {
  const router = useRouter();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialRunning, setTutorialRunning] = useState(false);

  const dismiss = () => {
    setShowTutorial(false);
    // Disable tutorial
    setCookie(COOKIE_KEYS.DISABLED, '1');
  };

  const start = () => {
    setTutorialRunning(true);
    // Hide tutorial
    dismiss();
    // Set tutorial running
    setCookie(COOKIE_KEYS.RUNNING, '1');
  };

  const finish = () => {
    setTutorialRunning(false);
    // Delete running cookie
    deleteCookie(COOKIE_KEYS.RUNNING);
  };

  const restart = () => {
    start();
    if (router.route !== '/articles') {
      router.push('/articles');
    } else {
      router.reload();
    }
  };

  // Use effect runs only on the client side and this thus prevents hydration errors
  useEffect(() => {
    setShowTutorial(getCookie(COOKIE_KEYS.DISABLED) !== '1');
    setTutorialRunning(getCookie(COOKIE_KEYS.RUNNING) === '1');
  }, []);

  return { showTutorial, tutorialRunning, dismiss, start, finish, restart };
};
