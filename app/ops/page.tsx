"use client";

import StatusBar from "@/components/coreUI/internalCoreUI/internalOpsStatusBar";
import Nav, { OpsNavHandle } from "@/components/coreUI/internalCoreUI/opsNav";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function Page() {
  const navRef = useRef<OpsNavHandle>(null);
  const todoButtonLabel = "TRIAGE >>";
  const inprogressButtonLabel = "COMPLETE >>";
  const finalButtonLabel = "PAID >>";

  type Order = {
    id: number;
    oid: string;
    items: string[];
    status: "received" | "making" | "done" | "paid";
    clientUsername: string;
    time: string;
    startAt: number;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const knownOidsRef = useRef<Set<string>>(new Set());
  const inFlightRef = useRef<boolean>(false);
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const firstLoadDoneRef = useRef<boolean>(false);

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

  const toUiStatus = (s: number): Order["status"] => {
    switch (s) {
      case 1:
        return "received";
      case 2:
        return "making";
      case 3:
        return "done";
      case 4:
        return "paid";
      default:
        return "received";
    }
  };

  type orderType = {
    time: string;
    id: number;
    oid: string;
    status: number;
    clientUsername: string;
    items: Array<{ name: string; price: string | null }>;
    storeName?: string;
  };

  const loadOrders = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const res = await fetch("/api/getOrders", {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        toast.error("unexpected error on response");
        return;
      }
      const data: orderType[] = await res.json();
      const next = (Array.isArray(data) ? data : []).map((o) => ({
        id: o.id,
        oid: o.oid,
        items: Array.isArray(o.items) ? o.items.map((it) => it.name) : [],
        status: toUiStatus(Number(o.status)),
        clientUsername: o.clientUsername,
        time: new Date(o.time).toLocaleString(undefined, { hour12: false }),
        startAt: new Date(o.time).getTime(),
      }));

      const fetchedOids = new Set(next.map((o) => o.oid));
      const known = knownOidsRef.current;

      let shouldFlash = false;
      if (!firstLoadDoneRef.current) {
        firstLoadDoneRef.current = true;
      } else {
        if (fetchedOids.size === 0) {
          shouldFlash = false;
        } else if (known.size === 0) {
          shouldFlash = true;
        } else {
          for (const oid of fetchedOids) {
            if (!known.has(oid)) {
              shouldFlash = true;
              break;
            }
          }
        }
      }
      if (shouldFlash) navRef.current?.flash();
      knownOidsRef.current = fetchedOids;

      setOrders(next);
    } catch (e) {
      toast.error("unexpected error loading orders");
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (cancelled) return;
      await loadOrders();
    };
    run();
    const id = setInterval(run, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [loadOrders]);
  const advanceOrder = async (id: number) => {
    const current = orders.find((o) => o.id === id);
    if (!current) return;

    let nextStatus: Order["status"];
    let statusNumber: 2 | 3 | 4;
    if (current.status === "received") {
      nextStatus = "making";
      statusNumber = 2;
    } else if (current.status === "making") {
      nextStatus = "done";
      statusNumber = 3;
    } else {
      nextStatus = "paid";
      statusNumber = 4;
    }

    const prevOrders = orders;
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o)),
    );

    try {
      const res = await fetch("/api/updateOrders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ oid: current.oid, status: statusNumber }),
      });
      if (!res.ok) {
        setOrders(prevOrders);
        const err = await res.json().catch(() => ({}) as any);
        toast.error(err?.error || "failed to update order");
      }
    } catch (e) {
      setOrders(prevOrders);
      toast.error("network error updating order");
    }
  };

  const columns: Array<"received" | "making" | "done"> = [
    "received",
    "making",
    "done",
  ];

  return (
    <main>
      <Nav ref={navRef} />
      <div id="CONTENT" className="blp_prop">
        <div id="MAIN" className="my-1 mx-1">
          <div className="kanban flex items-start gap-1">
            {columns.map((col) => (
              <section
                key={col}
                data-column={col}
                className="kanban-col flex-1 min-w-[220px] bg-neutral-900 border-4 border-neutral-800 overflow-hidden"
              >
                <div className="bg-neutral-800 pb-1">
                  <h2>{col}</h2>
                </div>
                <ul className="kanban-list flex flex-col gap-2 min-h-[60px] p-2">
                  {orders
                    .filter((o) => o.status === col)
                    .map((o) => (
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
                        {o.status !== "done" && (
                          <p className="text-xs">
                            ALIVE TIME: {formatDuration(nowMs - o.startAt)}
                          </p>
                        )}
                        <div className="text-lg text-white space-y-0.5 mt-2">
                          {o.items.map((it, i) => (
                            <p key={i}>
                              <span className="text-neutral-400">{i + 1}.</span>{" "}
                              {it}
                            </p>
                          ))}
                        </div>
                        {o.status !== "paid" && (
                          <button
                            onClick={() => advanceOrder(o.id)}
                            className="mt-1 text-center bg-white text-black text-xs py-1 hover:bg-neutral-200"
                          >
                            {o.status === "received"
                              ? todoButtonLabel
                              : o.status === "making"
                                ? inprogressButtonLabel
                                : finalButtonLabel}
                          </button>
                        )}
                      </li>
                    ))}
                  {orders.filter((o) => o.status === col).length === 0 && (
                    <li className="text-xs text-neutral-600 italic">empty</li>
                  )}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8.5">
        <StatusBar orders={orders} />
      </div>
    </main>
  );
}
