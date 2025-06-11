"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface MenuItem {
  name: string;
  price: string;
  description: string;
}

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  icon: string;
  ratings: number;
  menu: MenuItem[];
  pageURL: string;
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalfStar
                  ? "text-yellow-400"
                  : "text-neutral-300"
            }`}
          >
            {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "★" : "★"}
          </span>
        ))}
      </div>
      <span className="text-xs text-muted-foreground ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function CompactStoreList() {
  const [restaurants, setRestaurants] = React.useState<Restaurant[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/testData/stores.json");
        if (!response.ok) {
          console.error("HTTP error ", response.status);
        }
        const data: Restaurant[] = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Fetch error ", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants().catch((error) => {
      console.error("Fetch error ", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto dark">
        <h2 className="text-xl mb-3">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-4 bg-neutral-800 rounded mb-2"></div>
                <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto dark">
      <h2 className="text-xl mb-3">Explore</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <Link href={`/stores/${restaurant.pageURL}`} key={restaurant.id}>
            <Card className="duration-150 cursor-pointer hover:bg-neutral-800 ease-in-out">
              <CardContent>
                <h3 className="text-base font-medium">{restaurant.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground capitalize">
                    {restaurant.cuisine}
                  </span>
                  <StarRating rating={restaurant.ratings} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
