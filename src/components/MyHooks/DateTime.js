export default function DateTimeFormate(dateTimeString) {
  // a simple way
  return dateTimeString.replace("T", " ").substring(0, 16);
}

// Generate an array with all days of the current month
const generateMonthDays = () => {
  const daysInMonth = new Date().getDate();
  const month = new Date().toLocaleString("default", { month: "short" });
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
    day: `${month}-${i + 1}`,
    totalPrice: 0, // Initialize with 0 sales
  }));
  return daysArray;
};

export const mergeWithMonthDays = (salesData) => {
  const monthDays = generateMonthDays();
  salesData.forEach((sale) => {
    const dayIndex = monthDays.findIndex((d) => d.day === sale.day);
    if (dayIndex !== -1) {
      monthDays[dayIndex].totalPrice = sale.totalPrice;
    }
  });
  return monthDays;
};
