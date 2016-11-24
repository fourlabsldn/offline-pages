export default (title, message) => {
  if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    self.registration.showNotification(title, {
      body: message,
      icon: '/static/images/offline.png',
    });
  }
}
