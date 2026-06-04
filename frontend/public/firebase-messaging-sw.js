self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(self.registration.showNotification(data.title || 'Speed News 24', {
    body: data.body || 'Breaking news update',
    icon: '/favicon.svg'
  }));
});
