export const getProcessStatus = (row, process) => {
  switch (process) {

    case "jobWork":
      return row.jobWorkEndTime
        ? "Completed"
        : "Pending";

    case "warping":
      return row.warpingEndsAt
        ? "Completed"
        : "Pending";

    case "yarnBeam":
      return row.yarnBeamEndsAt
        ? "Completed"
        : "Pending";

    case "machine":
      return row.machineEndsAt
        ? "Completed"
        : "Pending";

    case "quality":
      return row.qualityEndsAt
        ? "Completed"
        : "Pending";

    case "finishing":
      return row.finishingEndsAt
        ? "Completed"
        : "Pending";

    case "rolling":
      return row.rollingEndsAt
        ? "Completed"
        : "Pending";

    case "packing":
      return row.packingEndsAt
        ? "Completed"
        : "Pending";

    default:
      return "Pending";
  }
};