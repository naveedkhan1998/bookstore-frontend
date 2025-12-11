import type { FC } from "react";
import { HiOutlineSearch } from "react-icons/hi";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => (
  <div className="relative w-full max-w-md">
    <HiOutlineSearch className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent-DEFAULT focus:border-transparent dark:bg-dark-secondary"
    />
  </div>
);

export default SearchInput;
