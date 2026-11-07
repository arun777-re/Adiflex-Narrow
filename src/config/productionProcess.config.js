
export const IDEAL_PROCESS_TIMES = {
  "Job Work": 120,
  Warping: 120,
  Filling: 90,
  Machine: 180,
  Finishing: 120,
  Quality: 30,
  Rolling: 60,
  Packing: 45,
};

export const PROCESS_CONFIG = [
  {
    name: "Job Work",
    stageCode: "JOB_WORK",
    startKey: "started_at",
    endKey: "completed_at",
    jobWorkOnly: true,
  },
  {
    name: "Warping",
    stageCode: "WARPING",
    startKey: "started_at",
    endKey: "completed_at",
  },
  {
    name: "Filling",
    stageCode: "FILLING",
    startKey: "started_at",
    endKey: "completed_at",
  },
  {
    name: "Machine",
    stageCode: "MACHINE",
    startKey: "started_at",
    endKey: "completed_at",
  },
  {
    name: "Finishing",
    stageCode: "FINISHING",
    startKey: "started_at",
    endKey: "completed_at",
  },
  {
    name: "Quality",
    stageCode: "QUALITY",
    startKey: "started_at",
    endKey: "completed_at",
  },
  {
    name: "Rolling",
    stageCode: "ROLLING",
    startKey: "started_at",
    endKey: "completed_at",
  },
  {
    name: "Packing",
    stageCode: "PACKING",
    startKey: "started_at",
    endKey: "completed_at",
  },
];
