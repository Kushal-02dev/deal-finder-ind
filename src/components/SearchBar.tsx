import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2 p-2 bg-card rounded-lg shadow-[var(--shadow-card)] border border-border">
        <Input
          type="text"
          placeholder="Search for products (e.g., iPhone 15, Samsung TV, Nike Shoes...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="px-6"
        >
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? "Searching..." : "Compare Prices"}
        </Button>
      </div>
    </form>
  );
};
