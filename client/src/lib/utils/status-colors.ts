import { DealStatus } from "@shared/schema";

export const getStatusColor = (status: string): { bgColor: string; dotColor: string; textColor: string } => {
  switch (status) {
    case DealStatus.New:
      return { 
        bgColor: "bg-amber-100", 
        dotColor: "bg-amber-500", 
        textColor: "text-amber-700" 
      };
    case DealStatus.Negotiating:
      return { 
        bgColor: "bg-blue-100", 
        dotColor: "bg-blue-500", 
        textColor: "text-blue-700" 
      };
    case DealStatus.UnderContract:
      return { 
        bgColor: "bg-orange-100", 
        dotColor: "bg-orange-500", 
        textColor: "text-orange-700" 
      };
    case DealStatus.Assigned:
      return { 
        bgColor: "bg-purple-100", 
        dotColor: "bg-purple-500", 
        textColor: "text-purple-700" 
      };
    case DealStatus.Closed:
      return { 
        bgColor: "bg-green-100", 
        dotColor: "bg-green-500", 
        textColor: "text-green-700" 
      };
    case DealStatus.Dead:
      return { 
        bgColor: "bg-red-100", 
        dotColor: "bg-red-500", 
        textColor: "text-red-700" 
      };
    default:
      return { 
        bgColor: "bg-gray-100", 
        dotColor: "bg-gray-500", 
        textColor: "text-gray-700" 
      };
  }
};

export const getTimelineItemColor = (status: string): string => {
  switch (status) {
    case DealStatus.New:
      return "border-amber-500";
    case DealStatus.Negotiating:
      return "border-blue-500";
    case DealStatus.UnderContract:
      return "border-orange-500";
    case DealStatus.Assigned:
      return "border-purple-500";
    case DealStatus.Closed:
      return "border-green-500";
    case DealStatus.Dead:
      return "border-red-500";
    default:
      return "border-gray-300";
  }
};

export const getTimelineIcon = (status: string): string => {
  switch (status) {
    case DealStatus.New:
      return "ri-add-line";
    case DealStatus.Negotiating:
      return "ri-chat-3-line";
    case DealStatus.UnderContract:
      return "ri-check-line";
    case DealStatus.Assigned:
      return "ri-exchange-line";
    case DealStatus.Closed:
      return "ri-check-double-line";
    case DealStatus.Dead:
      return "ri-close-line";
    default:
      return "ri-question-line";
  }
};
