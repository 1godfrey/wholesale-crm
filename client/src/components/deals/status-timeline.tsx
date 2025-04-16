import { DealStatusHistory } from "@shared/schema";
import { formatDateTime } from "@/lib/utils/deal-utils";
import { getTimelineItemColor, getTimelineIcon } from "@/lib/utils/status-colors";

type StatusTimelineProps = {
  history: DealStatusHistory[];
};

export const StatusTimeline = ({ history }: StatusTimelineProps) => {
  if (!history || history.length === 0) {
    return (
      <div className="text-center p-4 text-neutral-500">
        No status history available
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {history.map((item, index) => {
        const borderColorClass = getTimelineItemColor(item.new_status);
        const iconClass = getTimelineIcon(item.new_status);
        
        return (
          <div key={item.history_id} className="timeline-item pl-10 relative">
            <div className={`absolute left-0 top-0 h-6 w-6 rounded-full bg-neutral-100 border-2 ${borderColorClass} flex items-center justify-center`}>
              <i className={`${iconClass} text-neutral-600 text-sm`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">
                {item.old_status 
                  ? `Changed to ${item.new_status}` 
                  : `Deal Created as ${item.new_status}`}
              </p>
              <p className="text-xs text-neutral-500">{formatDateTime(item.timestamp)}</p>
              {item.notes && (
                <p className="text-xs text-neutral-600 mt-1">{item.notes}</p>
              )}
            </div>
          </div>
        );
      })}
      <style jsx>{`
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 2.5rem;
          top: 0;
          height: 100%;
          width: 2px;
          background-color: #e2e8f0;
          z-index: -1;
        }
        .timeline-item:last-child::before {
          height: 50%;
        }
        .timeline-item:first-child::before {
          top: 50%;
          height: 50%;
        }
      `}</style>
    </div>
  );
};
