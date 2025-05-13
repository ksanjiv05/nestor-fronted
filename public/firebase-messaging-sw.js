// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyDezefXXOMylRC5QF0huhMp8W0iw9r0fpE",
  authDomain: "test-push-notification-e4dba.firebaseapp.com",
  projectId: "test-push-notification-e4dba",
  storageBucket: "test-push-notification-e4dba.firebasestorage.app",
  messagingSenderId: "189563252047",
  appId: "1:189563252047:web:c41c5ba2354597248b293a",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  // self.registration.showNotification(notificationTitle, notificationOptions);
});
