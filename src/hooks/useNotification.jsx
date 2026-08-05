import { useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { socket } from "../socket/socket";
import { notificationAudio } from "../utils/audio.js";

const useNotification = () => {
  const { user } = useSelector((state) => state?.auth?.user);

  useEffect(() => {
    if (!user) return;
    console.log("Joining Room...", user);
    socket.emit("join-room", {
      role: user.role,
      division: user.division,
    });

    const handleNotification = (notification) => {
        console.log("🔥 Notification Received:", notification);

      toast.success(notification.title);

      notificationAudio.currentTime = 0;

      notificationAudio.play().catch((err) => {
        console.log("Audio Error:", err);
      });
    };

    socket.on("new-notification", handleNotification);

    return () => {
      socket.off("new-notification", handleNotification);
    };
  }, [user]);
};

export default useNotification;