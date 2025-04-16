import { DealStatus } from "@shared/schema";

export const getStatusColor = (status: DealStatus) => {
  switch (status) {
    case DealStatus.New:
      return {
        badgeColor: "bg-blue-100 text-blue-800",
        dotColor: "bg-blue-500",
        textColor: "text-blue-500"
      };
    case DealStatus.Negotiating:
      return {
        badgeColor: "bg-purple-100 text-purple-800",
        dotColor: "bg-purple-500",
        textColor: "text-purple-500"
      };
    case DealStatus.UnderContract:
      return {
        badgeColor: "bg-amber-100 text-amber-800",
        dotColor: "bg-amber-500",
        textColor: "text-amber-500"
      };
    case DealStatus.Assigned:
      return {
        badgeColor: "bg-emerald-100 text-emerald-800",
        dotColor: "bg-emerald-500",
        textColor: "text-emerald-500"
      };
    case DealStatus.Closed:
      return {
        badgeColor: "bg-green-100 text-green-800",
        dotColor: "bg-green-500",
        textColor: "text-green-500"
      };
    case DealStatus.Dead:
      return {
        badgeColor: "bg-red-100 text-red-800",
        dotColor: "bg-red-500",
        textColor: "text-red-500"
      };
    default:
      return {
        badgeColor: "bg-neutral-100 text-neutral-800",
        dotColor: "bg-neutral-500",
        textColor: "text-neutral-500"
      };
  }
};

export const getTimelineIcon = (status: DealStatus) => {
  switch (status) {
    case DealStatus.New:
      return "ri-flag-line";
    case DealStatus.Negotiating:
      return "ri-discuss-line";
    case DealStatus.UnderContract:
      return "ri-file-text-line";
    case DealStatus.Assigned:
      return "ri-user-received-2-line";
    case DealStatus.Closed:
      return "ri-check-double-line";
    case DealStatus.Dead:
      return "ri-close-circle-line";
    default:
      return "ri-question-line";
  }
};

export const getTimelineItemColor = (status: DealStatus) => {
  switch (status) {
    case DealStatus.New:
      return "bg-blue-500 text-white";
    case DealStatus.Negotiating:
      return "bg-purple-500 text-white";
    case DealStatus.UnderContract:
      return "bg-amber-500 text-white";
    case DealStatus.Assigned:
      return "bg-emerald-500 text-white";
    case DealStatus.Closed:
      return "bg-green-500 text-white";
    case DealStatus.Dead:
      return "bg-red-500 text-white";
    default:
      return "bg-neutral-500 text-white";
  }
};