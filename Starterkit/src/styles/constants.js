// this is pretty terible but right now don't have time to refactor all the styling...

export const bookedPtoColor = "#6A48FF";
export const holidayColor = "#FF77B3";
export const selectionColor = "#8B77FF";
export const unbookColor = "#6D7994";
export const balanceColor = "#AC9BF2";
export const negativeBalanceColor = "#FA0A0A";

export const toggleButtonBackgroundColor = "#F4F7FE";

export const tooltipBackground = "#2b3674";

export const cardHoverColor = "rgb(255, 255, 255, 0.3)";

export const stripedSelection = {
  background: `
    linear-gradient(
      -45deg,
      ${selectionColor} 25%,
      ${bookedPtoColor} 25%,
      ${bookedPtoColor} 50%,
      ${selectionColor} 50%,
      ${selectionColor} 75%,
      ${bookedPtoColor} 75%,
      ${bookedPtoColor}
    )
  `
};
