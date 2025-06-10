"use client";

import * as React from "react";
import { ChefHat, Coffee, Pizza, Utensils } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// mock data for restaurants and their menus
const restaurants = [
  {
    id: 1,
    name: "Bella Italia",
    cuisine: "Italian",
    icon: Pizza,
    menu: [
      {
        name: "Margherita Pizza",
        price: "$18",
        description: "Fresh mozzarella, tomato sauce, basil",
      },
      {
        name: "Spaghetti Carbonara",
        price: "$22",
        description: "Eggs, pancetta, parmesan, black pepper",
      },
      {
        name: "Tiramisu",
        price: "$12",
        description: "Classic Italian dessert with coffee and mascarpone",
      },
      {
        name: "Caesar Salad",
        price: "$14",
        description: "Romaine lettuce, croutons, parmesan",
      },
    ],
  },
  {
    id: 2,
    name: "Tokyo Sushi Bar",
    cuisine: "Japanese",
    icon: ChefHat,
    menu: [
      {
        name: "Salmon Sashimi",
        price: "$24",
        description: "Fresh Atlantic salmon, 8 pieces",
      },
      {
        name: "Dragon Roll",
        price: "$16",
        description: "Eel, cucumber, avocado, eel sauce",
      },
      {
        name: "Miso Soup",
        price: "$6",
        description: "Traditional soybean paste soup",
      },
      {
        name: "Chicken Teriyaki",
        price: "$19",
        description: "Grilled chicken with teriyaki glaze",
      },
    ],
  },
  {
    id: 3,
    name: "The Coffee House",
    cuisine: "Cafe",
    icon: Coffee,
    menu: [
      {
        name: "Cappuccino",
        price: "$5",
        description: "Espresso with steamed milk foam",
      },
      {
        name: "Avocado Toast",
        price: "$12",
        description: "Sourdough bread with smashed avocado",
      },
      {
        name: "Blueberry Muffin",
        price: "$4",
        description: "Fresh baked with wild blueberries",
      },
      {
        name: "Green Smoothie",
        price: "$8",
        description: "Spinach, banana, apple, ginger",
      },
    ],
  },
  {
    id: 4,
    name: "Spice Garden",
    cuisine: "Indian",
    icon: Utensils,
    menu: [
      {
        name: "Butter Chicken",
        price: "$20",
        description: "Creamy tomato curry with tender chicken",
      },
      {
        name: "Biryani",
        price: "$18",
        description: "Fragrant basmati rice with spices",
      },
      {
        name: "Naan Bread",
        price: "$5",
        description: "Traditional Indian flatbread",
      },
      {
        name: "Mango Lassi",
        price: "$6",
        description: "Yogurt drink with fresh mango",
      },
    ],
  },
];

export default function ContextSearch() {
  const [searchValue, setSearchValue] = React.useState("");

  const filteredRestaurants = React.useMemo(() => {
    if (!searchValue) return restaurants;

    return restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }, [searchValue]);

  const filteredMenuItems = React.useMemo(() => {
    if (!searchValue) return [];

    const menuItems: Array<{
      restaurantName: string;
      restaurantIcon: React.ComponentType<{ className?: string }>;
      item: { name: string; price: string; description: string };
    }> = [];

    restaurants.forEach((restaurant) => {
      restaurant.menu.forEach((item) => {
        if (
          item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.description.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          menuItems.push({
            restaurantName: restaurant.name,
            restaurantIcon: restaurant.icon,
            item,
          });
        }
      });
    });

    return menuItems;
  }, [searchValue]);

  return (
    <div className="flex items-center justify-center p-4 dark">
      <Command className="rounded-lg border shadow-md md:min-w-[500px] max-w-2xl">
        <CommandInput
          placeholder="Search restaurants or menu items..."
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>No restaurants or menu items found.</CommandEmpty>

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
                    key={index}
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
                      {menuItem.item.price}
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
