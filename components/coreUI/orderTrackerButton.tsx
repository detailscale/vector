"use client";

import { Button } from "@/components/ui/button";
import { ScrollText } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function orderTrackerButton() {
  type OrderItem = { name: string; price: string | number };
  type Order = {
    id: number | string;
    oid?: string;
    storeName?: string;
    status?: number | string;
    time?: string | number | Date;
    clientUsername?: string;
    items?: OrderItem[];
    [k: string]: unknown;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let isMounted = true;
    let controller: AbortController | null = null;

    const load = async () => {
      try {
        controller?.abort();
        controller = new AbortController();
        setError(null);
        const res = await fetch("/api/getOrders", {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          if (res.status === 401) {
            if (isMounted) setOrders([]);
            return;
          }
          throw new Error(`http ${res.status}`);
        }
        const data = await res.json();
        const list: unknown = (data &&
          (data.orders ?? data.data ?? data)) as unknown;
        if (Array.isArray(list)) {
          if (isMounted) setOrders(list as Order[]);
        } else {
          if (isMounted) setOrders([]);
        }
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        if (isMounted) setError("failed to load orders");
      }
    };

    load();
    pollingRef.current = setInterval(load, 3000);

    return () => {
      isMounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
      controller?.abort();
    };
  }, []);

  return (
    <main>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-8 h-8 bg-[#171717] rounded-sm border border-[#2f2f2f] cursor-pointer hover:bg-[#262626] transition-all duration-150 ease-in-out">
            <ScrollText />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto dark font-outfit">
          <DialogHeader>
            <DialogTitle>
              <span className="font-normal">Your Orders</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {error && <p className="text-sm text-red-400">{error}</p>}
            {orders.map((order) => {
              const total = (order.items ?? []).reduce(
                (sum, it) => sum + (parseFloat(String(it.price)) || 0),
                0,
              );
              const fmt = (n: number) =>
                n.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });

              return (
                <div key={order.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-baseline mb-2">
                    <div>
                      <p className="font-medium">
                        oid: {order.oid} @ {order.storeName}
                      </p>
                      <p className="text-sm text-neutral-400 font-mono">
                        {order.time
                          ? new Date(order.time).toLocaleString()
                          : ""}
                      </p>
                    </div>
                    <div className="text-right text-sm text-neutral-300">
                      <p
                        className={`${
                          order.status === 1
                            ? "text-[#2196F3]"
                            : order.status === 2
                              ? "text-[#FF9800]"
                              : "text-[#4CAF50]"
                        }`}
                      >
                        {order.status === 1
                          ? "received"
                          : order.status === 2
                            ? "making"
                            : "done"}
                      </p>
                      <p className="font-medium">total: {fmt(total)}</p>
                    </div>
                  </div>
                  <ul className="text-sm text-neutral-300 mb-2 list-disc list-inside space-y-1">
                    {order.items?.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="text-neutral-400">
                          {fmt(parseFloat(String(item.price)) || 0)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {!error && orders.length === 0 && (
              <p className="text-base text-neutral-400 text-center py-8">
                No orders in database
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
