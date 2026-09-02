const parseDate = (value) => {
  if (!value) return null;

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  const str = String(value).trim();

  if (!str) return null;

  // =========================================================
  // DD-MM-YYYY HH:mm:ss
  // Example: 02-09-2026 17:14:29
  // =========================================================

  let match = str.match(
    /^(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})$/
  );

  if (match) {
    const [
      ,
      day,
      month,
      year,
      hour,
      minute,
      second,
    ] = match;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );

    return isNaN(date.getTime()) ? null : date;
  }

  // =========================================================
  // D/M/YYYY, HH:mm:ss
  // Example: 2/9/2026, 17:14:38
  // =========================================================

  match = str.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2}):(\d{2})$/
  );

  if (match) {
    const [
      ,
      day,
      month,
      year,
      hour,
      minute,
      second,
    ] = match;

    const date = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );

    return isNaN(date.getTime()) ? null : date;
  }

  // =========================================================
  // Native fallback
  // =========================================================

  const parsed = new Date(str);

  return isNaN(parsed.getTime()) ? null : parsed;
};

// ------------------------------------------------------------
// DURATION
// ------------------------------------------------------------

export const getDurationMinutes = (startValue, endValue) => {
  const start = parseDate(startValue);

  const end = endValue
    ? parseDate(endValue)
    : new Date();

  console.log("🔥 getDurationMinutes DEBUG", {
    startValue,
    endValue,
    parsedStart: start,
    parsedEnd: end,
    now: new Date(),
  });

  if (!start) {
    console.log("❌ Invalid START date");
    return null;
  }

  if (!end) {
    console.log("❌ Invalid END date");
    return null;
  }

  const diff = (end - start) / (1000 * 60);

  console.log("🔥 Duration Diff:", {
    diffMinutes: diff,
    diffHours: diff / 60,
  });

  if (diff < 0) {
    return null;
  }

  return diff;
};

// ------------------------------------------------------------
// FORMAT DURATION
// ------------------------------------------------------------

export const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) {
    return "-";
  }

  const totalMinutes = Math.max(
    0,
    Math.round(minutes)
  );

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }

  return `${mins}m`;
};