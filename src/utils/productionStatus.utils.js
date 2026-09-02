import {IDEAL_PROCESS_TIMES} from "../config/productionProcess.config";
import {getDurationMinutes,formatDuration} from "./productionDate.utils";


// ============================================================
// PROCESS STATUS
// ============================================================

export const getProcessStatus = (order, processConfig) => {
  // ==========================================================
  // JOB WORK CHECK
  // ==========================================================

  if (processConfig.jobWorkOnly) {
    const isJobWork =
      order?.isJobWork === true ||
      normalizeStatus(order?.isJobWork) === "true";

    if (!isJobWork) {
      return {
        type: "notApplicable",
        label: "Not Applicable",
        actualMinutes: null,
      };
    }
  }

  // ==========================================================
  // STATUS
  // ==========================================================

  const processStatus = processConfig.statusKey
    ? normalizeStatus(order?.[processConfig.statusKey])
    : "";

  // ==========================================================
  // START / END
  // ==========================================================

  const start = order?.[processConfig.startKey];
  const end = order?.[processConfig.endKey];

  const hasStart =
    start !== null &&
    start !== undefined &&
    String(start).trim() !== "";

  const hasEnd =
    end !== null &&
    end !== undefined &&
    String(end).trim() !== "";

  // ==========================================================
  // NOT STARTED
  // ==========================================================

  if (!hasStart) {
    return {
      type: "notStarted",
      label: "Not Started",
      actualMinutes: null,
    };
  }

  // ==========================================================
  // ACTUAL DURATION
  // ==========================================================

  const actualMinutes = getDurationMinutes(
    start,
    hasEnd ? end : null
  );

  if (actualMinutes === null) {
    return {
      type: "notStarted",
      label: "Invalid Time",
      actualMinutes: null,
    };
  }

  const idealMinutes =
    IDEAL_PROCESS_TIMES[processConfig.name];

  // ==========================================================
  // RUNNING
  // ==========================================================
  // IMPORTANT:
  // No end timestamp = process is still running,
  // regardless of what status field says.
  // ==========================================================

  if (!hasEnd) {
    if (actualMinutes > idealMinutes) {
      return {
        type: "late",
        label: `Late +${formatDuration(
          actualMinutes - idealMinutes
        )}`,
        actualMinutes,
      };
    }

    return {
      type: "running",
      label: "Running",
      actualMinutes,
    };
  }

  // ==========================================================
  // COMPLETED
  // ==========================================================

  if (actualMinutes > idealMinutes + 1) {
    return {
      type: "late",
      label: `Late +${formatDuration(
        actualMinutes - idealMinutes
      )}`,
      actualMinutes,
    };
  }

  // ==========================================================
  // ON TIME
  // ==========================================================

  if (
    Math.abs(actualMinutes - idealMinutes) <= 1
  ) {
    return {
      type: "ontime",
      label: "On Time",
      actualMinutes,
    };
  }

  // ==========================================================
  // FASTER
  // ==========================================================

  return {
    type: "faster",
    label: `${formatDuration(
      idealMinutes - actualMinutes
    )} Faster`,
    actualMinutes,
  };
};

export const normalizeStatus = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase();
};