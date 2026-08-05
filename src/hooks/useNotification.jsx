import { useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { socket } from "../socket/socket";
import { notificationAudio } from "../utils/audio.js";

const useNotification = ({
  event = "new-notification",
  refetch= null
}) => {
  const { user } = useSelector((state) => state?.auth?.user);
  const dispatch = useDispatch();

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
      if(refetch && typeof refetch === "function"){
        dispatch(refetch());
      }
    };

    socket.on(event, handleNotification);

    return () => {
      socket.off(event, handleNotification);
    };
  }, [user,event,refetch,dispatch]);
};

export default useNotification;