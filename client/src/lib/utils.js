import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict, parseISO, format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function timeDifference(from) {
  if (!from) {
    console.error("Invalid date provided to formateRelativeDate");
    return "Invalid date";
  }

  const currentDate = new Date();
  let fromDate;

  try {
    // If 'from' is already a Date object, use it directly
    if (from instanceof Date) {
      fromDate = from;
    }
    // If 'from' is a number (timestamp), create a new Date object
    else if (typeof from === "number") {
      fromDate = new Date(from);
    }
    // If 'from' is a string, try to parse it
    else if (typeof from === "string") {
      // First, try to parse it as an ISO string
      fromDate = parseISO(from);

      // If parsing as ISO fails (invalid date), try creating a new Date object
      if (isNaN(fromDate.getTime())) {
        fromDate = new Date(from);
      }
    } else {
      throw new Error("Unsupported date format");
    }

    // Check if the resulting date is valid
    if (isNaN(fromDate.getTime())) {
      throw new Error("Invalid date");
    }
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date";
  }

  if (currentDate.getTime() - fromDate.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(fromDate, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === fromDate.getFullYear()) {
      return format(fromDate, "MMM d");
    } else {
      return format(fromDate, "MMM d, yyyy");
    }
  }
}
