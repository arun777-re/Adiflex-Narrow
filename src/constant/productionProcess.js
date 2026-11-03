
export const PROCESS_ORDER = [
  { key: "JOB_WORK", label: "Job Work" },
  { key: "WARPING", label: "Warping" },
  { key: "FILLING", label: "Filling" },
  { key: "MACHINE", label: "Machine" },
  { key: "FINISHING", label: "Finishing" },
  { key: "QUALITY", label: "Quality" },
  { key: "ROLLING", label: "Rolling" },
  { key: "PACKING", label: "Packing" },
];

// Default process assignments.
// Actual assignments should ultimately come from the backend.
export const SUPERVISOR_PROCESSES = {
  productionsupervisor: [
    "JOB_WORK",
    "WARPING",
    "FILLING",
    "MACHINE",
  ],

  finishingsupervisor: [
    "FINISHING",
    "QUALITY",
  ],

  packingsupervisor: [
    "ROLLING",
    "PACKING",
  ],
};

export const getCurrentProcess = (row) => {
  const stages = Array.isArray(row?.stages)
    ? row.stages
    : [];

  const masterStatus = String(
    row?.production_status || ""
  ).toUpperCase().replaceAll(" ", "_");

  if (
    ["COMPLETED", "CYCLE_COMPLETED"].includes(masterStatus)
  ) {
    return {
      key: null,
      label: "Completed",
      status: "Completed",
    };
  }

  for (const process of PROCESS_ORDER) {
    const stage = stages.find(
      (item) => item.stage_code === process.key
    );

    // This cycle may not have this stage configured.
    if (!stage) continue;

    const status = String(
      stage.status || "PENDING"
    ).toUpperCase();

    if (status === "COMPLETED") continue;

    if (
      ["IN_PROGRESS", "PARTIALLY_RELEASED"].includes(status)
    ) {
      return {
        key: process.key,
        label: process.label,
        status: "In Progress",
        stageRunId: stage.stage_run_id,
        stage,
      };
    }

    if (status === "PENDING") {
      return {
        key: process.key,
        label: process.label,
        status: "Pending",
        stageRunId: stage.stage_run_id,
        stage,
      };
    }

    return {
      key: process.key,
      label: process.label,
      status,
      stageRunId: stage.stage_run_id,
      stage,
    };
  }

  return {
    key: null,
    label: "Completed",
    status: "Completed",
  };
};
