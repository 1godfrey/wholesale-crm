import { SearchBar } from "./search-bar";
import { AvatarPlaceholder } from "../ui/avatar-placeholder";

type TopNavigationProps = {
  onSearch: (value: string) => void;
  onMobileMenuClick: () => void;
};

export const TopNavigation = ({ onSearch, onMobileMenuClick }: TopNavigationProps) => {
  return (
    <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200 bg-white">
      {/* Mobile menu button */}
      <button 
        type="button" 
        className="md:hidden text-neutral-500 hover:text-neutral-900 focus:outline-none"
        onClick={onMobileMenuClick}
      >
        <i className="ri-menu-line text-xl"></i>
      </button>
      
      {/* Search */}
      <div className="flex-1 max-w-3xl mx-auto">
        <SearchBar onSearch={onSearch} />
      </div>

      {/* Actions */}
      <div className="ml-4 flex items-center md:ml-6 space-x-3">
        <button className="text-neutral-500 hover:text-neutral-900">
          <i className="ri-notification-3-line text-xl"></i>
        </button>
        <button className="text-neutral-500 hover:text-neutral-900">
          <i className="ri-question-line text-xl"></i>
        </button>
        <button className="md:hidden rounded-full bg-neutral-200 p-1 text-neutral-500">
          <AvatarPlaceholder name="John Doe" size="sm" />
        </button>
      </div>
    </div>
  );
};
