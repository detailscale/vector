"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type MenuItem = {
  name: string;
  price?: string | number;
  description?: string;
};

async function postEdit(body: any) {
  const res = await fetch("/api/editStore", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.error || "save failed");
  return data;
}

export default function EditButton() {
  const [open, setOpen] = useState(false);

  const [nameValue, setNameValue] = useState("");
  const [savingName, setSavingName] = useState(false);

  const handleSaveName = async () => {
    if (!nameValue.trim()) {
      toast.error("enter a name");
      return;
    }
    try {
      setSavingName(true);
      await postEdit({ path: "name", value: nameValue.trim() });
      toast.success("store name saved");
    } catch (e: any) {
      toast.error(e.message || "failed to save name");
    } finally {
      setSavingName(false);
    }
  };

  const [receivingOrders, setReceivingOrders] = useState(false);
  const [savingReceiving, setSavingReceiving] = useState(false);
  const handleSaveReceiving = async () => {
    try {
      setSavingReceiving(true);
      await postEdit({
        path: "status.receivingOrders",
        value: receivingOrders,
      });
      toast.success("receiving orders updated");
    } catch (e: any) {
      toast.error(e.message || "failed to save setting");
    } finally {
      setSavingReceiving(false);
    }
  };

  const [itemsOpen, setItemsOpen] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [savingItems, setSavingItems] = useState(false);

  const loadItems = async () => {
    try {
      setLoadingItems(true);
      const res = await fetch("/api/listItems", { cache: "no-store" });
      const data = await res.json().catch(() => []);
      if (!res.ok)
        throw new Error((data as any)?.error || "failed to load items");
      const normalized: MenuItem[] = Array.isArray(data)
        ? data.map((d: any) => ({
            name: String(d?.name ?? ""),
            price: d?.price ?? "",
            description: d?.description ?? "",
          }))
        : [];
      setItems(normalized);
    } catch (e: any) {
      toast.error(e.message || "could not load items");
      setItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    if (itemsOpen) loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsOpen]);

  const addItem = () =>
    setItems((prev) => [...prev, { name: "", price: "", description: "" }]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const updateItem = (idx: number, patch: Partial<MenuItem>) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );

  const canSaveItems = useMemo(() => {
    if (!Array.isArray(items)) return false;
    for (const it of items) {
      if (!it.name?.trim()) return false;
      if (it.price !== undefined && it.price !== null) {
        const p =
          typeof it.price === "string" ? it.price.trim() : String(it.price);
        if (p !== "" && isNaN(Number(p))) return false;
      }
    }
    return true;
  }, [items]);

  const handleSaveItems = async () => {
    if (!canSaveItems) {
      toast.error("fix validation errors before saving");
      return;
    }
    try {
      setSavingItems(true);
      const value = items.map((it) => ({
        name: it.name.trim(),
        price:
          typeof it.price === "number" ? it.price : (it.price ?? "").toString(),
        description: it.description ?? "",
      }));
      await postEdit({ path: "menu", value });
      toast.success("items saved");
      setItemsOpen(false);
    } catch (e: any) {
      toast.error(e.message || "failed to save items");
    } finally {
      setSavingItems(false);
    }
  };

  return (
    <main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="dark w-full">
            <span className="hover:cursor-pointer">edit store options</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto dark">
          <DialogHeader>
            <DialogTitle className="blp_prop font-normal">
              edit store options
            </DialogTitle>
          </DialogHeader>
          <section className="space-y-2 py-2">
            <Label htmlFor="store-name">store name</Label>
            <Input
              id="store-name"
              placeholder="enter new store name"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSaveName}
                disabled={savingName || !nameValue.trim()}
              >
                {savingName ? "saving" : "save"}
              </Button>
            </div>
          </section>

          <div className="h-px bg-border my-3" />

          <section className="space-y-2 py-2">
            <Label>accepting orders</Label>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="text-sm text-muted-foreground">
                toggle to accept or pause new orders
              </div>
              <Switch
                checked={receivingOrders}
                onCheckedChange={setReceivingOrders}
                aria-label="receiving orders"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveReceiving} disabled={savingReceiving}>
                {savingReceiving ? "saving" : "save"}
              </Button>
            </div>
          </section>

          <div className="h-px bg-border my-3" />

          <section className="py-2">
            <Dialog open={itemsOpen} onOpenChange={setItemsOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                  edit store items
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto dark">
                <DialogHeader>
                  <DialogTitle className="blp_prop font-normal">
                    edit items
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 blp-prop">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      warning: all changes are immediate and live
                    </div>
                    <Button
                      size="sm"
                      onClick={loadItems}
                      disabled={loadingItems}
                    >
                      {loadingItems ? "loading" : "reload"}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {items.length === 0 && !loadingItems ? (
                      <div className="text-sm text-muted-foreground">
                        no items yet
                      </div>
                    ) : null}

                    {items.map((it, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-end border p-3 rounded-md"
                      >
                        <div className="col-span-4 space-y-1">
                          <Label className="text-xs">name</Label>
                          <Input
                            value={it.name}
                            onChange={(e) =>
                              updateItem(idx, { name: e.target.value })
                            }
                            placeholder="item name"
                          />
                        </div>
                        <div className="col-span-3 space-y-1">
                          <Label className="text-xs">price</Label>
                          <Input
                            value={it.price as any}
                            onChange={(e) =>
                              updateItem(idx, { price: e.target.value })
                            }
                            placeholder="0"
                            inputMode="decimal"
                          />
                        </div>
                        <div className="col-span-4 space-y-1">
                          <Label className="text-xs">description</Label>
                          <Input
                            value={it.description ?? ""}
                            onChange={(e) =>
                              updateItem(idx, { description: e.target.value })
                            }
                            placeholder="item description"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end ml-8">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItem(idx)}
                          >
                            R
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={addItem}>
                      add item
                    </Button>
                    <Button
                      onClick={handleSaveItems}
                      disabled={!canSaveItems || savingItems}
                    >
                      {savingItems ? "saving" : "save"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </section>
        </DialogContent>
      </Dialog>
    </main>
  );
}
