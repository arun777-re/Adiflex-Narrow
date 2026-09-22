export const PROCESS_ORDER = [
  {
    key: "warping",
    label: "Warping",
    startField: "warpingStartAt",
    endField: "warpingEndsAt",
  },

  {
    key: "filling",
    label: "Filling",
    startField: "fillingStartAt",
    endField: "fillingEndsAt",
  },

  {
    key: "machine",
    label: "Machine",
    startField: "machineStartsAt",
    endField: "machineEndsAt",
  },

  {
    key: "finishing",
    label: "Finishing",
    startField: "finishingStartsAt",
    endField: "finishingEndsAt",
  },

  {
    key: "quality",
    label: "Quality",
    startField: "qualityStartsAt",
    endField: "qualityEndsAt",
  },

  {
    key: "rolling",
    label: "Rolling",
    startField: "rollingStartsAt",
    endField: "rollingEndsAt",
  },

  {
    key: "packing",
    label: "Packing",
    startField: "packingStartsAt",
    endField: "packingEndsAt",
  },
];

export const getCurrentProcess = (row) => {
  // OLD / COMPLETED PRODUCTION CYCLE

  if (
    row.overAllStatus === "Cycle Completed" ||
    row.overAllStatus === "Completed" ||
    row.status === "Cycle Completed" ||
    row.status === "Completed"
  ) {
    return {
      key: null,
      label: "Completed",
      status: "Completed",
    };
  }

  const processOrder = [];

  // ===================================================
  // JOB WORK
  // ===================================================

  if (row.isJobWork === true) {
    processOrder.push({
      key: "jobWork",
      label: "Job Work",
      startField: "jobWorkStartTime",
      endField: "jobWorkEndTime",
    });
  }

  // ===================================================
  // NORMAL PRODUCTION PROCESSES
  // ===================================================

  processOrder.push(...PROCESS_ORDER);

  // ===================================================
  // FIND CURRENT PROCESS
  // ===================================================

  for (const process of processOrder) {
    const startTime = row[process.startField];
    const endTime = row[process.endField];

    // COMPLETED
    if (endTime) {
      continue;
    }

    // IN PROGRESS
    if (startTime) {
      return {
        key: process.key,
        label: process.label,
        status: "In Progress",
      };
    }

    // PENDING
    return {
      key: process.key,
      label: process.label,
      status: "Pending",
    };
  }

  // ===================================================
  // ALL COMPLETED
  // ===================================================

  return {
    key: null,
    label: "Completed",
    status: "Completed",
  };
};
