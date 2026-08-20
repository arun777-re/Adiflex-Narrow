const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

export const subscribeToPush = async () => {
  console.log("🚀 subscribeToPush START");

  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker not supported");
  }

  console.log("✅ Service Worker supported");

  if (!("PushManager" in window)) {
    throw new Error("Push notifications not supported");
  }

  console.log("✅ PushManager supported");

  const permission = await Notification.requestPermission();

  console.log("🔔 Permission:", permission);

  if (permission !== "granted") {
    throw new Error(`Notification permission: ${permission}`);
  }

  console.log("✅ Permission granted");

  console.log("⏳ Waiting for Service Worker...");

  const registration = await navigator.serviceWorker.ready;

  console.log("✅ Service Worker ready:", registration);

  let subscription = await registration.pushManager.getSubscription();

  console.log("📦 Existing subscription:", subscription);

  if (!subscription) {
    console.log("🆕 Creating new push subscription...");

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY,
      ),
    });

    console.log("✅ New subscription created:", subscription);
  }

  console.log("📤 Sending subscription to backend...");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/notifications/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(subscription),
    },
  );

  console.log("📥 Backend response:", response.status);

  if (!response.ok) {
    throw new Error("Failed to save push subscription");
  }

  console.log("🎉 PUSH SETUP COMPLETE");

  return subscription;
};
