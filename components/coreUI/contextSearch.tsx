"use client";

import * as React from "react";
import { ChefHat, Coffee, LucideIcon, Pizza, Utensils } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface MenuItem {
  name: string;
  price: string;
  description: string;
}

interface RestaurantJson {
  id: number;
  name: string;
  cuisine: string;
  icon: string;
  menu: MenuItem[];
}

interface RestaurantProcessed {
  id: number;
  name: string;
  cuisine: string;
  icon: LucideIcon;
  menu: MenuItem[];
}

interface DisplayableMenuItem {
  restaurantName: string;
  restaurantIcon: LucideIcon;
  item: MenuItem;
}

const iconMap: { [key: string]: LucideIcon } = {
  Pizza: Pizza,
  ChefHat: ChefHat,
  Coffee: Coffee,
  Utensils: Utensils,
};

export default function ContextSearch() {
  const [searchValue, setSearchValue] = React.useState("");
  const [restaurants, setRestaurants] = React.useState<RestaurantProcessed[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = React.useState<RestaurantProcessed[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = React.useState<DisplayableMenuItem[]>([]);

  // Fetch restaurants
  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/testData/stores.json");
        if (!response.ok) {
          console.error("ID[3] HTTP error ", response.status);
          return;
        }
        const data: RestaurantJson[] = await response.json();
        const processedData: RestaurantProcessed[] = data.map((restaurant) => ({
          ...restaurant,
          icon: iconMap[restaurant.icon] || Utensils,
        }));
        setRestaurants(processedData);
      } catch (error) {
        console.error("ID[2] Fetch error ", error);
        setRestaurants([]);
      }
    };

    fetchRestaurants();
  }, []);

  // Real-time search effect
  React.useEffect(() => {
    const performSearch = () => {
      const searchTerm = searchValue.trim().toLowerCase();
      
      if (!searchTerm) {
        // Show all when no search term
        setFilteredRestaurants(restaurants);
        const allMenuItems = restaurants.flatMap((restaurant) =>
          (restaurant.menu || []).map((item) => ({
            restaurantName: restaurant.name,
            restaurantIcon: restaurant.icon,
            item: item,
          }))
        );
        setFilteredMenuItems(allMenuItems);
        return;
      }

      // Filter restaurants
      const matchingRestaurants = restaurants.filter((restaurant) => {
        const nameMatch = restaurant.name.toLowerCase().includes(searchTerm);
        const cuisineMatch = restaurant.cuisine.toLowerCase().includes(searchTerm);
        return nameMatch || cuisineMatch;
      });

      // Filter menu items
      const matchingMenuItems: DisplayableMenuItem[] = [];
      
      restaurants.forEach((restaurant) => {
        if (restaurant.menu && Array.isArray(restaurant.menu)) {
          restaurant.menu.forEach((item) => {
            const nameMatch = item.name.toLowerCase().includes(searchTerm);
            const descMatch = (item.description || '').toLowerCase().includes(searchTerm);
            const restMatch = restaurant.name.toLowerCase().includes(searchTerm);
            
            if (nameMatch || descMatch || restMatch) {
              matchingMenuItems.push({
                restaurantName: restaurant.name,
                restaurantIcon: restaurant.icon,
                item: item,
              });
            }
          });
        }
      });

      setFilteredRestaurants(matchingRestaurants);
      setFilteredMenuItems(matchingMenuItems);
    };

    performSearch();
  }, [searchValue, restaurants]);

  // Handle input change with forced re-render
  const handleInputChange = React.useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  return (
    <div className="flex items-center justify-center my-4 dark">
      <Command 
        className="rounded-lg border shadow-md md:min-w-[500px] max-w-2xl"
        shouldFilter={false} // Disable internal filtering since we handle it ourselves
      >
        <CommandInput
          placeholder="Search restaurants or menu items..."
          value={searchValue}
          onValueChange={handleInputChange}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            {restaurants.length === 0 && searchValue === ""
              ? "Loading data..."
              : "No results found."}
          </CommandEmpty>

          {filteredRestaurants.length > 0 && (
            <CommandGroup heading="Restaurants">
              {filteredRestaurants.map((restaurant) => {
                const IconComponent = restaurant.icon;
                return (
                  <CommandItem
                    key={`restaurant-${restaurant.id}`}
                    className="flex items-center gap-3 p-3"
                  >
                    <IconComponent className="h-5 w-5 text-orange-500" />
                    <div className="flex flex-col">
                      <span className="font-medium">{restaurant.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {restaurant.cuisine} Cuisine
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {filteredMenuItems.length > 0 && (
            <CommandGroup heading="Menu Items">
              {filteredMenuItems.map((menuItem, index) => {
                const IconComponent = menuItem.restaurantIcon;
                return (
                  <CommandItem
                    key={`menu-${menuItem.restaurantName}-${menuItem.item.name}-${index}`}
                    className="flex items-center gap-3 p-3"
                  >
                    <IconComponent className="h-4 w-4 text-orange-500" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">
                        {menuItem.restaurantName} / {menuItem.item.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {menuItem.item.description}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      <span className="text-xl text-neutral-100">
                        {menuItem.item.price}
                      </span>{" "}
                      <span className="text-neutral-300 font-medium">THB</span>
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}