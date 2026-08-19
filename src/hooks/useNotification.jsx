import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { socket } from "../socket/socket";
import { notificationAudio } from "../utils/audio.js";

const useNotification = ({
  event = "new-notification",
  refetch = null,
}) => {
  const dispatch = useDispatch();

  // ✅ Correct path
  const authUser = useSelector((state) => state.auth?.user?.user);

  useEffect(() => {
    if (!authUser) {
      console.log("❌ Notification: User not found");
      return;
    }

    console.log("🔥 Notification Hook Started");
    console.log("👤 User:", authUser);

    const joinRoom = () => {
      console.log(
        "🚪 Joining Room:",
        authUser.role,
        authUser.division
      );

      socket.emit("join-room", {
        role: authUser.role,
        division: authUser.division,
      });
    };

    // Socket already connected
    if (socket.connected) {
      joinRoom();
    }

    // Socket connects later
    socket.on("connect", joinRoom);

    // ==========================================
    // NOTIFICATION
    // ==========================================

    const handleNotification = (notification) => {
      console.log("🔥🔥 NOTIFICATION RECEIVED:", notification);

      // Toast
      toast.success(
        notification?.title || "New Notification"
      );

      // Bell / Audio
      try {
        notificationAudio.currentTime = 0;

        const playPromise = notificationAudio.play();

        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.log("🔇 Audio blocked:", err);
          });
        }
      } catch (error) {
        console.log("🔇 Audio Error:", error);
      }

      // ==========================================
      // REFRESH REDUX DATA
      // ==========================================

      if (typeof refetch === "function") {
        console.log("🔄 Refetching data...");

        dispatch(refetch());
      }
    };

    console.log(`👂 Listening for event: ${event}`);

    socket.on(event, handleNotification);

    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {
      console.log("🧹 Cleaning notification listener");

      socket.off("connect", joinRoom);
      socket.off(event, handleNotification);
    };
  }, [authUser, event, refetch, dispatch]);
};

export default useNotification;