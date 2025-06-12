"use client";

import * as React from "react";
import { ChefHat, Coffee, LucideIcon, Pizza, Utensils } from "lucide-react";
import fuzzysort from "fuzzysort";

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
  const [restaurants, setRestaurants] = React.useState<RestaurantProcessed[]>(
    [],
  );

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/testData/stores.json");
        if (!response.ok) {
          console.error("ID[3] HTTP error ", response.status);
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

    fetchRestaurants().catch((error) => {
      console.error("ID[1] Fetch error ", error);
    });
  }, []);

  const filteredRestaurants = React.useMemo(() => {
    if (!searchValue) return restaurants;
    const results = fuzzysort.go(searchValue, restaurants, {
      keys: ["name", "cuisine"],
      threshold: -10000,
    });
    return results.map((result) => result.obj);
  }, [searchValue, restaurants]);

  const allDisplayableMenuItems = React.useMemo((): DisplayableMenuItem[] => {
    return restaurants.flatMap((restaurant) =>
      restaurant.menu.map((item) => ({
        restaurantName: restaurant.name,
        restaurantIcon: restaurant.icon,
        item: item,
      })),
    );
  }, [restaurants]);

  const filteredMenuItems = React.useMemo((): DisplayableMenuItem[] => {
    if (!searchValue) {
      return allDisplayableMenuItems;
    }

    const allMenuItemsToSearch = restaurants.flatMap((restaurant) =>
      restaurant.menu.map((item) => ({
        itemName: item.name,
        itemDescription: item.description,
        originalItem: item,
        restaurantName: restaurant.name,
        restaurantIcon: restaurant.icon,
      })),
    );

    if (allMenuItemsToSearch.length === 0) return [];

    const results = fuzzysort.go(searchValue, allMenuItemsToSearch, {
      keys: ["itemName", "itemDescription"],
      threshold: -10000,
    });

    return results.map(
      (result): DisplayableMenuItem => ({
        restaurantName: result.obj.restaurantName,
        restaurantIcon: result.obj.restaurantIcon,
        item: result.obj.originalItem,
      }),
    );
  }, [searchValue, restaurants, allDisplayableMenuItems]);

  return (
    <div className="flex items-center justify-center my-4 dark">
      <Command className="rounded-lg border shadow-md md:min-w-[500px] max-w-2xl">
        <CommandInput
          placeholder="Search restaurants or menu items..."
          value={searchValue}
          onValueChange={setSearchValue}
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
                    key={restaurant.id}
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
                    key={`${menuItem.restaurantName}-${menuItem.item.name}-${index}`}
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
