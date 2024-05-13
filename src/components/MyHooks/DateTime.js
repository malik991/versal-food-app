export default function DateTimeFormate(dateTimeString) {
  // a simple way
  return dateTimeString.replace("T", " ").substring(0, 16);

  //   const date = new Date(dateTimeString);

  //   // Get date portion in dd/mm/yy format
  //   const formattedDate = `${("0" + date.getDate()).slice(-2)}/${(
  //     "0" +
  //     (date.getMonth() + 1)
  //   ).slice(-2)}/${date.getFullYear().toString().slice(-2)}`;

  //   // Get time portion in 24-hour format
  //   const formattedTime = `${("0" + date.getHours()).slice(-2)}:${(
  //     "0" + date.getMinutes()
  //   ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`;

  //   return `${formattedDate}, ${formattedTime}`;
}
