export const calculateEndDate = (startDate: string, period: string): string => {
  const start = new Date(startDate);
  let end;
  switch (period) {
    case "Week":
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      break;
    case "Month":
      end = new Date(start);
      end.setMonth(start.getMonth() + 1);
      break;
    case "Year":
      end = new Date(start);
      end.setFullYear(start.getFullYear() + 1);
      break;
    default:
      end = start;
  }
  return end.toISOString().split("T")[0];
};
