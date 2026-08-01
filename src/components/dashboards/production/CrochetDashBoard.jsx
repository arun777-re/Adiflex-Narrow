import React from "react";
import { socket } from "../../../socket/socket";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
const CrochetDashBoard = () => {
  const { user } = useSelector((state) => state.auth.user);
  React.useEffect(() => {
    socket.emit("join-room", {
      role: user.role,

      division: user.division,
    });
  }, []);

  const audio = new Audio("/notification.mp3");
  React.useEffect(() => {
    socket.on("new-sales-order", (data) => {

      toast.success(`New Sales Order Created:${data.soNo}`);
      audio.play();
      console.log("socket se data aaya hai veererererererer", data);
    });

    return () => {
      socket.off("new-sales-order");
    };
  }, []);

  return <div>CrochetDashBoard</div>;
};

export default CrochetDashBoard;
