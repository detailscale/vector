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
import { addToCart } from "@/components/coreUI/internalCoreUI/internalOrderButton";

type Price = number | string;

interface MenuItem {
  name: string;
  price: Price;
  description?: string;
}

interface RestaurantIncoming {
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

interface ContextSearchProps {
  restaurants?: RestaurantIncoming[];
}

const iconMap: { [key: string]: LucideIcon } = {
  Pizza: Pizza,
  ChefHat: ChefHat,
  Coffee: Coffee,
  Utensils: Utensils,
};

export default function ContextSearch({
  restaurants: restaurantsProp,
}: ContextSearchProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [restaurants, setRestaurants] = React.useState<RestaurantProcessed[]>(
    [],
  );
  const [filteredMenuItems, setFilteredMenuItems] = React.useState<
    DisplayableMenuItem[]
  >([]);

  React.useEffect(() => {
    if (restaurantsProp !== undefined) {
      const processedData: RestaurantProcessed[] = (restaurantsProp || []).map(
        (restaurant) => ({
          ...restaurant,
          icon: iconMap[restaurant.icon] || Utensils,
        }),
      );
      setRestaurants(processedData);
      return;
    }

    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/stores", { cache: "no-store" });
        if (!response.ok) {
          console.error("ID[3] HTTP error ", response.status);
          return;
        }
        const data: RestaurantIncoming[] = await response.json();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantsProp]);

  React.useEffect(() => {
    const performSearch = () => {
      const searchTerm = searchValue.trim().toLowerCase();

      if (!searchTerm) {
        const allMenuItems = restaurants.flatMap((restaurant) =>
          (restaurant.menu || []).map((item) => ({
            restaurantName: restaurant.name,
            restaurantIcon: restaurant.icon,
            item: item,
          })),
        );
        setFilteredMenuItems(allMenuItems);
        return;
      }

      const matchingMenuItems: DisplayableMenuItem[] = [];
      restaurants.forEach((restaurant) => {
        if (restaurant.menu && Array.isArray(restaurant.menu)) {
          restaurant.menu.forEach((item) => {
            const nameMatch = item.name.toLowerCase().includes(searchTerm);
            const descMatch = (item.description || "")
              .toLowerCase()
              .includes(searchTerm);
            const restMatch = restaurant.name
              .toLowerCase()
              .includes(searchTerm);

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
      setFilteredMenuItems(matchingMenuItems);
    };

    performSearch();
  }, [searchValue, restaurants]);

  const handleInputChange = React.useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  return (
    <div className="flex items-center justify-center my-4 dark">
      <Command
        className="rounded-lg border shadow-md md:min-w-[500px] max-w-2xl"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search menu items..."
          value={searchValue}
          onValueChange={handleInputChange}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            {restaurants.length === 0 && searchValue === ""
              ? "Loading data..."
              : "No results found."}
          </CommandEmpty>

          {filteredMenuItems.length > 0 && (
            <CommandGroup heading="Menu Items">
              {filteredMenuItems.map((menuItem, index) => {
                const IconComponent = menuItem.restaurantIcon;
                const priceNumber =
                  typeof menuItem.item.price === "number"
                    ? menuItem.item.price
                    : parseFloat(menuItem.item.price);
                return (
                  <CommandItem
                    key={`menu-${menuItem.restaurantName}-${menuItem.item.name}-${index}`}
                    className="flex items-center gap-3 p-3"
                    onSelect={() =>
                      addToCart(
                        menuItem.item.name,
                        priceNumber,
                        menuItem.restaurantName,
                      )
                    }
                  >
                    <IconComponent className="h-4 w-4 text-orange-500" />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium">{menuItem.item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {menuItem.restaurantName}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      <span className="text-xl text-neutral-100">
                        {Number.isFinite(priceNumber)
                          ? priceNumber
                          : menuItem.item.price}
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
