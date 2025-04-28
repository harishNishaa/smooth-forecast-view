
import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Header = ({ onSearch }: { onSearch: (location: string) => void }) => {
  const [searchValue, setSearchValue] = React.useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };
  
  return (
    <header className="py-6 px-4 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary">
          WeatherVue
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="relative w-full max-w-md">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for a city..."
          className="pl-10 pr-4 py-2 w-full bg-white/70 backdrop-blur-sm rounded-full border border-gray-200"
        />
        <button 
          type="submit" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
        >
          <Search size={18} />
        </button>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          <MapPin size={18} />
        </div>
      </form>
    </header>
  );
};

export default Header;
