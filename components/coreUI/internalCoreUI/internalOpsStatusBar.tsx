"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import EditButton from "./internalEditStoreOptionButton";

type Order = {
  id: number;
  oid: string;
  items: string[];
  status: "received" | "making" | "done" | "paid";
  clientUsername: string;
  time: string;
  startAt: number;
};

export default function StatusBar({ orders }: { orders: Order[] }) {
  const counts = {
    received: orders.filter((o) => o.status === "received").length,
    making: orders.filter((o) => o.status === "making").length,
    done: orders.filter((o) => o.status === "done").length,
    paid: orders.filter((o) => o.status === "paid").length,
  };

  const [nowMs, setNowMs] = useState<number>(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const paidOrders = useMemo(
    () => orders.filter((o) => o.status === "paid"),
    [orders],
  );

  const moveTo = async (oid: string, status: 1 | 2 | 3) => {
    try {
      const res = await fetch("/api/updateOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ oid, status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}) as any);
        toast.error("failed to override order status", {
          description: err?.error || "unknown error",
        });
        return;
      }
      toast.success(`OID >${oid}< moved to status ${status}`, {
        description: "request sent to server",
      });
    } catch (e) {
      toast.error("network error overriding order status", {
        description: (e as Error).message || "unknown error",
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 flex justify-between text-sm text-white p-1 blp_prop">
      <span>
        received: {counts.received} | making: {counts.making} | done:{" "}
        {counts.done} | paid: {counts.paid}
      </span>
      <Dialog>
        <DialogTrigger asChild>
          <div>
            <span className="text-[#FF0000] hover:cursor-pointer">
              {"<mod>"}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto dark blp-prop">
          <DialogHeader>
            <DialogTitle className="blp_prop font-normal">
              store config menu
            </DialogTitle>
          </DialogHeader>
          <div className="blp_prop">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="dark w-full">
                  <span className="hover:cursor-pointer">
                    override paid order
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto dark">
                <DialogHeader>
                  <DialogTitle className="blp_prop font-normal">
                    override paid orders ({counts.paid})
                  </DialogTitle>
                </DialogHeader>
                <div className="blp_prop space-y-2">
                  {paidOrders.length === 0 ? (
                    <div className="text-xs text-neutral-400 italic">
                      list empty
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {paidOrders.map((o) => (
                        <li
                          key={o.id}
                          className="border border-neutral-700 p-2 flex flex-col gap-1 bg-neutral-950"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p>
                              #{o.id} {">>"} {o.clientUsername}
                            </p>
                            <p className="text-[#ffa11c]">
                              oid {`>`}
                              {o.oid}
                              {`<`}
                            </p>
                          </div>
                          <p className="text-xs">@ {o.time}</p>
                          <div className="text-lg text-white space-y-0.5 mt-2">
                            {o.items.map((it, i) => (
                              <p key={i}>
                                <span className="text-neutral-400">
                                  {i + 1}.
                                </span>{" "}
                                {it}
                              </p>
                            ))}
                          </div>
                          <div className="mt-1 flex gap-1">
                            {/* might want to change the btn text to be more descriptive */}
                            <button
                              onClick={() => moveTo(o.oid, 1)}
                              className="flex-1 text-center bg-white text-black text-xs py-1 hover:bg-neutral-200"
                            >
                              MV@1
                            </button>
                            <button
                              onClick={() => moveTo(o.oid, 2)}
                              className="flex-1 text-center bg-white text-black text-xs py-1 hover:bg-neutral-200"
                            >
                              MV@2
                            </button>
                            <button
                              onClick={() => moveTo(o.oid, 3)}
                              className="flex-1 text-center bg-white text-black text-xs py-1 hover:bg-neutral-200"
                            >
                              MV@3
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="blp_prop">
            <EditButton />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
