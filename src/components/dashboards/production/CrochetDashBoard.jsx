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

  const audio = new Audio("/src/assets/notification.mp3");
  React.useEffect(() => {
    const handleNewSalesOrder = (data) => {
      console.log("🔥 Received:", data);
      console.log(socket.id);
      console.log(socket.connected);
      toast.success(`New Sales Order: ${data.soNo}`);
    };
audio.play();
    socket.on("new-sales-order", handleNewSalesOrder);

    return () => {
      socket.off("new-sales-order", handleNewSalesOrder);
    };
  }, []);

  return <div>CrochetDashBoard</div>;
};

export default CrochetDashBoard;
