// TODO: rate limiting, account lockout, input validation/sanitation, jwt expiration

const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

if (!PORT || !JWT_SECRET) {
  console.error("either PORT or JWT_SECRET env var is missing");
  process.exit(1);
}

if (JWT_SECRET.length < 32) {
  console.error("your jwt secret is ass");
  process.exit(1);
}

const USERS_DIR = path.join(__dirname, "users");
const STORES_DIR = path.join(__dirname, "stores");
const ORDERS_DIR = path.join(__dirname, "orders");
fs.ensureDirSync(USERS_DIR);
fs.ensureDirSync(STORES_DIR);
fs.ensureDirSync(ORDERS_DIR);
fs.ensureDirSync(path.join(USERS_DIR, "client"));
fs.ensureDirSync(path.join(USERS_DIR, "seller"));

function readCsvFileSync(filepath) {
  if (!fs.existsSync(filepath)) return [];
  const txt = fs.readFileSync(filepath, "utf8").trim();
  if (!txt) return [];
  return txt.split(/\r?\n/).map((line) => line.split(",").map((s) => s.trim()));
}

function findUserFromCsv(role, username) {
  const csvPath = path.join(USERS_DIR, role, "users.csv");
  const rows = readCsvFileSync(csvPath);
  for (const r of rows) {
    if (r[0] === username) {
      return { username: r[0], hash: r[1] || "", storeName: r[2] || null };
    }
  }
  return null;
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function verifyAuthHeader(req) {
  const h = req.headers["authorization"] || "";
  if (!h.startsWith("Bearer ")) return null;
  const token = h.slice(7);
  try {
    const p = jwt.verify(token, JWT_SECRET);
    return p;
  } catch (e) {
    return null;
  }
}

function parseBasicAuth(req) {
  const h = req.headers["authorization"] || "";
  if (!/^basic /i.test(h)) return null;
  const b64 = h.slice(6).trim();
  let decoded;
  try {
    decoded = Buffer.from(b64, "base64").toString("utf8");
  } catch (e) {
    return null;
  }
  const idx = decoded.indexOf(":");
  if (idx === -1) return null;
  const username = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);
  if (!username || !password) return null;
  return { username, password };
}

function storeFilePath(storeName) {
  return path.join(STORES_DIR, `${storeName}.json`);
}

function loadStore(storeName) {
  const p = storeFilePath(storeName);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return null;
  }
}

function saveStore(storeName, obj) {
  fs.writeFileSync(
    storeFilePath(storeName),
    JSON.stringify(obj, null, 2),
    "utf8",
  );
}

function ordersFilePath(storeName) {
  return path.join(ORDERS_DIR, `orders-${storeName}.json`);
}

function loadOrders(storeName) {
  const p = ordersFilePath(storeName);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveOrders(storeName, arr) {
  fs.writeFileSync(
    ordersFilePath(storeName),
    JSON.stringify(arr, null, 2),
    "utf8",
  );
}

function nextOrderIdForStore(storeName) {
  const arr = loadOrders(storeName);
  if (arr.length === 0) return 1;
  return Math.max(...arr.map((o) => o.id || 0)) + 1;
}

function makeOid4hex() {
  return crypto.randomBytes(2).toString("hex");
}

function utcIsoMsNow() {
  return new Date().toISOString();
}

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send({ ok: true }));

app.post("/login/client", async (req, res) => {
  let creds = parseBasicAuth(req);
  if (!creds) {
    const { username, password } = req.body || {};
    creds = username && password ? { username, password } : null;
  }
  if (!creds) return res.status(400).json({ error: "!token" });
  const user = findUserFromCsv("client", creds.username);
  if (!user) return res.status(401).json({ error: "bad token" });
  const ok = await bcrypt.compare(creds.password, user.hash);
  if (!ok) return res.status(401).json({ error: "bad token" });
  const token = signToken({ username: user.username, role: "client" });
  res.setHeader("authorization", `Bearer ${token}`);
  res.json({ token });
});

app.post("/login/seller", async (req, res) => {
  let creds = parseBasicAuth(req);
  if (!creds) {
    const { username, password } = req.body || {};
    creds = username && password ? { username, password } : null;
  }
  if (!creds) return res.status(400).json({ error: "!token" });
  const user = findUserFromCsv("seller", creds.username);
  if (!user) return res.status(401).json({ error: "bad token" });
  const ok = await bcrypt.compare(creds.password, user.hash);
  if (!ok) return res.status(401).json({ error: "bad token" });
  if (user.storeName) {
    const store = loadStore(user.storeName);
    if (!store) {
      console.error(
        `seller ${user.username} assigned to missing store '${user.storeName}'`,
      );
      return res
        .status(400)
        .json({ error: "store assigned to user not found" });
    }
  }
  const token = signToken({
    username: user.username,
    role: "seller",
    storeName: user.storeName || null,
  });
  res.setHeader("authorization", `Bearer ${token}`);
  res.json({ token });
});

app.get("/stores.json", (req, res) => {
  const p = verifyAuthHeader(req);
  if (!p) return res.status(401).json({ error: "bad token" });
  const files = fs.readdirSync(STORES_DIR).filter((f) => f.endsWith(".json"));
  const arr = files
    .map((f) => {
      try {
        const obj = JSON.parse(
          fs.readFileSync(path.join(STORES_DIR, f), "utf8"),
        );
        return obj;
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);

  for (const s of arr) {
    const storeName = s.name;
    const orders = loadOrders(storeName);
    const q = orders.filter((o) => o.status !== 3).length;
    if (Array.isArray(s.status) && s.status[0])
      s.status[0].queueCount = String(q);
  }
  res.json(arr);
});

app.post("/store/:storeName/edit", (req, res) => {
  const token = verifyAuthHeader(req);
  if (!token || token.role !== "seller")
    return res.status(401).json({ error: "bad role" });
  const storeName = req.params.storeName;
  if (token.storeName && token.storeName !== storeName)
    return res.status(403).json({ error: "store mismatch" });
  const store = loadStore(storeName);
  if (!store) return res.status(404).json({ error: "store not found" });
  const body = req.body || {};
  const { path: propPath, value } = body;
  if (typeof propPath !== "string")
    return res.status(400).json({ error: "!path" });

  const parts = propPath.split(".");
  if (parts.length === 1) {
    const k = parts[0];
    if (k === "id") {
      if (typeof value !== "number")
        return res.status(400).json({ error: "bad id" });
      store.id = value;
    } else if (k === "name") {
      store.name = String(value);
    } else if (k === "cuisine") {
      store.cuisine = String(value);
    } else if (k === "menu") {
      if (!Array.isArray(value))
        return res.status(400).json({ error: "bad menu" });
      store.menu = value;
    } else {
      return res
        .status(400)
        .json({ error: "internal (critical) error, report this asap!" });
    }
    saveStore(storeName, store);
    return res.json({ ok: true, store });
  }

  if (
    parts[0] === "status" &&
    parts[1] === "0" &&
    parts[2] === "receivingOrders"
  ) {
    let v = value;
    if (typeof v === "string") v = v === "true";
    if (typeof v !== "boolean")
      return res.status(400).json({ error: "bad receivingOrders format" });
    if (!Array.isArray(store.status)) store.status = [{}];
    store.status[0].receivingOrders = String(v);
    saveStore(storeName, store);
    return res.json({ ok: true, store });
  }

  return res
    .status(400)
    .json({ error: "internal (critical) error, report this asap!" });
});

app.post("/orderPlacement", (req, res) => {
  const token = verifyAuthHeader(req);
  if (!token || token.role !== "client")
    return res.status(401).json({ error: "bad role" });

  const body = req.body;

  if (Array.isArray(body)) {
    const itemsArr = body;
    if (itemsArr.length === 0) return res.status(400).json({ error: "!items" });

    for (const it of itemsArr) {
      if (!it || typeof it !== "object")
        return res.status(400).json({ error: "bad item" });
      if (!it.storeName || typeof it.storeName !== "string")
        return res.status(400).json({ error: "!storeName" });
      const nm = it.itemName || it.name;
      if (!nm || typeof nm !== "string")
        return res.status(400).json({ error: "!itemName" });
    }

    const groups = new Map();
    for (const it of itemsArr) {
      const s = it.storeName;
      if (!groups.has(s)) groups.set(s, []);
      groups.get(s).push(it);
    }

    for (const [sName, itemsOfStore] of groups.entries()) {
      const store = loadStore(sName);
      if (!store)
        return res
          .status(404)
          .json({ error: "store not found", storeName: sName });
      const menuNames = new Set(
        Array.isArray(store.menu) ? store.menu.map((m) => String(m.name)) : [],
      );
      for (const it of itemsOfStore) {
        const nm = it.itemName || it.name;
        if (!menuNames.has(nm)) {
          return res.status(400).json({
            error: "item not found",
            storeName: sName,
            itemName: nm,
          });
        }
      }
    }

    const created = [];
    for (const [sName, itemsOfStore] of groups.entries()) {
      const id = nextOrderIdForStore(sName);
      const oid = makeOid4hex();
      const time = utcIsoMsNow();
      const itemNames = itemsOfStore
        .map((i) => i.itemName || i.name)
        .filter(Boolean);
      const order = {
        time,
        id,
        oid,
        items: itemNames,
        status: 1,
        clientUsername: token.username,
      };
      const orders = loadOrders(sName);
      orders.push(order);
      saveOrders(sName, orders);
      created.push({ storeName: sName, order });
    }

    return res.json({ ok: true, orders: created });
  }

  let storeName = body && body.storeName;
  let items = body && body.items;
  if (!storeName) return res.status(400).json({ error: "!storeName" });
  if (!Array.isArray(items)) return res.status(400).json({ error: "!items" });
  const store = loadStore(storeName);
  if (!store) return res.status(404).json({ error: "store not found" });

  const menuNames = new Set(
    Array.isArray(store.menu) ? store.menu.map((m) => String(m.name)) : [],
  );
  for (const it of items) {
    const nm = it && (it.itemName || it.name);
    if (!nm || !menuNames.has(nm))
      return res.status(400).json({ error: "item not found", itemName: nm });
  }

  const id = nextOrderIdForStore(storeName);
  const oid = makeOid4hex();
  const time = utcIsoMsNow();
  const itemNames = items.map((i) => i.itemName || i.name).filter(Boolean);
  const order = {
    time,
    id,
    oid,
    items: itemNames,
    status: 1,
    clientUsername: token.username,
  };

  const orders = loadOrders(storeName);
  orders.push(order);
  saveOrders(storeName, orders);
  res.json({ ok: true, order });
});

app.get("/getOrders", (req, res) => {
  const token = verifyAuthHeader(req);
  if (!token || token.role !== "seller")
    return res.status(401).json({ error: "bad role" });
  const storeName = token.storeName;
  if (!storeName)
    return res.status(400).json({ error: "token missing storeName" });
  const store = loadStore(storeName);
  if (!store) return res.status(404).json({ error: "store not found" });
  const orders = loadOrders(storeName);
  res.json(orders);
});

app.post("/updateOrders", (req, res) => {
  const token = verifyAuthHeader(req);
  if (!token || token.role !== "seller")
    return res.status(401).json({ error: "bad role" });
  const storeName = token.storeName;
  if (!storeName) return res.status(400).json({ error: "!storeName" });
  const { oid, status } = req.body || {};
  if (!oid || typeof status !== "number")
    return res.status(400).json({ error: "!oid" });
  if (![1, 2, 3].includes(status))
    return res.status(400).json({ error: "bad status" });
  const orders = loadOrders(storeName);
  const idx = orders.findIndex((o) => o.oid === oid);
  if (idx === -1) return res.status(404).json({ error: "order not found" });
  orders[idx].status = status;
  saveOrders(storeName, orders);
  res.json({ ok: true, order: orders[idx] });
});

let lastClearedAt = null;
function weeklyClearChecker() {
  const now = new Date();
  if (now.getDay() === 0 && now.getHours() === 12 && now.getMinutes() === 0) {
    const key = now.toISOString().slice(0, 16);
    if (lastClearedAt === key) return;
    const files = fs
      .readdirSync(ORDERS_DIR)
      .filter((f) => f.startsWith("orders-") && f.endsWith(".json"));
    for (const f of files) {
      fs.writeFileSync(path.join(ORDERS_DIR, f), "[]", "utf8");
    }
    lastClearedAt = key;
    console.log("orders cleared at", now.toISOString());
  }
}
setInterval(weeklyClearChecker, 60 * 1000);
function mainThread() {
  app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
  });
}
mainThread();
