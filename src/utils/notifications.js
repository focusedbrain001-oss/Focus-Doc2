export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

export function sendNotification(mode) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    const messages = {
      pomodoro: 'Pomodoro complete! Time for a break.',
      shortBreak: 'Break is over! Back to work.',
      longBreak: 'Long break finished! Ready to focus?',
    };
    new Notification('FocusFlow Timer', { 
      body: messages[mode] || 'Session complete!',
      icon: '/favicon.svg'
    });
  }
}
