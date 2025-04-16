import { useState } from "react";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  onSearch: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchBar = ({ 
  onSearch, 
  placeholder = "Search deals, leads, or documents...", 
  className = "" 
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="ri-search-line text-neutral-400"></i>
      </div>
      <Input
        type="search"
        className="block w-full pl-10 pr-3 py-2 border-neutral-200 rounded-md"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};
