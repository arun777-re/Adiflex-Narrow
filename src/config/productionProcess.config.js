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
    statusKey: null,
    startKey: "jobWorkStartTime",
    endKey: "jobWorkEndTime",
    jobWorkOnly: true,
  },
  {
    name: "Warping",
    statusKey: "warping",
    startKey: "warpingStartAt",
    endKey: "warpingEndsAt",
  },
  {
    name: "Filling",
    statusKey: "filling",
    startKey: "fillingStartAt",
    endKey: "fillingEndsAt",
  },
  {
    name: "Machine",
    statusKey: "machine",
    startKey: "machineStartsAt",
    endKey: "machineEndsAt",
  },
  {
    name: "Finishing",
    statusKey: "finishing",
    startKey: "finishingStartsAt",
    endKey: "finishingEndsAt",
  },
  {
    name: "Quality",
    statusKey: "quality",
    startKey: "qualityStartsAt",
    endKey: "qualityEndsAt",
  },
  {
    name: "Rolling",
    statusKey: "rolling",
    startKey: "rollingStartsAt",
    endKey: "rollingEndsAt",
  },
  {
    name: "Packing",
    statusKey: "packing",
    startKey: "packingStartsAt",
    endKey: "packingEndsAt",
  },
];