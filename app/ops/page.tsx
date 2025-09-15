"use client";

import Nav, { OpsNavHandle } from "@/components/coreUI/internalCoreUI/opsNav";
import React, { useCallback, useState, useEffect, useRef } from "react";

const exampleOrders = [
  { id: 1, oid: "417a", items: ["item1", "item2"] },
  { id: 2, oid: "418b", items: ["item3"] },
  { id: 3, oid: "419c", items: ["item4", "item5", "item6"] },
];

export default function Page() {
  const navRef = useRef<OpsNavHandle>(null);
  const todoButtonLabel = "TRIAGE >>";
  const inprogressButtonLabel = "COMPLETE >>";

  type Order = {
    id: number;
    oid: string;
    items: string[];
    status: "received" | "making" | "done";
  };

  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = useCallback(() => {
    setOrders(
      exampleOrders.map((o) => ({
        ...o,
        status: "received",
      })),
    );
    navRef.current?.flash();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  const advanceOrder = (id: number) =>
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status:
                o.status === "received"
                  ? "making"
                  : o.status === "making"
                    ? "done"
                    : "done",
            }
          : o,
      ),
    );

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
                          <p>item #{o.id}</p>
                          <p className="text-[#ffa11c]">
                            oid {`>`}
                            {o.oid}
                            {`<`}
                          </p>
                        </div>
                        <div className="text-xs text-neutral-400 space-y-0.5">
                          {o.items.map((it, i) => (
                            <p key={i}>{it}</p>
                          ))}
                        </div>
                        {o.status !== "done" && (
                          <button
                            onClick={() => advanceOrder(o.id)}
                            className="mt-1 text-center bg-white text-black text-xs py-1 hover:bg-neutral-200"
                          >
                            {o.status === "received"
                              ? todoButtonLabel
                              : inprogressButtonLabel}
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
    </main>
  );
}
