
import { IDEAL_PROCESS_TIMES } from "../config/productionProcess.config";
import {
  getDurationMinutes,
  formatDuration,
} from "./productionDate.utils";

export const normalizeStatus = (value) =>
  String(value ?? "").trim().toUpperCase();

export const getProcessStatus = (order, processConfig) => {
  const stages = order?.stages || order?.production_stage_runs || [];

  const stage = stages.find(
    (item) =>
      normalizeStatus(item.stage_code) ===
      normalizeStatus(processConfig.stageCode)
  );

  if (!stage) {
    return {
      type: "notStarted",
      label: "Stage Not Found",
      actualMinutes: null,
      stage: null,
    };
  }

  const status = normalizeStatus(stage.status);
  const start = stage.started_at;
  const end = stage.completed_at;

  const hasStart = Boolean(start);
  const hasEnd = Boolean(end);

  const actualMinutes = hasStart
    ? getDurationMinutes(start, hasEnd ? end : null)
    : null;

  const idealMinutes = IDEAL_PROCESS_TIMES[processConfig.name];

  // Status ko timestamp se pehle check karna zaroori hai
  if (status === "CANCELLED") {
    return {
      type: "cancelled",
      label: "Cancelled",
      actualMinutes,
      stage,
    };
  }

  if (status === "PENDING") {
    return {
      type: "notStarted",
      label: "Not Started",
      actualMinutes: null,
      stage,
    };
  }

  if (status === "PARTIALLY_RELEASED") {
    return {
      type: "partiallyReleased",
      label: "Partially Released",
      actualMinutes,
      stage,
    };
  }

  if (status === "IN_PROGRESS") {
    if (
      actualMinutes !== null &&
      idealMinutes &&
      actualMinutes > idealMinutes
    ) {
      return {
        type: "late",
        label: `Late +${formatDuration(actualMinutes - idealMinutes)}`,
        actualMinutes,
        stage,
      };
    }

    return {
      type: "running",
      label: "Running",
      actualMinutes,
      stage,
    };
  }

  if (status === "COMPLETED") {
    if (actualMinutes === null) {
      return {
        type: "completed",
        label: "Completed (Time Missing)",
        actualMinutes: null,
        stage,
      };
    }

    if (!idealMinutes) {
      return {
        type: "completed",
        label: "Completed",
        actualMinutes,
        stage,
      };
    }

    if (actualMinutes > idealMinutes + 1) {
      return {
        type: "late",
        label: `Late +${formatDuration(actualMinutes - idealMinutes)}`,
        actualMinutes,
        stage,
      };
    }

    if (Math.abs(actualMinutes - idealMinutes) <= 1) {
      return {
        type: "ontime",
        label: "Completed On Time",
        actualMinutes,
        stage,
      };
    }

    return {
      type: "faster",
      label: `${formatDuration(idealMinutes - actualMinutes)} Faster`,
      actualMinutes,
      stage,
    };
  }

  return {
    type: "notStarted",
    label: status || "Not Started",
    actualMinutes: null,
    stage,
  };
};
