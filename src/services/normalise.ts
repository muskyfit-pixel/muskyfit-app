export type ActivityLevel = "Low" | "Moderate" | "Active";

export const normaliseActivityLevel = (value: string): ActivityLevel => {
  switch (value) {
    case "Sedentary":
      return "Low";
    case "Mixed":
      return "Moderate";
    case "Low":
    case "Moderate":
    case "Active":
      return value;
    default:
      return "Moderate";
  }
};
