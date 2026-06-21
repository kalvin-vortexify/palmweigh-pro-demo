import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ---- THEME ------------------------------------------------------------------
const T = {
  bg: "#0a0e1a",
  surface: "#111827",
  card: "#161d2e",
  border: "#1e2a3a",
  accent: "#22d3a5",
  amber: "#f59e0b",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#8b5cf6",
  text: "#e2e8f0",
  mid: "#94a3b8",
  dim: "#475569",
};

// ---- CONSTANTS --------------------------------------------------------------
const COMPANY = "Johor Palm Resources Sdn Bhd";

const PRODUCTS = ["FFB", "EFB", "Shell", "Fiber", "Others"];

const AUDIT_REASONS = [
  "Wrong vehicle number entered",
  "Wrong supplier selected",
  "DN No. missing",
  "Manual weight correction",
  "Product selected wrongly",
  "Harvester correction",
  "Driver correction",
  "Backdated entry",
  "Other",
];

const HARVESTERS0 = [
  { id: "h1", name: "Zulkifli bin Hassan", active: true },
  { id: "h2", name: "Muthu a/l Rajan", active: true },
  { id: "h3", name: "Rosli bin Othman", active: true },
  { id: "h4", name: "Selvam a/l Kumar", active: true },
  { id: "h5", name: "Ong Boon Seng", active: true },
];

const STATIONS = [
  { id: "s1", name: "Johor Bahru", location: "Johor Bahru", prefix: "JB" },
  { id: "s2", name: "Segamat", location: "Segamat", prefix: "SG" },
  { id: "s3", name: "Muar", location: "Muar", prefix: "MU" },
  { id: "s4", name: "Kluang", location: "Kluang", prefix: "KLG" },
];

const SUPPLIERS0 = [
  {
    id: "sup1",
    name: "Johor Palm Resources Sdn Bhd",
    code: "JPR",
    address: "Johor Bahru, Johor",
    contact: "0197001001",
    active: true,
  },
  {
    id: "sup2",
    name: "Southern Agro Trading",
    code: "SAT",
    address: "Batu Pahat, Johor",
    contact: "0197001002",
    active: true,
  },
  {
    id: "sup3",
    name: "Green Harvest Plantation",
    code: "GHP",
    address: "Kluang, Johor",
    contact: "0197001003",
    active: true,
  },
  {
    id: "sup4",
    name: "Evergreen Palm Trading",
    code: "EPT",
    address: "Segamat, Johor",
    contact: "0197001004",
    active: true,
  },
  {
    id: "sup5",
    name: "Maju Palm Industries",
    code: "MPI",
    address: "Mersing, Johor",
    contact: "0197001005",
    active: true,
  },
];
const DRIVERS0 = [
  {
    id: "d1",
    name: "Ahmad bin Yusof",
    ic: "850312-01-5001",
    phone: "0197101001",
    rfid: "RF001",
    license: "GDL-001",
    stationId: "s1",
    active: true,
  },
  {
    id: "d2",
    name: "Azman bin Harun",
    ic: "880605-01-4002",
    phone: "0197101002",
    rfid: "RF002",
    license: "GDL-002",
    stationId: "s1",
    active: true,
  },
  {
    id: "d3",
    name: "Kumar Selvam",
    ic: "790120-01-3003",
    phone: "0197101003",
    rfid: "RF003",
    license: "GDL-003",
    stationId: "s2",
    active: true,
  },
  {
    id: "d4",
    name: "Raj Gopal",
    ic: "820114-01-2004",
    phone: "0197101004",
    rfid: "RF004",
    license: "GDL-004",
    stationId: "s2",
    active: true,
  },
  {
    id: "d5",
    name: "Lee Chee Wai",
    ic: "910930-01-1005",
    phone: "0197101005",
    rfid: "",
    license: "GDL-005",
    stationId: "s3",
    active: true,
  },
];
const VEHICLES0 = [
  {
    id: "v1",
    plate: "JPV 1234",
    type: "Lorry",
    tare: 8200,
    rfid: "RFV001",
    driverId: "d1",
    stationId: "s1",
    active: true,
  },
  {
    id: "v2",
    plate: "JQK 5678",
    type: "Lorry",
    tare: 7800,
    rfid: "RFV002",
    driverId: "d2",
    stationId: "s1",
    active: true,
  },
  {
    id: "v3",
    plate: "JRU 8899",
    type: "Truck",
    tare: 12400,
    rfid: "RFV003",
    driverId: "d3",
    stationId: "s2",
    active: true,
  },
  {
    id: "v4",
    plate: "JSD 1122",
    type: "Lorry",
    tare: 8000,
    rfid: "RFV004",
    driverId: "d4",
    stationId: "s2",
    active: true,
  },
  {
    id: "v5",
    plate: "JTK 3344",
    type: "Pickup",
    tare: 2800,
    rfid: "",
    driverId: "d5",
    stationId: "s3",
    active: true,
  },
];
const USERS0 = [
  {
    id: "u1",
    username: "admin",
    password: "admin",
    name: "Administrator",
    role: "admin",
  },
  {
    id: "u2",
    username: "operator",
    password: "1234",
    name: "Weighbridge Operator",
    role: "operator",
  },
  {
    id: "u3",
    username: "demo",
    password: "demo",
    name: "Demo User (UAT)",
    role: "operator",
  },
];

// txType: "PC" = Purchase/Receiving, "DC" = Delivery/Despatch
function makeTxId(prefix, txType, seq) {
  return prefix + "-" + txType + String(seq).padStart(6, "0");
}

function makeTx(i) {
  const sup = SUPPLIERS0[i % 5];
  const drv = DRIVERS0[i % 5];
  const veh = VEHICLES0[i % 5];
  const sta = STATIONS[i % 4];
  const txType = i % 4 === 0 ? "DC" : "PC"; // ~75% Purchase, 25% Delivery
  const gross = 14000 + Math.round(Math.random() * 6000);
  const tare = veh.tare;
  const date = new Date(Date.now() - (200 - i) * 3600000 * 3);
  return {
    id: makeTxId(sta.prefix, txType, i + 1),
    stationId: sta.id,
    stationPrefix: sta.prefix,
    txType: txType,
    txTypeName:
      txType === "DC" ? "Delivery / Despatch" : "Purchase / Receiving",
    supplierId: sup.id,
    supplierName: sup.name,
    supplierCode: sup.code,
    driverId: drv.id,
    driverName: drv.name,
    vehicleId: veh.id,
    plate: veh.plate,
    vehicleType: veh.type,
    product: PRODUCTS[i % 5],
    harvesters: [], // empty for seed; real tickets will have array
    dnNo: "",
    grossKg: gross,
    tareKg: tare,
    netKg: gross - tare,
    ticketType: txType === "DC" ? "Delivery Order" : "Normal Invoice",
    status: i % 15 === 0 ? "pending_out" : "completed",
    weightIn: date.toISOString(),
    weightOut:
      i % 15 === 0
        ? null
        : new Date(
            date.getTime() + 600000 + Math.random() * 600000,
          ).toISOString(),
    operator: "OPR001",
    createdBy: "operator",
    createdAt: date.toISOString(),
    ticketSource: "SCALE",
    remarks: "",
  };
}
const TX0 = Array.from({ length: 200 }, (_, i) => makeTx(i));
const COUNTERS0 = {
  "JB-PC": 1,
  "JB-DC": 1,
  "SG-PC": 1,
  "SG-DC": 1,
  "MU-PC": 1,
  "MU-DC": 1,
  "KLG-PC": 1,
  "KLG-DC": 1,
};

// ---- HELPERS ----------------------------------------------------------------
function fmt(n) {
  return n != null ? n.toLocaleString("en-MY") : "-";
}
function fmtD(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-MY", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function useLS(key, init) {
  const [val, setVal] = useState(function () {
    try {
      var s = localStorage.getItem(key);
      return s ? JSON.parse(s) : init;
    } catch (e) {
      return init;
    }
  });
  const set = useCallback(
    function (fn) {
      setVal(function (prev) {
        var next = typeof fn === "function" ? fn(prev) : fn;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {}
        return next;
      });
    },
    [key],
  );
  return [val, set];
}

// ---- ICON -------------------------------------------------------------------
function Ic(props) {
  var d = props.d,
    size = props.size || 16,
    color = props.color || T.mid;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

var IC = {
  dashboard: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z",
  weighIn: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  weighOut: "M5 12h14M12 5l7 7-7 7",
  queue:
    "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 0 2-2h2a2 2 0 0 0 2 2",
  records:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  supplier: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  vehicle:
    "M1 3h15l3 9H1zM1 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zm13 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",
  driver:
    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  scale: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  refresh:
    "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  print:
    "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  wifi: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  alert:
    "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  payroll:
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  rocket:
    "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2zM9 12H4s.55-3.53 2-4c1.62-.48 3 0 3 0M12 15v5s3.53-.55 4-2c.48-1.62 0-3 0-3",
  invoice:
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 18v-6M9 15h6",
};

// ---- SHARED UI --------------------------------------------------------------
var cardStyle = {
  background: T.card,
  border: "1px solid " + T.border,
  borderRadius: 12,
  padding: 20,
};

function Card(props) {
  return (
    <div style={Object.assign({}, cardStyle, props.style || {})}>
      {props.children}
    </div>
  );
}

function Badge(props) {
  var label = props.label,
    color = props.color || T.accent;
  return (
    <span
      style={{
        background: color + "22",
        color: color,
        border: "1px solid " + color + "44",
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        fontFamily: "IBM Plex Mono,monospace",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function Btn(props) {
  var label = props.label,
    icon = props.icon,
    onClick = props.onClick;
  var variant = props.variant || "primary";
  var small = props.small || false;
  var disabled = props.disabled || false;
  var full = props.full || false;
  var bgMap = {
    primary: T.accent,
    danger: T.red,
    amber: T.amber,
    blue: T.blue,
    ghost: T.border,
  };
  var bg = disabled ? T.border : bgMap[variant] || T.accent;
  var fg = variant === "ghost" ? T.mid : "#000";
  var iconColor = disabled ? T.dim : variant === "ghost" ? T.mid : "#000";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color: disabled ? T.dim : fg,
        border: "none",
        borderRadius: 8,
        padding: small ? "5px 10px" : "8px 16px",
        fontSize: small ? 11 : 13,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: 0.3,
        fontFamily: "IBM Plex Mono,monospace",
        width: full ? "100%" : undefined,
        justifyContent: full ? "center" : undefined,
      }}
    >
      {icon && <Ic d={IC[icon]} size={small ? 13 : 15} color={iconColor} />}
      {label}
    </button>
  );
}

var IS = {
  background: T.bg,
  border: "1px solid " + T.border,
  borderRadius: 8,
  padding: "8px 12px",
  color: T.text,
  fontSize: 13,
  fontFamily: "IBM Plex Mono,monospace",
  outline: "none",
  width: "100%",
};

function FInput(props) {
  var label = props.label,
    value = props.value,
    onChange = props.onChange;
  var type = props.type || "text",
    placeholder = props.placeholder || "";
  var options = props.options,
    required = props.required,
    style = props.style || {};
  return (
    <div
      style={Object.assign(
        { display: "flex", flexDirection: "column", gap: 4 },
        style,
      )}
    >
      {label && (
        <label
          style={{
            fontSize: 11,
            color: T.mid,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: "uppercase",
          }}
        >
          {label}
          {required ? " *" : ""}
        </label>
      )}
      {options ? (
        <select
          value={value}
          onChange={function (e) {
            onChange(e.target.value);
          }}
          style={IS}
        >
          <option value="">-- Select --</option>
          {options.map(function (o) {
            var val = o.value != null ? o.value : o;
            var lbl = o.label != null ? o.label : o;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={function (e) {
            onChange(e.target.value);
          }}
          placeholder={placeholder}
          style={IS}
        />
      )}
    </div>
  );
}

function StatCard(props) {
  var label = props.label,
    value = props.value,
    sub = props.sub;
  var color = props.color || T.accent,
    icon = props.icon;
  return (
    <Card style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: T.mid,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
        {icon && <Ic d={IC[icon]} size={15} color={color} />}
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: color,
          fontFamily: "IBM Plex Mono,monospace",
          letterSpacing: -1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: T.dim }}>{sub}</div>}
    </Card>
  );
}

function DataTable(props) {
  var cols = props.cols,
    rows = props.rows,
    emptyMsg = props.emptyMsg || "No records";
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid " + T.border }}>
            {cols.map(function (c) {
              return (
                <th
                  key={c.key}
                  style={{
                    padding: "7px 10px",
                    textAlign: "left",
                    color: T.dim,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    fontSize: 10,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={cols.length}
                style={{ padding: 32, textAlign: "center", color: T.dim }}
              >
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map(function (row, ri) {
              return (
                <tr
                  key={ri}
                  style={{ borderBottom: "1px solid " + T.border + "22" }}
                  onMouseEnter={function (e) {
                    e.currentTarget.style.background = T.surface;
                  }}
                  onMouseLeave={function (e) {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {cols.map(function (c) {
                    return (
                      <td
                        key={c.key}
                        style={{
                          padding: "8px 10px",
                          color: T.text,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.render
                          ? c.render(row[c.key], row)
                          : row[c.key] != null
                            ? row[c.key]
                            : "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---- SCALE SIMULATOR --------------------------------------------------------
var PH = { IDLE: 0, APPROACHING: 1, SETTLING: 2, STABLE: 3, CAPTURED: 4 };

function eOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
function lrp(a, b, t) {
  return a + (b - a) * t;
}
function settleW(target, elapsed, dur) {
  if (elapsed >= dur) return target;
  var t = elapsed / dur;
  var base = lrp(0, target, eOut(Math.min(t * 1.1, 1)));
  var decay = Math.exp(-t * 5);
  var osc = Math.sin(t * 18) * decay * target * 0.012;
  return Math.max(0, Math.round(base + osc));
}

function TruckSVG(props) {
  var truckX = props.truckX !== undefined ? props.truckX : -160;
  var active = props.active || false;
  var spk = props.spk || 0;
  var c = active ? T.accent : T.dim;
  var wheels = [14, 42, 60, 82, 102];
  var spokeAngles = [0, 60, 120, 180, 240, 300];
  return (
    <svg
      width="260"
      height="64"
      viewBox="0 0 260 64"
      style={{ overflow: "hidden" }}
    >
      <rect x="0" y="50" width="260" height="3" fill={T.border} rx="1" />
      <rect x="98" y="38" width="124" height="8" rx="2" fill={T.border} />
      <g transform={"translate(" + truckX + ",0)"}>
        <rect
          x="88"
          y="16"
          width="30"
          height="30"
          rx="3"
          fill={c}
          opacity="0.9"
        />
        <rect
          x="90"
          y="18"
          width="12"
          height="10"
          rx="2"
          fill="#000"
          opacity="0.4"
        />
        <rect
          x="0"
          y="20"
          width="92"
          height="26"
          rx="2"
          fill={c}
          opacity="0.7"
        />
        {wheels.map(function (wx, wi) {
          return (
            <g key={wi} transform={"translate(" + wx + ",50)"}>
              <circle r="7" fill={T.bg} stroke={c} strokeWidth="2" />
              <circle r="2.5" fill={c} />
              {spokeAngles.map(function (a) {
                var rad = ((a + spk) * Math.PI) / 180;
                return (
                  <line
                    key={a}
                    x1="0"
                    y1="0"
                    x2={Math.cos(rad) * 4.5}
                    y2={Math.sin(rad) * 4.5}
                    stroke={c}
                    strokeWidth="1"
                    opacity="0.7"
                  />
                );
              })}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ScaleSim(props) {
  var onCapture = props.onCapture;
  var targetWeight = props.targetWeight || 14000;
  var label = props.label || "WEIGHBRIDGE";

  var phaseRef = useRef(PH.IDLE);
  var rafRef = useRef(null);
  var t0Ref = useRef(0);

  var [phase, setPhase] = useState(PH.IDLE);
  var [disp, setDisp] = useState(0);
  var [truckX, setTruckX] = useState(-160);
  var [spk, setSpk] = useState(0);
  var [bars, setBars] = useState(Array(50).fill(0));
  var [stab, setStab] = useState(0);

  useEffect(
    function () {
      phaseRef.current = phase;
    },
    [phase],
  );

  var startWeigh = useCallback(function () {
    if (phaseRef.current !== PH.IDLE) return;
    t0Ref.current = performance.now();
    phaseRef.current = PH.APPROACHING;
    setPhase(PH.APPROACHING);
    setDisp(0);
    setTruckX(-160);
    setSpk(0);
    setBars(Array(50).fill(0));
    setStab(0);
  }, []);

  var resetScale = useCallback(function () {
    cancelAnimationFrame(rafRef.current);
    phaseRef.current = PH.IDLE;
    setPhase(PH.IDLE);
    setDisp(0);
    setTruckX(-160);
    setSpk(0);
    setBars(Array(50).fill(0));
    setStab(0);
  }, []);

  useEffect(
    function () {
      if (phase === PH.IDLE || phase === PH.CAPTURED) return;
      var A = 600,
        S = 1400,
        H = 800;

      function tick(now) {
        var el = now - t0Ref.current;
        var ph = phaseRef.current;

        if (ph === PH.APPROACHING) {
          var t = Math.min(el / A, 1);
          var x = lrp(-160, 101, eOut(t));
          setTruckX(x);
          setSpk(t * 720);
          var w1 = Math.round(eOut(t) * targetWeight * 0.6);
          setDisp(w1);
          setBars(function (p) {
            var n = p.slice(1);
            n.push(w1);
            return n;
          });
          if (el >= A) {
            phaseRef.current = PH.SETTLING;
            setPhase(PH.SETTLING);
            t0Ref.current = now;
          }
        } else if (ph === PH.SETTLING) {
          var w2 = settleW(targetWeight, el, S);
          setDisp(w2);
          setBars(function (p) {
            var n = p.slice(1);
            n.push(w2);
            return n;
          });
          if (el >= S) {
            phaseRef.current = PH.STABLE;
            setPhase(PH.STABLE);
            t0Ref.current = now;
          }
        } else if (ph === PH.STABLE) {
          setDisp(targetWeight);
          setBars(function (p) {
            var n = p.slice(1);
            n.push(targetWeight);
            return n;
          });
          setStab(Math.min(20, Math.round((el / H) * 20)));
          if (el >= H) {
            phaseRef.current = PH.CAPTURED;
            setPhase(PH.CAPTURED);
            if (onCapture) onCapture(targetWeight);
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
      return function () {
        cancelAnimationFrame(rafRef.current);
      };
    },
    [phase, targetWeight, onCapture],
  );

  var bmax = Math.max.apply(null, bars.concat([1]));
  var phLbl = ["IDLE", "APPROACHING", "SETTLING", "STABLE", "CAPTURED"];
  var phCol = [T.dim, T.blue, T.amber, T.accent, T.accent];
  var seg =
    phase === PH.CAPTURED ? T.accent : phase >= PH.SETTLING ? T.amber : T.dim;
  var digs = String(disp).padStart(6, "0").split("");

  var statusLabel = "NO LOAD";
  if (phase >= PH.STABLE) statusLabel = "STABLE";
  else if (phase >= PH.SETTLING) statusLabel = "STABILISING...";

  return (
    <Card style={{ background: "#0a0f1a" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              color: T.dim,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 1,
            }}
          >
            Weighbridge Terminal
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.text,
              fontFamily: "IBM Plex Mono,monospace",
            }}
          >
            {label}
          </div>
        </div>
        <Badge label={phLbl[phase]} color={phCol[phase]} />
      </div>

      <div
        style={{
          background: "#050a10",
          borderRadius: 8,
          padding: "4px 0",
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <TruckSVG truckX={truckX} active={phase >= PH.SETTLING} spk={spk} />
      </div>

      <div
        style={{
          background: "#050a10",
          border: "2px solid " + seg + "44",
          borderRadius: 10,
          padding: "10px 14px",
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {digs.map(function (d, i) {
          return (
            <span
              key={i}
              style={{
                fontFamily: "IBM Plex Mono,monospace",
                fontSize: 32,
                fontWeight: 900,
                color: seg,
                minWidth: 20,
                textAlign: "center",
              }}
            >
              {d}
            </span>
          );
        })}
        <span
          style={{
            fontSize: 12,
            color: T.dim,
            marginLeft: 8,
            fontFamily: "IBM Plex Mono,monospace",
          }}
        >
          kg
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 1,
          height: 30,
          alignItems: "flex-end",
          margin: "6px 0",
          background: "#050a10",
          borderRadius: 6,
          padding: "3px 4px",
        }}
      >
        {bars.map(function (b, i) {
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: (b / bmax) * 100 + "%",
                minHeight: 2,
                background: i === 49 ? T.accent : T.dim + "44",
                borderRadius: 1,
              }}
            />
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
        {Array(20)
          .fill(0)
          .map(function (_, i) {
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: i < stab ? T.accent : T.border,
                }}
              />
            );
          })}
      </div>

      <div
        style={{
          fontSize: 9,
          color: T.dim,
          textAlign: "center",
          marginBottom: 10,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {statusLabel}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {phase === PH.IDLE && (
          <Btn
            label="START WEIGHING"
            icon="scale"
            onClick={startWeigh}
            full={true}
          />
        )}
        {phase === PH.CAPTURED && (
          <Btn
            label="RESET"
            icon="refresh"
            onClick={resetScale}
            variant="amber"
          />
        )}
        {phase > PH.IDLE && phase < PH.CAPTURED && (
          <Btn
            label="CANCEL"
            icon="x"
            onClick={resetScale}
            variant="danger"
            small={true}
          />
        )}
      </div>
    </Card>
  );
}

// ---- LOGIN ------------------------------------------------------------------
function Login(props) {
  var users = props.users,
    onLogin = props.onLogin;
  var [uname, setUname] = useState("");
  var [pass, setPass] = useState("");
  var [err, setErr] = useState("");

  function handle() {
    var u = users.find(function (x) {
      return x.username === uname && x.password === pass;
    });
    if (u) {
      onLogin(u);
    } else {
      setErr("Invalid username or password");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: T.accent,
              fontFamily: "IBM Plex Mono,monospace",
              letterSpacing: -1,
            }}
          >
            PALMWEIGH
          </div>
          <div
            style={{
              fontSize: 11,
              color: T.dim,
              letterSpacing: 2,
              marginTop: 2,
            }}
          >
            WEIGHBRIDGE MANAGEMENT SYSTEM
          </div>
          <div style={{ fontSize: 10, color: T.dim, marginTop: 4 }}>
            {COMPANY}
          </div>
          <div
            style={{
              marginTop: 8,
              display: "inline-block",
              background: T.amber + "22",
              border: "1px solid " + T.amber + "44",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 10,
              color: T.amber,
              fontFamily: "IBM Plex Mono,monospace",
              letterSpacing: 0.5,
            }}
          >
            UAT Demonstration Version
          </div>
        </div>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Username
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Ic d={IC.user} size={14} color={T.dim} />
                </div>
                <input
                  value={uname}
                  onChange={function (e) {
                    setUname(e.target.value);
                  }}
                  onKeyDown={function (e) {
                    if (e.key === "Enter") handle();
                  }}
                  placeholder="Enter username"
                  style={Object.assign({}, IS, { paddingLeft: 32 })}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Ic d={IC.lock} size={14} color={T.dim} />
                </div>
                <input
                  type="password"
                  value={pass}
                  onChange={function (e) {
                    setPass(e.target.value);
                  }}
                  onKeyDown={function (e) {
                    if (e.key === "Enter") handle();
                  }}
                  placeholder="Enter password"
                  style={Object.assign({}, IS, { paddingLeft: 32 })}
                />
              </div>
            </div>
            {err && (
              <div
                style={{
                  fontSize: 12,
                  color: T.red,
                  padding: "6px 10px",
                  background: T.red + "11",
                  borderRadius: 6,
                  border: "1px solid " + T.red + "33",
                }}
              >
                {err}
              </div>
            )}
            <Btn label="LOGIN" icon="check" onClick={handle} full={true} />
            <div
              style={{
                fontSize: 11,
                color: T.dim,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Demo: admin/admin &nbsp; operator/1234 &nbsp; demo/demo
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---- DASHBOARD --------------------------------------------------------------
function Dashboard(props) {
  var txs = props.txs,
    station = props.station;
  var stTxs = txs.filter(function (t) {
    return !station || t.stationId === station;
  });
  var tday = todayStr();
  var todayTxs = stTxs.filter(function (t) {
    return t.weightIn && t.weightIn.startsWith(tday);
  });
  var pending = stTxs.filter(function (t) {
    return t.status === "pending_out";
  });
  var todayDone = todayTxs.filter(function (t) {
    return t.status === "completed";
  });
  var todayNet = todayDone.reduce(function (s, t) {
    return s + t.netKg;
  }, 0);

  var daily = Array.from({ length: 14 }, function (_, i) {
    var d = new Date(Date.now() - (13 - i) * 86400000);
    var ds = d.toISOString().split("T")[0];
    var net = stTxs
      .filter(function (t) {
        return (
          t.weightIn && t.weightIn.startsWith(ds) && t.status === "completed"
        );
      })
      .reduce(function (s, t) {
        return s + t.netKg;
      }, 0);
    return {
      day: d.toLocaleDateString("en-MY", { weekday: "short", day: "numeric" }),
      net: +(net / 1000).toFixed(2),
    };
  });

  var recent = stTxs
    .slice()
    .sort(function (a, b) {
      return new Date(b.weightIn) - new Date(a.weightIn);
    })
    .slice(0, 8);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 10,
        }}
      >
        <StatCard
          label="Today Tickets"
          value={todayTxs.length}
          sub="all status"
          color={T.accent}
          icon="scale"
        />
        <StatCard
          label="Pending Weigh-Out"
          value={pending.length}
          sub="awaiting exit"
          color={T.amber}
          icon="queue"
        />
        <StatCard
          label="Completed Today"
          value={todayDone.length}
          sub="today completed"
          color={T.blue}
          icon="check"
        />
        <StatCard
          label="Today Net Weight"
          value={(todayNet / 1000).toFixed(1) + "t"}
          sub={fmt(todayNet) + " kg"}
          color={T.purple}
          icon="chart"
        />
        <StatCard
          label="All Tickets"
          value={stTxs.length}
          sub="total records"
          color={T.mid}
          icon="records"
        />
      </div>

      <Card>
        <div
          style={{
            fontSize: 11,
            color: T.mid,
            fontWeight: 700,
            marginBottom: 10,
            letterSpacing: 0.5,
          }}
        >
          14-DAY NET FFB TONNAGE
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={daily}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
            <XAxis dataKey="day" tick={{ fill: T.dim, fontSize: 10 }} />
            <YAxis tick={{ fill: T.dim, fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: T.surface,
                border: "1px solid " + T.border,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke={T.accent}
              fill="url(#aGrad)"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div
          style={{
            fontSize: 11,
            color: T.mid,
            fontWeight: 700,
            marginBottom: 10,
            letterSpacing: 0.5,
          }}
        >
          RECENT TICKETS
        </div>
        <DataTable
          cols={[
            {
              key: "id",
              label: "Ticket No",
              render: function (v) {
                return (
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono,monospace",
                      color: T.accent,
                      fontWeight: 700,
                    }}
                  >
                    {v}
                  </span>
                );
              },
            },
            { key: "supplierName", label: "Supplier" },
            { key: "plate", label: "Vehicle" },
            {
              key: "grossKg",
              label: "Gross (kg)",
              render: function (v) {
                return (
                  <span style={{ fontFamily: "IBM Plex Mono,monospace" }}>
                    {fmt(v)}
                  </span>
                );
              },
            },
            {
              key: "tareKg",
              label: "Tare (kg)",
              render: function (v) {
                return (
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono,monospace",
                      color: T.amber,
                    }}
                  >
                    {v != null ? fmt(v) : "--"}
                  </span>
                );
              },
            },
            {
              key: "netKg",
              label: "Net (kg)",
              render: function (v) {
                return (
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono,monospace",
                      color: T.accent,
                      fontWeight: 700,
                    }}
                  >
                    {v != null ? fmt(v) : "--"}
                  </span>
                );
              },
            },
            {
              key: "ticketType",
              label: "Type",
              render: function (v) {
                return (
                  <Badge
                    label={v === "Cash Bill" ? "Cash Bill" : "Normal Inv"}
                    color={v === "Cash Bill" ? T.amber : T.blue}
                  />
                );
              },
            },
            {
              key: "ticketSource",
              label: "Source",
              render: function (v) {
                return (
                  <Badge
                    label={v || "SCALE"}
                    color={v === "MANUAL" ? T.purple : T.blue}
                  />
                );
              },
            },
            {
              key: "status",
              label: "Status",
              render: function (v) {
                return (
                  <Badge
                    label={v === "completed" ? "DONE" : "PENDING"}
                    color={v === "completed" ? T.accent : T.amber}
                  />
                );
              },
            },
            {
              key: "weightIn",
              label: "Time In",
              render: function (v) {
                return fmtD(v);
              },
            },
          ]}
          rows={recent}
        />
      </Card>
    </div>
  );
}

// ---- QUICK CREATE MODAL ----------------------------------------------------
function QuickCreate(props) {
  var title = props.title,
    fields = props.fields,
    onSave = props.onSave,
    onClose = props.onClose;
  var [form, setForm] = useState({});
  function setF(k, v) {
    setForm(function (f) {
      return Object.assign({}, f, { [k]: v });
    });
  }
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card style={{ width: 380, border: "1px solid " + T.accent + "44" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: T.accent,
            marginBottom: 14,
          }}
        >
          {"+ New " + title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fields.map(function (f) {
            return (
              <FInput
                key={f.key}
                label={f.label}
                value={form[f.key] || ""}
                onChange={function (v) {
                  setF(f.key, v);
                }}
                placeholder={f.placeholder || ""}
                required={f.required}
                options={f.options}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Btn
            label="Save"
            icon="check"
            onClick={function () {
              onSave(form);
              onClose();
            }}
          />
          <Btn label="Cancel" icon="x" onClick={onClose} variant="ghost" />
        </div>
      </Card>
    </div>
  );
}

// ---- WEIGH IN ----------------------------------------------------------------
// Flow: Scale screen (capture or manual entry) -> Ticket Details -> Save
function WeighIn(props) {
  var txs = props.txs,
    setTxs = props.setTxs;
  var drivers = props.drivers,
    setDrivers = props.setDrivers;
  var vehicles = props.vehicles,
    setVehicles = props.setVehicles;
  var suppliers = props.suppliers,
    setSuppliers = props.setSuppliers;
  var harvesters = props.harvesters || [],
    setHarvesters = props.setHarvesters;
  var stationId = props.stationId,
    counters = props.counters,
    setCounters = props.setCounters;
  var stations = props.stations,
    currentUser = props.currentUser;

  var isAdmin =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "supervisor");

  // Step: "scale" | "details"
  var [step, setStep] = useState("scale");
  // Capture mode: "scale" | "manual"
  var [captMode, setCaptMode] = useState("scale");
  var [grossKg, setGrossKg] = useState(null);
  // Manual entry fields
  var [manualKg, setManualKg] = useState("");
  var [manualReason, setManualReason] = useState("Scale Offline");

  // Ticket detail fields
  var [txType, setTxType] = useState("PC"); // "PC" or "DC"
  var [vehicleId, setVehicleId] = useState("");
  var [supplierId, setSupplierId] = useState("");
  var [driverId, setDriverId] = useState("");
  var [harvesters2, setHarvesters2] = useState([]); // selected harvesters array
  var [product, setProduct] = useState(PRODUCTS[0]);
  var [dnNo, setDnNo] = useState("");
  var [remarks, setRemarks] = useState("");

  // Inline modals
  var [modal, setModal] = useState(null);
  // Success state
  var [successTicket, setSuccessTicket] = useState(null);

  var sta =
    stations.find(function (s) {
      return s.id === stationId;
    }) || stations[0];
  var nextPcSeq = counters[sta.prefix + "-PC"] || 1;
  var nextDcSeq = counters[sta.prefix + "-DC"] || 1;
  var nextTicketId = sta.prefix + "-PC" + String(nextPcSeq).padStart(6, "0"); // shown on scale screen before txType selected
  var targetGross = 14000 + Math.round(Math.random() * 5000);

  var vehicleOptions = vehicles
    .filter(function (v) {
      return v.active;
    })
    .map(function (v) {
      return { value: v.id, label: v.plate };
    });
  var supplierOptions = suppliers
    .filter(function (s) {
      return s.active;
    })
    .map(function (s) {
      return { value: s.id, label: s.name };
    });
  var driverOptions = drivers
    .filter(function (d) {
      return d.active;
    })
    .map(function (d) {
      return { value: d.id, label: d.name };
    });
  var harvesterOptions = harvesters
    .filter(function (h) {
      return h.active;
    })
    .map(function (h) {
      return { value: h.name, label: h.name };
    });
  var productOptions = PRODUCTS.map(function (p) {
    return { value: p, label: p };
  });
  var reasonOptions = [
    "Scale Offline",
    "Indicator Failure",
    "Backdated Entry",
    "Manual Correction",
  ].map(function (r) {
    return { value: r, label: r };
  });

  var canConfirm = vehicleId && supplierId && driverId;

  function resetAll() {
    setStep("scale");
    setGrossKg(null);
    setCaptMode("scale");
    setManualKg("");
    setManualReason("Scale Offline");
    setTxType("PC");
    setVehicleId("");
    setSupplierId("");
    setDriverId("");
    setHarvesters2([]);
    setProduct(PRODUCTS[0]);
    setDnNo("");
    setRemarks("");
  }

  function handleScaleCapture(w) {
    setGrossKg(w);
    setStep("details");
  }

  function handleManualConfirm() {
    var kg = parseFloat(manualKg);
    if (!kg || kg <= 0) {
      alert("Please enter a valid weight.");
      return;
    }
    setGrossKg(kg);
    setStep("details");
  }

  function handleSubmit() {
    if (!grossKg || !canConfirm) return;
    var prefix = sta.prefix;
    var counterKey = prefix + "-" + txType;
    var s = counters[counterKey] || 1;
    var id = prefix + "-" + txType + String(s).padStart(6, "0");
    var now = new Date().toISOString();
    var who = (currentUser && currentUser.name) || "Operator";
    var drv = drivers.find(function (d) {
      return d.id === driverId;
    });
    var veh = vehicles.find(function (v) {
      return v.id === vehicleId;
    });
    var sup = suppliers.find(function (s) {
      return s.id === supplierId;
    });
    if (!drv || !veh || !sup) return;
    var isManual = captMode === "manual";
    var isPurch = txType === "PC";
    var newTx = {
      id: id,
      stationId: stationId,
      stationPrefix: prefix,
      txType: txType,
      txTypeName: isPurch ? "Purchase / Receiving" : "Delivery / Despatch",
      customerType: "Registered Supplier",
      supplierId: sup.id,
      supplierName: sup.name,
      supplierCode: sup.code,
      driverId: drv.id,
      driverName: drv.name,
      vehicleId: veh.id,
      plate: veh.plate,
      vehicleType: veh.type,
      harvesters: isPurch ? harvesters2.slice() : [],
      product: product,
      dnNo: dnNo,
      grossKg: grossKg,
      tareKg: null,
      netKg: null,
      ticketType: isPurch ? "Normal Invoice" : "Delivery Order",
      status: "pending_out",
      ticketSource: isManual ? "MANUAL" : "SCALE",
      manualEntry: isManual,
      manualReason: isManual ? manualReason : "",
      capturedBy: who,
      weightIn: now,
      weightOut: null,
      createdBy: who,
      createdAt: now,
      operator: who,
      remarks: remarks,
    };
    setTxs(function (prev) {
      return [newTx].concat(prev);
    });
    setCounters(function (c) {
      var n = Object.assign({}, c);
      n[counterKey] = s + 1;
      return n;
    });
    var cid = id,
      cg = grossKg,
      cm = isManual,
      ct = txType;
    resetAll();
    setSuccessTicket({ id: cid, grossKg: cg, isManual: cm, txType: ct });
  }

  // Quick-create save handlers
  function saveVehicle(f) {
    if (!f.plate) return;
    var nv = {
      id: "v_" + Date.now(),
      plate: f.plate.trim().toUpperCase(),
      type: f.type || "Lorry",
      tare: parseInt(f.tare) || 8000,
      rfid: "",
      driverId: "",
      stationId: stationId,
      active: true,
    };
    setVehicles(function (prev) {
      return prev.concat([nv]);
    });
    setVehicleId(nv.id);
  }
  function saveSupplier(f) {
    if (!f.name) return;
    var ns = {
      id: "sup_" + Date.now(),
      name: f.name.trim(),
      code: f.code || f.name.trim().slice(0, 3).toUpperCase(),
      address: f.address || "",
      contact: f.contact || "",
      active: true,
    };
    setSuppliers(function (prev) {
      return prev.concat([ns]);
    });
    setSupplierId(ns.id);
  }
  function saveDriver(f) {
    if (!f.name) return;
    var nd = {
      id: "d_" + Date.now(),
      name: f.name.trim(),
      ic: f.ic || "",
      phone: f.phone || "",
      rfid: "",
      license: f.license || "",
      stationId: stationId,
      active: true,
    };
    setDrivers(function (prev) {
      return prev.concat([nd]);
    });
    setDriverId(nd.id);
  }
  function saveHarvester(f) {
    if (!f.name) return;
    var nh = { id: "h_" + Date.now(), name: f.name.trim(), active: true };
    setHarvesters(function (prev) {
      return prev.concat([nh]);
    });
    setHarvesters2(function (prev) {
      return prev.includes(f.name.trim()) ? prev : prev.concat([f.name.trim()]);
    });
  }

  var MODALS = {
    vehicle: {
      title: "Vehicle",
      fields: [
        {
          key: "plate",
          label: "Plate No",
          required: true,
          placeholder: "e.g. JPV1234",
        },
        { key: "type", label: "Type", placeholder: "Lorry / Truck / Pickup" },
      ],
      onSave: saveVehicle,
    },
    supplier: {
      title: "Supplier",
      fields: [
        { key: "name", label: "Company Name", required: true },
        { key: "code", label: "Code", placeholder: "e.g. JPR" },
        { key: "contact", label: "Contact No" },
      ],
      onSave: saveSupplier,
    },
    driver: {
      title: "Driver",
      fields: [
        { key: "name", label: "Full Name", required: true },
        { key: "ic", label: "IC No" },
        { key: "phone", label: "Phone" },
        { key: "license", label: "License No" },
      ],
      onSave: saveDriver,
    },
    harvester: {
      title: "Harvester",
      fields: [{ key: "name", label: "Harvester Name", required: true }],
      onSave: saveHarvester,
    },
  };

  // ---- SUCCESS SCREEN --------------------------------------------------------
  if (successTicket) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 400,
        }}
      >
        <Card
          style={{
            maxWidth: 460,
            width: "100%",
            textAlign: "center",
            padding: 40,
            border: "1px solid " + T.accent + "44",
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: T.accent + "22",
              border: "2px solid " + T.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Ic d={IC.check} size={30} color={T.accent} />
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: T.text,
              marginBottom: 6,
            }}
          >
            Ticket Created Successfully
          </div>
          <div style={{ fontSize: 12, color: T.mid, marginBottom: 24 }}>
            Status: Pending Weigh Out
          </div>
          <div
            style={{
              background: T.bg,
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            {[
              ["Ticket No", successTicket.id, T.accent],
              ["Gross Weight", fmt(successTicket.grossKg) + " kg", T.blue],
              [
                "Transaction",
                successTicket.txType === "PC"
                  ? "Purchase / Receiving"
                  : "Delivery / Despatch",
                successTicket.txType === "PC" ? T.accent : T.purple,
              ],
              [
                "Entry Mode",
                successTicket.isManual ? "Manual Entry" : "Scale Reading",
                successTicket.isManual ? T.amber : T.dim,
              ],
            ].map(function (row) {
              return (
                <div
                  key={row[0]}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 11, color: T.dim }}>{row[0]}</span>
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono,monospace",
                      fontWeight: 700,
                      color: row[2],
                    }}
                  >
                    {row[1]}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn
              label="Go to Weigh Out"
              icon="weighOut"
              onClick={function () {
                setSuccessTicket(null);
                props.onGoWeighOut && props.onGoWeighOut();
              }}
              full={true}
            />
            <Btn
              label="Create Another Ticket"
              icon="plus"
              onClick={function () {
                setSuccessTicket(null);
              }}
              variant="ghost"
              full={true}
            />
            <Btn
              label="View Pending Queue"
              icon="queue"
              onClick={function () {
                setSuccessTicket(null);
                props.onGoQueue && props.onGoQueue();
              }}
              variant="ghost"
              full={true}
            />
          </div>
        </Card>
      </div>
    );
  }

  // ---- STEP 1: WEIGHBRIDGE TERMINAL ------------------------------------------
  if (step === "scale") {
    var mc1 = null; // no modals needed on scale screen
    return (
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18 }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: T.accent,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Weighbridge Terminal
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono,monospace",
                fontSize: 11,
                color: T.dim,
              }}
            >
              Next Ticket:{" "}
              <span style={{ color: T.amber }}>{nextTicketId}</span>
            </div>
          </div>

          <div
            style={{
              padding: "16px 20px",
              background: T.bg,
              borderRadius: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: T.mid,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Capture Mode
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={function () {
                  setCaptMode("scale");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono,monospace",
                  background: captMode === "scale" ? T.accent + "22" : T.bg,
                  border:
                    "2px solid " + (captMode === "scale" ? T.accent : T.border),
                  color: captMode === "scale" ? T.accent : T.mid,
                }}
              >
                Scale Reading
              </button>
              <button
                onClick={function () {
                  if (!isAdmin) {
                    alert("Manual entry requires Admin or Supervisor access.");
                    return;
                  }
                  setCaptMode("manual");
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 12,
                  fontFamily: "IBM Plex Mono,monospace",
                  background: captMode === "manual" ? T.amber + "22" : T.bg,
                  border:
                    "2px solid " + (captMode === "manual" ? T.amber : T.border),
                  color:
                    captMode === "manual" ? T.amber : isAdmin ? T.mid : T.dim,
                  opacity: isAdmin ? 1 : 0.5,
                }}
              >
                Manual Entry
                {!isAdmin && (
                  <span style={{ fontSize: 9, display: "block", marginTop: 1 }}>
                    Admin only
                  </span>
                )}
              </button>
            </div>
          </div>

          {captMode === "manual" && isAdmin && (
            <div
              style={{
                padding: "16px",
                background: T.amber + "11",
                border: "1px solid " + T.amber + "44",
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: T.amber,
                  fontWeight: 700,
                  marginBottom: 10,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Manual Weight Entry
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <FInput
                  label="Weight (kg) *"
                  value={manualKg}
                  onChange={setManualKg}
                  type="number"
                  placeholder="Enter gross weight in kg"
                />
                <FInput
                  label="Reason *"
                  value={manualReason}
                  onChange={setManualReason}
                  options={reasonOptions}
                />
              </div>
              <div style={{ marginTop: 12, fontSize: 10, color: T.amber }}>
                Manual entries are flagged on the ticket and in records.
                Captured by: {(currentUser && currentUser.name) || "Operator"}
              </div>
              <div style={{ marginTop: 10 }}>
                <Btn
                  label="CONFIRM MANUAL WEIGHT"
                  icon="check"
                  onClick={handleManualConfirm}
                  variant="amber"
                  disabled={!manualKg}
                />
              </div>
            </div>
          )}

          {captMode === "scale" && (
            <div
              style={{
                padding: "14px",
                background: T.accent + "08",
                border: "1px solid " + T.accent + "22",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: T.text,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Drive vehicle onto the scale
              </div>
              <div style={{ fontSize: 11, color: T.dim }}>
                Click Start Weighing on the terminal. Weight will stabilise and
                be captured automatically.
              </div>
              <div style={{ marginTop: 8, fontSize: 11, color: T.dim }}>
                Vehicle and supplier details are entered after weight is
                captured.
              </div>
            </div>
          )}
        </Card>

        {captMode === "scale" ? (
          <ScaleSim
            label={"WEIGH-IN -- " + sta.prefix}
            targetWeight={targetGross}
            onCapture={handleScaleCapture}
          />
        ) : (
          <Card
            style={{ background: "#0a0f1a", textAlign: "center", padding: 32 }}
          >
            <div
              style={{
                fontSize: 9,
                color: T.dim,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Manual Entry Mode
            </div>
            <Ic d={IC.edit} size={40} color={T.amber} />
            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: T.amber,
                fontWeight: 600,
              }}
            >
              Enter weight manually on the left
            </div>
            <div style={{ marginTop: 6, fontSize: 11, color: T.dim }}>
              Scale Reading is not available
            </div>
            {!isAdmin && (
              <div
                style={{
                  marginTop: 12,
                  padding: "8px 12px",
                  background: T.red + "11",
                  border: "1px solid " + T.red + "33",
                  borderRadius: 8,
                  fontSize: 11,
                  color: T.red,
                }}
              >
                Admin or Supervisor permission required
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // ---- STEP 2: TICKET DETAILS ------------------------------------------------
  // txType state: "PC" = Purchase/Receiving, "DC" = Delivery/Despatch
  var isPurchase = txType === "PC";
  var txTypeColor = isPurchase ? T.accent : T.purple;
  // Ticket ID preview uses txType
  var nextId =
    sta.prefix +
    "-" +
    txType +
    String(counters[sta.prefix + "-" + txType] || 1).padStart(6, "0");

  var mc = modal ? MODALS[modal] : null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18 }}>
      {mc && (
        <QuickCreate
          title={mc.title}
          fields={mc.fields}
          onSave={mc.onSave}
          onClose={function () {
            setModal(null);
          }}
        />
      )}

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: T.accent,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Ticket Details
          </div>
          <button
            onClick={resetAll}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              color: T.dim,
              fontFamily: "IBM Plex Mono,monospace",
              textDecoration: "underline",
            }}
          >
            Restart
          </button>
        </div>

        <div
          style={{
            padding: "12px 16px",
            background: T.bg,
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
            border: "1px solid " + T.border,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}>
              Gross Weight Captured
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono,monospace",
                fontSize: 24,
                fontWeight: 900,
                color: T.blue,
              }}
            >
              {fmt(grossKg)} kg
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}>
              Ticket No Preview
            </div>
            <div
              style={{
                fontFamily: "IBM Plex Mono,monospace",
                fontSize: 13,
                fontWeight: 700,
                color: T.amber,
              }}
            >
              {nextId}
            </div>
            {captMode === "manual" && (
              <div style={{ marginTop: 4 }}>
                <Badge label="MANUAL" color={T.amber} />
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 11,
              color: T.mid,
              fontWeight: 600,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Transaction Type
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={function () {
                setTxType("PC");
              }}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
                fontFamily: "IBM Plex Mono,monospace",
                background: isPurchase ? T.accent + "22" : T.bg,
                border: "2px solid " + (isPurchase ? T.accent : T.border),
                color: isPurchase ? T.accent : T.mid,
              }}
            >
              <div>Purchase / Receiving</div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 400,
                  marginTop: 2,
                  opacity: 0.7,
                }}
              >
                Supplier brings goods in
              </div>
            </button>
            <button
              onClick={function () {
                setTxType("DC");
              }}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
                fontFamily: "IBM Plex Mono,monospace",
                background: !isPurchase ? T.purple + "22" : T.bg,
                border: "2px solid " + (!isPurchase ? T.purple : T.border),
                color: !isPurchase ? T.purple : T.mid,
              }}
            >
              <div>Delivery / Despatch</div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 400,
                  marginTop: 2,
                  opacity: 0.7,
                }}
              >
                Outgoing goods / delivery
              </div>
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Vehicle *
              </label>
              <button
                onClick={function () {
                  setModal("vehicle");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: T.accent,
                  fontFamily: "IBM Plex Mono,monospace",
                }}
              >
                + Create New
              </button>
            </div>
            <select
              value={vehicleId}
              onChange={function (e) {
                setVehicleId(e.target.value);
              }}
              style={Object.assign({}, IS)}
            >
              <option value="">-- Select Vehicle --</option>
              {vehicleOptions.map(function (o) {
                return (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                {isPurchase ? "Supplier *" : "Customer / Destination *"}
              </label>
              <button
                onClick={function () {
                  setModal("supplier");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: T.accent,
                  fontFamily: "IBM Plex Mono,monospace",
                }}
              >
                + Create New
              </button>
            </div>
            <select
              value={supplierId}
              onChange={function (e) {
                setSupplierId(e.target.value);
              }}
              style={Object.assign({}, IS)}
            >
              <option value="">
                {isPurchase
                  ? "-- Select Supplier --"
                  : "-- Select Customer / Destination --"}
              </option>
              {supplierOptions.map(function (o) {
                return (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Driver *
              </label>
              <button
                onClick={function () {
                  setModal("driver");
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: T.accent,
                  fontFamily: "IBM Plex Mono,monospace",
                }}
              >
                + Create New
              </button>
            </div>
            <select
              value={driverId}
              onChange={function (e) {
                setDriverId(e.target.value);
              }}
              style={Object.assign({}, IS)}
            >
              <option value="">-- Select Driver --</option>
              {driverOptions.map(function (o) {
                return (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                );
              })}
            </select>
          </div>

          {isPurchase && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <label
                  style={{
                    fontSize: 11,
                    color: T.mid,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  Harvester(s)
                </label>
                <button
                  onClick={function () {
                    setModal("harvester");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    color: T.accent,
                    fontFamily: "IBM Plex Mono,monospace",
                  }}
                >
                  + Create New
                </button>
              </div>
              <div
                style={{
                  border: "1px solid " + T.border,
                  borderRadius: 8,
                  background: T.bg,
                  padding: "6px 8px",
                  minHeight: 42,
                }}
              >
                {harvesters2.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 4,
                      marginBottom: 6,
                    }}
                  >
                    {harvesters2.map(function (h) {
                      return (
                        <span
                          key={h}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: T.accent + "22",
                            border: "1px solid " + T.accent + "44",
                            borderRadius: 5,
                            padding: "2px 8px",
                            fontSize: 11,
                            color: T.accent,
                            fontFamily: "IBM Plex Mono,monospace",
                          }}
                        >
                          {h}
                          <button
                            onClick={function () {
                              setHarvesters2(function (prev) {
                                return prev.filter(function (x) {
                                  return x !== h;
                                });
                              });
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: T.accent,
                              fontSize: 13,
                              lineHeight: 1,
                              padding: 0,
                            }}
                          >
                            x
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <select
                  value=""
                  onChange={function (e) {
                    var v = e.target.value;
                    if (v && !harvesters2.includes(v)) {
                      setHarvesters2(function (prev) {
                        return prev.concat([v]);
                      });
                    }
                  }}
                  style={Object.assign({}, IS, {
                    border: "none",
                    padding: "2px 4px",
                    background: "transparent",
                    fontSize: 12,
                  })}
                >
                  <option value="">
                    {"-- Add harvester" +
                      (harvesters2.length > 0
                        ? " (can select multiple)"
                        : " or skip --")}
                  </option>
                  {harvesterOptions
                    .filter(function (o) {
                      return !harvesters2.includes(o.value);
                    })
                    .map(function (o) {
                      return (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      );
                    })}
                </select>
              </div>
              {harvesters2.length > 0 && (
                <div style={{ fontSize: 10, color: T.dim, marginTop: 3 }}>
                  {harvesters2.length} harvester
                  {harvesters2.length > 1 ? "s" : ""} selected:{" "}
                  {harvesters2.join(", ")}
                </div>
              )}
            </div>
          )}

          <FInput
            label="Product"
            value={product}
            onChange={setProduct}
            options={productOptions}
          />
          <FInput
            label="DN No."
            value={dnNo}
            onChange={setDnNo}
            placeholder="Delivery Note No. (optional)"
          />
          <FInput
            label="Remarks"
            value={remarks}
            onChange={setRemarks}
            placeholder="Optional"
          />
        </div>

        <div
          style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          <Btn
            label={"SAVE " + (isPurchase ? "PURCHASE" : "DELIVERY") + " TICKET"}
            icon="check"
            onClick={handleSubmit}
            disabled={!canConfirm}
          />
          <Btn
            label="Restart"
            icon="refresh"
            onClick={resetAll}
            variant="ghost"
            small={true}
          />
        </div>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card
          style={{ background: "#0a0f1a", textAlign: "center", padding: 28 }}
        >
          <div
            style={{
              fontSize: 9,
              color: T.dim,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Gross Weight
          </div>
          <div
            style={{
              fontFamily: "IBM Plex Mono,monospace",
              fontSize: 42,
              fontWeight: 900,
              color: T.accent,
              letterSpacing: -2,
            }}
          >
            {fmt(grossKg)}
          </div>
          <div style={{ fontSize: 14, color: T.dim, marginTop: 2 }}>kg</div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Badge label="CAPTURED" color={T.accent} />
            <Badge label={isPurchase ? "PC" : "DC"} color={txTypeColor} />
            {captMode === "manual" && <Badge label="MANUAL" color={T.amber} />}
          </div>
        </Card>
        <Card style={{ padding: "14px 16px" }}>
          <div
            style={{
              fontSize: 10,
              color: txTypeColor,
              marginBottom: 4,
              letterSpacing: 0.5,
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {isPurchase ? "Purchase / Receiving" : "Delivery / Despatch"}
          </div>
          <div style={{ fontSize: 11, color: T.mid, lineHeight: 1.7 }}>
            {isPurchase
              ? "Supplier brings goods into collection centre. Ticket will be prefixed PC."
              : "Outgoing goods or delivery. Ticket will be prefixed DC."}
          </div>
          {captMode === "manual" && (
            <div style={{ marginTop: 8, fontSize: 11, color: T.amber }}>
              Manual entry. Reason: {manualReason}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ---- EDIT TICKET MODAL -------------------------------------------------------
function EditTicketModal(props) {
  var tx = props.tx;
  var onClose = props.onClose;
  var onSave = props.onSave;
  var isAdmin = props.isAdmin;
  var suppliers = props.suppliers || [];
  var vehicles = props.vehicles || [];
  var drivers = props.drivers || [];
  var harvesters = props.harvesters || [];

  var isPending = tx.status === "pending_out";
  var isPurch = tx.txType !== "DC";

  // Editable fields - pre-fill from ticket
  var [supplierId, setSupplierId] = useState(tx.supplierId || "");
  var [vehicleId, setVehicleId] = useState(tx.vehicleId || "");
  var [driverId, setDriverId] = useState(tx.driverId || "");
  var [selHarvesters, setSelHarvesters] = useState(
    Array.isArray(tx.harvesters) ? tx.harvesters.slice() : [],
  );
  var [product, setProduct] = useState(tx.product || PRODUCTS[0]);
  var [dnNo, setDnNo] = useState(tx.dnNo || "");
  var [remarks, setRemarks] = useState(tx.remarks || "");
  var [reason, setReason] = useState(AUDIT_REASONS[0]);
  var [customReason, setCustomReason] = useState("");
  var [confirmWarn, setConfirmWarn] = useState(false);

  // Weight edits - admin only
  var [grossKgEdit, setGrossKgEdit] = useState(String(tx.grossKg || ""));
  var [tareKgEdit, setTareKgEdit] = useState(String(tx.tareKg || ""));

  var supplierOptions = suppliers
    .filter(function (s) {
      return s.active;
    })
    .map(function (s) {
      return { value: s.id, label: s.name };
    });
  var vehicleOptions = vehicles
    .filter(function (v) {
      return v.active;
    })
    .map(function (v) {
      return { value: v.id, label: v.plate };
    });
  var driverOptions = drivers
    .filter(function (d) {
      return d.active;
    })
    .map(function (d) {
      return { value: d.id, label: d.name };
    });
  var harvesterOptions = harvesters
    .filter(function (h) {
      return h.active;
    })
    .map(function (h) {
      return { value: h.name, label: h.name };
    });
  var productOptions = PRODUCTS.map(function (p) {
    return { value: p, label: p };
  });
  var reasonOptions = AUDIT_REASONS.map(function (r) {
    return { value: r, label: r };
  });

  function toggleHarvester(name) {
    setSelHarvesters(function (prev) {
      return prev.includes(name)
        ? prev.filter(function (x) {
            return x !== name;
          })
        : prev.concat([name]);
    });
  }

  function handleSave() {
    var finalReason = reason === "Other" ? customReason.trim() : reason;
    if (!finalReason) {
      alert("Please enter a modification reason.");
      return;
    }
    if (!isPending && !isAdmin) {
      alert("Only Admin can edit completed tickets.");
      return;
    }

    // Build changes object - compare to original
    var selVeh = vehicles.find(function (v) {
      return v.id === vehicleId;
    });
    var selSup = suppliers.find(function (s) {
      return s.id === supplierId;
    });
    var selDrv = drivers.find(function (d) {
      return d.id === driverId;
    });

    var changes = {};
    if (selSup && selSup.name !== tx.supplierName) {
      changes.supplierName = { old: tx.supplierName, new: selSup.name };
      changes.supplierId = { old: tx.supplierId, new: supplierId };
    }
    if (selVeh && selVeh.plate !== tx.plate) {
      changes.plate = { old: tx.plate, new: selVeh.plate };
      changes.vehicleId = { old: tx.vehicleId, new: vehicleId };
    }
    if (selDrv && selDrv.name !== tx.driverName) {
      changes.driverName = { old: tx.driverName, new: selDrv.name };
    }
    if (product !== tx.product) {
      changes.product = { old: tx.product, new: product };
    }
    if (dnNo !== (tx.dnNo || "")) {
      changes.dnNo = { old: tx.dnNo || "", new: dnNo };
    }
    if (remarks !== (tx.remarks || "")) {
      changes.remarks = { old: tx.remarks || "", new: remarks };
    }
    var hvOld = Array.isArray(tx.harvesters) ? tx.harvesters.join(", ") : "";
    var hvNew = selHarvesters.join(", ");
    if (hvOld !== hvNew) {
      changes.harvesters = { old: hvOld || "--", new: hvNew || "--" };
    }
    if (isAdmin && grossKgEdit && parseFloat(grossKgEdit) !== tx.grossKg) {
      changes.grossKg = { old: String(tx.grossKg), new: grossKgEdit };
    }
    if (
      isAdmin &&
      !isPending &&
      tareKgEdit &&
      parseFloat(tareKgEdit) !== tx.tareKg
    ) {
      changes.tareKg = { old: String(tx.tareKg), new: tareKgEdit };
    }

    if (Object.keys(changes).length === 0) {
      alert("No changes detected.");
      return;
    }

    onSave(
      {
        supplierId: selSup ? supplierId : tx.supplierId,
        supplierName: selSup ? selSup.name : tx.supplierName,
        supplierCode: selSup ? selSup.code : tx.supplierCode,
        vehicleId: selVeh ? vehicleId : tx.vehicleId,
        plate: selVeh ? selVeh.plate : tx.plate,
        vehicleType: selVeh ? selVeh.type : tx.vehicleType,
        driverId: selDrv ? driverId : tx.driverId,
        driverName: selDrv ? selDrv.name : tx.driverName,
        harvesters: selHarvesters,
        product: product,
        dnNo: dnNo,
        remarks: remarks,
        grossKg: isAdmin && grossKgEdit ? parseFloat(grossKgEdit) : tx.grossKg,
        tareKg:
          isAdmin && !isPending && tareKgEdit
            ? parseFloat(tareKgEdit)
            : tx.tareKg,
        netKg: (function () {
          var g = isAdmin && grossKgEdit ? parseFloat(grossKgEdit) : tx.grossKg;
          var t2 =
            isAdmin && !isPending && tareKgEdit
              ? parseFloat(tareKgEdit)
              : tx.tareKg;
          return g && t2 ? g - t2 : tx.netKg;
        })(),
      },
      changes,
      finalReason,
    );
  }

  var hasWeightChange =
    isAdmin &&
    ((grossKgEdit && parseFloat(grossKgEdit) !== tx.grossKg) ||
      (!isPending && tareKgEdit && parseFloat(tareKgEdit) !== tx.tareKg));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        zIndex: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: T.card,
          border: "1px solid " + T.border,
          borderRadius: 12,
          width: "100%",
          maxWidth: 540,
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>
              Edit Ticket -- {tx.id}
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>
              {isPending ? "Pending Ticket" : "Completed Ticket"}
              {!isPending && !isAdmin && (
                <span style={{ color: T.red, marginLeft: 8 }}>
                  Admin permission required
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Ic d={IC.x} size={20} color={T.mid} />
          </button>
        </div>

        {!isPending && !isAdmin ? (
          <div style={{ padding: "20px", textAlign: "center", color: T.dim }}>
            <Ic d={IC.lock} size={40} color={T.red} />
            <div style={{ marginTop: 10, color: T.red, fontWeight: 700 }}>
              Admin Permission Required
            </div>
            <div style={{ marginTop: 6, fontSize: 12 }}>
              Only Admin or Manager can edit completed tickets.
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FInput
              label="Supplier / Customer"
              value={supplierId}
              onChange={setSupplierId}
              options={supplierOptions}
            />
            <FInput
              label="Vehicle"
              value={vehicleId}
              onChange={setVehicleId}
              options={vehicleOptions}
            />
            <FInput
              label="Driver"
              value={driverId}
              onChange={setDriverId}
              options={driverOptions}
            />

            {isPurch && (
              <div>
                <label
                  style={{
                    fontSize: 11,
                    color: T.mid,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Harvester(s)
                </label>
                <div
                  style={{
                    border: "1px solid " + T.border,
                    borderRadius: 8,
                    background: T.bg,
                    padding: "6px 8px",
                  }}
                >
                  {selHarvesters.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 4,
                        marginBottom: 6,
                      }}
                    >
                      {selHarvesters.map(function (h) {
                        return (
                          <span
                            key={h}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: T.accent + "22",
                              border: "1px solid " + T.accent + "44",
                              borderRadius: 5,
                              padding: "2px 8px",
                              fontSize: 11,
                              color: T.accent,
                              fontFamily: "IBM Plex Mono,monospace",
                            }}
                          >
                            {h}
                            <button
                              onClick={function () {
                                toggleHarvester(h);
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: T.accent,
                                fontSize: 13,
                                lineHeight: 1,
                                padding: 0,
                              }}
                            >
                              x
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <select
                    value=""
                    onChange={function (e) {
                      if (e.target.value) toggleHarvester(e.target.value);
                    }}
                    style={Object.assign({}, IS, {
                      border: "none",
                      padding: "2px 4px",
                      background: "transparent",
                      fontSize: 12,
                    })}
                  >
                    <option value="">-- Add harvester --</option>
                    {harvesterOptions
                      .filter(function (o) {
                        return !selHarvesters.includes(o.value);
                      })
                      .map(function (o) {
                        return (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        );
                      })}
                  </select>
                </div>
              </div>
            )}

            <FInput
              label="Product"
              value={product}
              onChange={setProduct}
              options={productOptions}
            />
            <FInput
              label="DN No."
              value={dnNo}
              onChange={setDnNo}
              placeholder="Optional"
            />
            <FInput
              label="Remarks"
              value={remarks}
              onChange={setRemarks}
              placeholder="Optional"
            />

            {isAdmin && (
              <div
                style={{
                  padding: "12px 14px",
                  background: T.amber + "11",
                  border: "1px solid " + T.amber + "33",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: T.amber,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  Admin: Weight Fields
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <FInput
                    label="Gross Weight (kg)"
                    value={grossKgEdit}
                    onChange={setGrossKgEdit}
                    type="number"
                  />
                  {!isPending && (
                    <FInput
                      label="Tare Weight (kg)"
                      value={tareKgEdit}
                      onChange={setTareKgEdit}
                      type="number"
                    />
                  )}
                </div>
                {hasWeightChange && (
                  <div style={{ marginTop: 8, fontSize: 11, color: T.red }}>
                    Warning: Changing weights will affect net calculation and
                    may impact payment records.
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                borderTop: "1px solid " + T.border,
                paddingTop: 12,
                marginTop: 4,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 700,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                }}
              >
                Modification Reason *
              </div>
              <FInput
                label=""
                value={reason}
                onChange={setReason}
                options={reasonOptions}
              />
              {reason === "Other" && (
                <FInput
                  label="Specify reason"
                  value={customReason}
                  onChange={setCustomReason}
                  placeholder="Enter reason..."
                  style={{ marginTop: 8 }}
                />
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <Btn label="Save Changes" icon="check" onClick={handleSave} />
              <Btn label="Cancel" icon="x" onClick={onClose} variant="ghost" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- AUDIT HISTORY MODAL -----------------------------------------------------
function AuditHistoryModal(props) {
  var tx = props.tx,
    auditLog = props.auditLog,
    onClose = props.onClose;
  var entries = auditLog
    .filter(function (a) {
      return a.ticketId === tx.id;
    })
    .sort(function (a, b) {
      return new Date(b.ts) - new Date(a, ts);
    });
  // sort fix
  var sorted = auditLog
    .filter(function (a) {
      return a.ticketId === tx.id;
    })
    .slice()
    .sort(function (a, b) {
      return new Date(b.ts) - new Date(a.ts);
    });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        zIndex: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: T.card,
          border: "1px solid " + T.border,
          borderRadius: 12,
          width: "100%",
          maxWidth: 700,
          maxHeight: "85vh",
          overflowY: "auto",
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>
              Modification History -- {tx.id}
            </div>
            <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>
              {sorted.length} modification{sorted.length !== 1 ? "s" : ""}{" "}
              recorded
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <Ic d={IC.x} size={20} color={T.mid} />
          </button>
        </div>
        {sorted.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32, color: T.dim }}>
            No modifications recorded for this ticket.
          </div>
        ) : (
          sorted.map(function (entry, ei) {
            return (
              <div
                key={ei}
                style={{
                  marginBottom: 14,
                  padding: "12px 14px",
                  background: T.bg,
                  borderRadius: 8,
                  borderLeft: "3px solid " + T.blue,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <span
                      style={{ fontSize: 11, fontWeight: 700, color: T.text }}
                    >
                      {entry.modifiedBy}
                    </span>
                    <span
                      style={{ fontSize: 11, color: T.dim, marginLeft: 10 }}
                    >
                      {fmtD(entry.ts)}
                    </span>
                  </div>
                  <Badge
                    label={
                      entry.ticketStatus === "completed"
                        ? "Completed"
                        : "Pending"
                    }
                    color={
                      entry.ticketStatus === "completed" ? T.accent : T.amber
                    }
                  />
                </div>
                <div style={{ fontSize: 11, color: T.amber, marginBottom: 6 }}>
                  Reason: {entry.reason}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {entry.changes.map(function (ch, ci) {
                    return (
                      <div
                        key={ci}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "140px 1fr 1fr",
                          gap: 8,
                          fontSize: 11,
                          padding: "4px 0",
                          borderBottom: "1px solid " + T.border + "44",
                        }}
                      >
                        <span style={{ color: T.mid, fontWeight: 600 }}>
                          {ch.field}
                        </span>
                        <span
                          style={{
                            color: T.red,
                            fontFamily: "IBM Plex Mono,monospace",
                          }}
                        >
                          - {ch.oldVal}
                        </span>
                        <span
                          style={{
                            color: T.accent,
                            fontFamily: "IBM Plex Mono,monospace",
                          }}
                        >
                          + {ch.newVal}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 10, color: T.dim, marginTop: 6 }}>
                  Branch: {entry.branch}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ---- PENDING QUEUE ----------------------------------------------------------
function PendingQueue(props) {
  var txs = props.txs,
    setTxs = props.setTxs,
    stationId = props.stationId,
    onWeighOut = props.onWeighOut;
  var suppliers = props.suppliers || [],
    vehicles = props.vehicles || [],
    drivers = props.drivers || [],
    harvesters = props.harvesters || [];
  var auditLog = props.auditLog || [],
    setAuditLog = props.setAuditLog,
    currentUser = props.currentUser;
  var isAdmin =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "supervisor");

  var [editTx, setEditTx] = useState(null);
  var pending = txs.filter(function (t) {
    return (
      t.status === "pending_out" && (!stationId || t.stationId === stationId)
    );
  });
  var avgWait = pending.length
    ? Math.round(
        pending.reduce(function (s, t) {
          return s + (Date.now() - new Date(t.weightIn)) / 60000;
        }, 0) / pending.length,
      )
    : 0;

  function handleSaveEdit(txId, updates, changes, reason) {
    var who = (currentUser && currentUser.name) || "Operator";
    var now = new Date().toISOString();
    var origTx = txs.find(function (t) {
      return t.id === txId;
    });
    // Build change list for audit
    var changeList = Object.keys(changes)
      .filter(function (k) {
        return !k.endsWith("Id") && !k.endsWith("Code");
      })
      .map(function (k) {
        return { field: k, oldVal: changes[k].old, newVal: changes[k].new };
      });
    var auditEntry = {
      id: "AL_" + Date.now(),
      ticketId: txId,
      modifiedBy: who,
      ts: now,
      ticketStatus: origTx ? origTx.status : "pending_out",
      branch: origTx ? origTx.stationPrefix : "",
      reason: reason,
      changes: changeList,
    };
    setTxs(function (prev) {
      return prev.map(function (t) {
        return t.id === txId
          ? Object.assign({}, t, updates, {
              modifiedAt: now,
              modifiedBy: who,
              isModified: true,
            })
          : t;
      });
    });
    if (setAuditLog)
      setAuditLog(function (prev) {
        return [auditEntry].concat(prev);
      });
    setEditTx(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {editTx && (
        <EditTicketModal
          tx={editTx}
          isAdmin={isAdmin}
          onClose={function () {
            setEditTx(null);
          }}
          onSave={function (updates, changes, reason) {
            handleSaveEdit(editTx.id, updates, changes, reason);
          }}
          suppliers={suppliers}
          vehicles={vehicles}
          drivers={drivers}
          harvesters={harvesters}
        />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <StatCard
          label="Pending Vehicles"
          value={pending.length}
          sub="awaiting weigh-out"
          color={T.amber}
          icon="queue"
        />
        <StatCard
          label="Avg Wait"
          value={pending.length ? avgWait + "m" : "--"}
          sub="minutes waiting"
          color={T.blue}
          icon="refresh"
        />
      </div>

      {pending.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <Ic d={IC.check} size={40} color={T.accent} />
          <div style={{ marginTop: 10, color: T.accent, fontWeight: 700 }}>
            No vehicles pending
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {pending.map(function (tx) {
            var waitMin = Math.round(
              (Date.now() - new Date(tx.weightIn)) / 60000,
            );
            var waitColor = waitMin > 60 ? T.red : T.amber;
            return (
              <Card key={tx.id} style={{ padding: "14px 16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 2,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "IBM Plex Mono,monospace",
                          fontWeight: 700,
                          color: T.accent,
                          fontSize: 13,
                        }}
                      >
                        {tx.id}
                      </div>
                      <Badge
                        label={tx.txType === "DC" ? "Delivery" : "Purchase"}
                        color={tx.txType === "DC" ? T.purple : T.accent}
                      />
                      {tx.isModified && (
                        <Badge label="Modified" color={T.amber} />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: T.text,
                        marginTop: 2,
                        fontWeight: 600,
                      }}
                    >
                      {tx.plate} -- {tx.vehicleType}
                    </div>
                    <div style={{ fontSize: 12, color: T.mid, marginTop: 2 }}>
                      {tx.supplierName}
                      {tx.ticketSource === "MANUAL" && (
                        <span style={{ marginLeft: 8 }}>
                          <Badge label="MANUAL" color={T.amber} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>
                      Driver: {tx.driverName}
                      {Array.isArray(tx.harvesters) &&
                        tx.harvesters.length > 0 && (
                          <span style={{ marginLeft: 10 }}>
                            | Harvesters: {tx.harvesters.join(", ")}
                          </span>
                        )}
                    </div>
                    <div style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>
                      In: {fmtD(tx.weightIn)} | First Weight: {fmt(tx.grossKg)}{" "}
                      kg
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 8,
                    }}
                  >
                    <Badge label={waitMin + "m waiting"} color={waitColor} />
                    <Btn
                      label="WEIGH OUT"
                      icon="weighOut"
                      onClick={function () {
                        onWeighOut(tx.id);
                      }}
                      small={true}
                      variant="amber"
                    />
                    <Btn
                      label="Edit"
                      icon="edit"
                      onClick={function () {
                        setEditTx(tx);
                      }}
                      small={true}
                      variant="ghost"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- WEIGH OUT --------------------------------------------------------------
function WeighOut(props) {
  var txs = props.txs,
    setTxs = props.setTxs;
  var stationId = props.stationId,
    preSelected = props.preSelected;

  var [selected, setSelected] = useState(preSelected || null);
  var [tareKg, setTareKg] = useState(null);
  var [ticketType, setTicketType] = useState("Normal Invoice");

  var pending = txs.filter(function (t) {
    return (
      t.status === "pending_out" && (!stationId || t.stationId === stationId)
    );
  });
  var selTx =
    pending.find(function (t) {
      return t.id === selected;
    }) || null;
  var targetTare = selTx
    ? Math.round(selTx.grossKg * 0.55 + (Math.random() - 0.5) * 200)
    : 8000;

  function handleCapture(w) {
    setTareKg(w);
  }

  function handleComplete() {
    if (!selTx || !tareKg) return;
    var net = selTx.grossKg - tareKg;
    var tt = ticketType;
    var txId = selTx.id;
    setTxs(function (prev) {
      return prev.map(function (t) {
        if (t.id !== txId) return t;
        return Object.assign({}, t, {
          status: "completed",
          weightOut: new Date().toISOString(),
          tareKg: tareKg,
          netKg: net,
          ticketType: tt,
        });
      });
    });
    alert(
      "Weigh-out complete!\nTicket: " +
        txId +
        "\nNet Weight: " +
        fmt(net) +
        " kg\nTicket Type: " +
        tt,
    );
    setSelected(null);
    setTareKg(null);
    setTicketType("Normal Invoice");
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <div
            style={{
              fontSize: 12,
              color: T.amber,
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Select Vehicle for Weigh-Out ({pending.length})
          </div>
          {pending.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: T.dim }}>
              No vehicles pending weigh-out
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pending.map(function (tx) {
                var isSelected = selected === tx.id;
                return (
                  <div
                    key={tx.id}
                    onClick={function () {
                      setSelected(tx.id);
                      setTareKg(null);
                    }}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      cursor: "pointer",
                      background: isSelected ? T.amber + "18" : T.bg,
                      border: "1px solid " + (isSelected ? T.amber : T.border),
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontFamily: "IBM Plex Mono,monospace",
                            fontWeight: 700,
                            color: T.accent,
                            fontSize: 12,
                          }}
                        >
                          {tx.id}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: T.text,
                            marginTop: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>{tx.plate}</span>
                          <span style={{ color: T.dim }}>|</span>
                          <span>{tx.supplierName}</span>
                          <Badge
                            label={
                              tx.customerType === "Walk-In Customer"
                                ? "Walk-In"
                                : "Supplier"
                            }
                            color={
                              tx.customerType === "Walk-In Customer"
                                ? T.amber
                                : T.accent
                            }
                          />
                        </div>
                        <div
                          style={{ fontSize: 11, color: T.dim, marginTop: 1 }}
                        >
                          In: {fmtD(tx.weightIn)} | Gross: {fmt(tx.grossKg)} kg
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, color: T.dim }}>
                          First Weight
                        </div>
                        <div
                          style={{
                            fontFamily: "IBM Plex Mono,monospace",
                            color: T.blue,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {fmt(tx.grossKg)} kg
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {selTx && (
          <Card>
            <div
              style={{
                fontSize: 11,
                color: T.mid,
                fontWeight: 700,
                marginBottom: 12,
                letterSpacing: 0.5,
              }}
            >
              TRANSACTION -- {selTx.id}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
                fontSize: 12,
                marginBottom: 14,
              }}
            >
              {[
                ["Ticket No", selTx.id],
                ["Vehicle", selTx.plate],
                ["Driver", selTx.driverName],
                ["TX Type", selTx.txTypeName || "Purchase / Receiving"],
                [
                  selTx.txType === "DC" ? "Customer / Destination" : "Supplier",
                  selTx.supplierName,
                ],
                ["Product", selTx.product || "FFB"],
                ["First Weight (Gross)", fmt(selTx.grossKg) + " kg"],
                ["Time In", fmtD(selTx.weightIn)],
              ].map(function (pair) {
                return (
                  <div key={pair[0]}>
                    <div
                      style={{ color: T.dim, fontSize: 10, marginBottom: 1 }}
                    >
                      {pair[0]}
                    </div>
                    <div
                      style={{
                        color: T.text,
                        fontFamily: "IBM Plex Mono,monospace",
                      }}
                    >
                      {pair[1]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 11,
                  color: T.mid,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                TICKET TYPE *
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Normal Invoice", "Cash Bill"].map(function (t) {
                  var isActive = ticketType === t;
                  return (
                    <button
                      key={t}
                      onClick={function () {
                        setTicketType(t);
                      }}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: "IBM Plex Mono,monospace",
                        background: isActive ? T.blue + "22" : T.bg,
                        border: "2px solid " + (isActive ? T.blue : T.border),
                        color: isActive ? T.blue : T.mid,
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {tareKg && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 14px",
                  background: T.accent + "11",
                  border: "1px solid " + T.accent + "44",
                  borderRadius: 8,
                  fontSize: 13,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                    marginBottom: 2,
                  }}
                >
                  <div>
                    <div
                      style={{ fontSize: 10, color: T.dim, marginBottom: 3 }}
                    >
                      First Weight
                    </div>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono,monospace",
                        color: T.blue,
                        fontWeight: 700,
                      }}
                    >
                      {fmt(selTx.grossKg)} kg
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 10, color: T.dim, marginBottom: 3 }}
                    >
                      Second Weight
                    </div>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono,monospace",
                        color: T.amber,
                        fontWeight: 700,
                      }}
                    >
                      {fmt(tareKg)} kg
                    </div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 10, color: T.dim, marginBottom: 3 }}
                    >
                      Net Weight
                    </div>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono,monospace",
                        color: T.accent,
                        fontWeight: 800,
                        fontSize: 15,
                      }}
                    >
                      {fmt(selTx.grossKg - tareKg)} kg
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tareKg && (
              <Btn
                label="CONFIRM WEIGH-OUT AND COMPLETE"
                icon="check"
                onClick={handleComplete}
              />
            )}
          </Card>
        )}
      </div>

      <div>
        {selTx ? (
          <ScaleSim
            label={"WEIGH-OUT -- " + selTx.plate}
            targetWeight={targetTare}
            onCapture={handleCapture}
          />
        ) : (
          <Card style={{ textAlign: "center", padding: 40 }}>
            <Ic d={IC.weighOut} size={48} color={T.border} />
            <div style={{ marginTop: 12, color: T.dim, fontSize: 13 }}>
              Select a vehicle from the list to begin
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ---- TICKET RECORDS ---------------------------------------------------------
function TicketRecords(props) {
  var txs = props.txs,
    setTxs = props.setTxs,
    stationId = props.stationId,
    onPrint = props.onPrint;
  var suppliers = props.suppliers || [],
    vehicles = props.vehicles || [],
    drivers = props.drivers || [],
    harvesters = props.harvesters || [];
  var auditLog = props.auditLog || [],
    setAuditLog = props.setAuditLog,
    currentUser = props.currentUser;
  var isAdmin =
    currentUser &&
    (currentUser.role === "admin" || currentUser.role === "supervisor");

  var [search, setSearch] = useState("");
  var [filter, setFilter] = useState("all");
  var [viewTx, setViewTx] = useState(null);
  var [editTx, setEditTx] = useState(null);
  var [histTx, setHistTx] = useState(null);

  function handleSaveEdit(txId, updates, changes, reason) {
    var who = (currentUser && currentUser.name) || "Operator";
    var now = new Date().toISOString();
    var origTx = txs.find(function (t) {
      return t.id === txId;
    });
    var changeList = Object.keys(changes)
      .filter(function (k) {
        return !k.endsWith("Id") && !k.endsWith("Code");
      })
      .map(function (k) {
        return { field: k, oldVal: changes[k].old, newVal: changes[k].new };
      });
    var auditEntry = {
      id: "AL_" + Date.now(),
      ticketId: txId,
      modifiedBy: who,
      ts: now,
      ticketStatus: origTx ? origTx.status : "completed",
      branch: origTx ? origTx.stationPrefix : "",
      reason: reason,
      changes: changeList,
    };
    setTxs(function (prev) {
      return prev.map(function (t) {
        return t.id === txId
          ? Object.assign({}, t, updates, {
              modifiedAt: now,
              modifiedBy: who,
              isModified: true,
            })
          : t;
      });
    });
    if (setAuditLog)
      setAuditLog(function (prev) {
        return [auditEntry].concat(prev);
      });
    if (viewTx && viewTx.id === txId)
      setViewTx(
        Object.assign({}, viewTx, updates, {
          modifiedAt: now,
          modifiedBy: who,
          isModified: true,
        }),
      );
    setEditTx(null);
  }

  // Detail view
  if (viewTx) {
    var histCount = auditLog.filter(function (a) {
      return a.ticketId === viewTx.id;
    }).length;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {editTx && (
          <EditTicketModal
            tx={editTx}
            isAdmin={isAdmin}
            onClose={function () {
              setEditTx(null);
            }}
            onSave={function (updates, changes, reason) {
              handleSaveEdit(editTx.id, updates, changes, reason);
            }}
            suppliers={suppliers}
            vehicles={vehicles}
            drivers={drivers}
            harvesters={harvesters}
          />
        )}
        {histTx && (
          <AuditHistoryModal
            tx={histTx}
            auditLog={auditLog}
            onClose={function () {
              setHistTx(null);
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Btn
            label="Back to Records"
            icon="records"
            onClick={function () {
              setViewTx(null);
            }}
            variant="ghost"
            small={true}
          />
          <Btn
            label="Print Preview"
            icon="print"
            onClick={function () {
              onPrint(viewTx);
            }}
            small={true}
          />
          <Btn
            label="Edit Ticket"
            icon="edit"
            onClick={function () {
              setEditTx(viewTx);
            }}
            small={true}
            variant="amber"
            disabled={viewTx.status === "completed" && !isAdmin}
          />
          {isAdmin && (
            <Btn
              label={"History" + (histCount > 0 ? " (" + histCount + ")" : "")}
              icon="refresh"
              onClick={function () {
                setHistTx(viewTx);
              }}
              small={true}
              variant="ghost"
            />
          )}
        </div>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 13, color: T.accent, fontWeight: 700 }}>
              TICKET -- {viewTx.id}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {viewTx.isModified && <Badge label="Modified" color={T.amber} />}
              <Badge
                label={viewTx.txType === "DC" ? "Delivery" : "Purchase"}
                color={viewTx.txType === "DC" ? T.purple : T.accent}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Ticket No", viewTx.id],
                ["Station", viewTx.stationPrefix],
                [
                  "Transaction Type",
                  viewTx.txTypeName || "Purchase / Receiving",
                ],
                ["Ticket Source", viewTx.ticketSource || "SCALE"],
                ["Ticket Type", viewTx.ticketType || "Normal Invoice"],
                ["Product", viewTx.product || "FFB"],
                [
                  "Status",
                  viewTx.status === "completed" ? "Completed" : "Pending",
                ],
              ].map(function (p) {
                return (
                  <div key={p[0]}>
                    <div
                      style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}
                    >
                      {p[0]}
                    </div>
                    <div
                      style={{
                        color: T.text,
                        fontFamily: "IBM Plex Mono,monospace",
                        fontSize: 13,
                      }}
                    >
                      {p[1]}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Supplier / Customer", viewTx.supplierName],
                ["Vehicle", viewTx.plate],
                ["Driver", viewTx.driverName],
                [
                  "Harvester(s)",
                  Array.isArray(viewTx.harvesters) &&
                  viewTx.harvesters.length > 0
                    ? viewTx.harvesters.join(", ")
                    : viewTx.harvester || "--",
                ],
                ["DN No.", viewTx.dnNo || "--"],
                ["Created By", viewTx.createdBy || "operator"],
                ["Created At", fmtD(viewTx.createdAt || viewTx.weightIn)],
              ].map(function (p) {
                return (
                  <div key={p[0]}>
                    <div
                      style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}
                    >
                      {p[0]}
                    </div>
                    <div
                      style={{
                        color: T.text,
                        fontFamily: "IBM Plex Mono,monospace",
                        fontSize: 13,
                      }}
                    >
                      {p[1]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
              padding: 14,
              background: T.bg,
              borderRadius: 8,
              marginBottom: 14,
            }}
          >
            {[
              ["Gross Weight", fmt(viewTx.grossKg) + " kg", T.blue],
              [
                "Tare Weight",
                viewTx.tareKg != null ? fmt(viewTx.tareKg) + " kg" : "Pending",
                T.amber,
              ],
              [
                "Net Weight",
                viewTx.netKg != null ? fmt(viewTx.netKg) + " kg" : "Pending",
                T.accent,
              ],
            ].map(function (p) {
              return (
                <div key={p[0]} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: T.dim, marginBottom: 4 }}>
                    {p[0]}
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      color: p[2],
                      fontFamily: "IBM Plex Mono,monospace",
                    }}
                  >
                    {p[1]}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            {[
              ["Date/Time In", fmtD(viewTx.weightIn)],
              ["Date/Time Out", fmtD(viewTx.weightOut)],
              ["Operator", viewTx.operator || viewTx.createdBy || "--"],
            ]
              .concat(
                viewTx.isModified
                  ? [
                      ["Last Modified By", viewTx.modifiedBy || "--"],
                      ["Last Modified At", fmtD(viewTx.modifiedAt)],
                    ]
                  : [],
              )
              .map(function (p) {
                return (
                  <div key={p[0]}>
                    <div
                      style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}
                    >
                      {p[0]}
                    </div>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono,monospace",
                        color: p[0].startsWith("Last") ? T.amber : T.text,
                        fontSize: 12,
                      }}
                    >
                      {p[1]}
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    );
  }

  var q = search.toLowerCase();
  var filtered = txs
    .filter(function (t) {
      return !stationId || t.stationId === stationId;
    })
    .filter(function (t) {
      if (filter === "pending") return t.status === "pending_out";
      if (filter === "completed") return t.status === "completed";
      if (filter === "PC") return t.txType === "PC";
      if (filter === "DC") return t.txType === "DC";
      return true;
    })
    .filter(function (t) {
      if (!q) return true;
      return (
        t.id.toLowerCase().includes(q) ||
        t.plate.toLowerCase().includes(q) ||
        t.supplierName.toLowerCase().includes(q) ||
        (t.driverName || "").toLowerCase().includes(q)
      );
    })
    .sort(function (a, b) {
      return new Date(b.weightIn) - new Date(a.weightIn);
    })
    .slice(0, 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {editTx && (
        <EditTicketModal
          tx={editTx}
          isAdmin={isAdmin}
          onClose={function () {
            setEditTx(null);
          }}
          onSave={function (updates, changes, reason) {
            handleSaveEdit(editTx.id, updates, changes, reason);
          }}
          suppliers={suppliers}
          vehicles={vehicles}
          drivers={drivers}
          harvesters={harvesters}
        />
      )}
      {histTx && (
        <AuditHistoryModal
          tx={histTx}
          auditLog={auditLog}
          onClose={function () {
            setHistTx(null);
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <div
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Ic d={IC.search} size={13} color={T.dim} />
          </div>
          <input
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
            placeholder="Search ticket no, vehicle, supplier, driver..."
            style={Object.assign({}, IS, { paddingLeft: 30 })}
          />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { id: "all", label: "All", color: T.accent },
            { id: "PC", label: "Purchase", color: T.accent },
            { id: "DC", label: "Delivery", color: T.purple },
            { id: "pending", label: "Pending", color: T.amber },
            { id: "completed", label: "Completed", color: T.blue },
          ].map(function (f) {
            return (
              <button
                key={f.id}
                onClick={function () {
                  setFilter(f.id);
                }}
                style={{
                  background: filter === f.id ? f.color + "22" : T.border,
                  color: filter === f.id ? f.color : T.mid,
                  border: "1px solid " + (filter === f.id ? f.color : T.border),
                  borderRadius: 6,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "IBM Plex Mono,monospace",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
      <Card>
        <div style={{ fontSize: 11, color: T.dim, marginBottom: 6 }}>
          {filtered.length} records found
        </div>
        <DataTable
          cols={[
            {
              key: "id",
              label: "Ticket No",
              render: function (v, row) {
                return (
                  <div>
                    <div
                      style={{
                        fontFamily: "IBM Plex Mono,monospace",
                        color: T.accent,
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {v}
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                      <Badge
                        label={row.txType === "DC" ? "Delivery" : "Purchase"}
                        color={row.txType === "DC" ? T.purple : T.accent}
                      />
                      {row.isModified && (
                        <Badge label="Modified" color={T.amber} />
                      )}
                    </div>
                  </div>
                );
              },
            },
            { key: "supplierName", label: "Supplier / Customer" },
            { key: "plate", label: "Vehicle" },
            {
              key: "product",
              label: "Product",
              render: function (v) {
                return v || "FFB";
              },
            },
            {
              key: "grossKg",
              label: "Gross (kg)",
              render: function (v) {
                return (
                  <span style={{ fontFamily: "IBM Plex Mono,monospace" }}>
                    {fmt(v)}
                  </span>
                );
              },
            },
            {
              key: "tareKg",
              label: "Tare (kg)",
              render: function (v) {
                return (
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono,monospace",
                      color: T.amber,
                    }}
                  >
                    {v != null ? fmt(v) : "--"}
                  </span>
                );
              },
            },
            {
              key: "netKg",
              label: "Net (kg)",
              render: function (v) {
                return (
                  <span
                    style={{
                      fontFamily: "IBM Plex Mono,monospace",
                      color: T.accent,
                      fontWeight: 700,
                    }}
                  >
                    {v != null ? fmt(v) : "--"}
                  </span>
                );
              },
            },
            {
              key: "status",
              label: "Status",
              render: function (v) {
                return (
                  <Badge
                    label={v === "completed" ? "DONE" : "PENDING"}
                    color={v === "completed" ? T.accent : T.amber}
                  />
                );
              },
            },
            {
              key: "createdBy",
              label: "Created By",
              render: function (v) {
                return (
                  <span style={{ color: T.dim, fontSize: 11 }}>
                    {v || "operator"}
                  </span>
                );
              },
            },
            {
              key: "id",
              label: "Actions",
              render: function (_, row) {
                var hc = auditLog.filter(function (a) {
                  return a.ticketId === row.id;
                }).length;
                return (
                  <div style={{ display: "flex", gap: 4 }}>
                    <Btn
                      label="View"
                      icon="eye"
                      small={true}
                      variant="ghost"
                      onClick={function () {
                        setViewTx(row);
                      }}
                    />
                    <Btn
                      label="Edit"
                      icon="edit"
                      small={true}
                      variant="ghost"
                      onClick={function () {
                        setEditTx(row);
                      }}
                      disabled={row.status === "completed" && !isAdmin}
                    />
                    <Btn
                      label="Print"
                      icon="print"
                      small={true}
                      variant="ghost"
                      onClick={function () {
                        onPrint(row);
                      }}
                    />
                    {isAdmin && (
                      <Btn
                        label={"Log" + (hc > 0 ? "(" + hc + ")" : "")}
                        icon="records"
                        small={true}
                        variant="ghost"
                        onClick={function () {
                          setHistTx(row);
                        }}
                      />
                    )}
                  </div>
                );
              },
            },
          ]}
          rows={filtered}
        />
      </Card>
    </div>
  );
}
// ---- PRINT PREVIEW ----------------------------------------------------------
function PrintPreview(props) {
  var tx = props.tx,
    onClose = props.onClose;
  if (!tx) return null;
  var sta = STATIONS.find(function (s) {
    return s.id === tx.stationId;
  }) || { name: "--", location: "--" };
  var isPending = tx.status === "pending_out";
  var isPurch = tx.txType !== "DC";
  var txLabel = isPurch
    ? "PURCHASE / RECEIVING TICKET"
    : "DELIVERY / DESPATCH TICKET";
  var txColor = isPurch ? "#16a34a" : "#7c3aed";
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#000",
          width: 420,
          borderRadius: 8,
          padding: "24px 28px",
          fontFamily: "monospace",
          fontSize: 12,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: 0.5 }}>
            {COMPANY}
          </div>
          <div
            style={{
              fontSize: 12,
              marginTop: 3,
              color: txColor,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {txLabel}
          </div>
          <div style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
            {sta.name} -- {sta.location}
          </div>
          {tx.isModified && (
            <div
              style={{
                marginTop: 4,
                display: "inline-block",
                background: "#fffbeb",
                border: "1px solid #f59e0b",
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 10,
                color: "#f59e0b",
                fontWeight: 700,
              }}
            >
              MODIFIED TICKET
            </div>
          )}
        </div>

        <div
          style={{
            border: "2px solid #000",
            borderRadius: 4,
            padding: "10px 12px",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4px 16px",
            }}
          >
            <div>
              <span style={{ color: "#555" }}>Ticket No:</span>{" "}
              <strong>{tx.id}</strong>
            </div>
            <div>
              <span style={{ color: "#555" }}>Date:</span>{" "}
              <strong>
                {tx.weightIn
                  ? new Date(tx.weightIn).toLocaleDateString("en-MY")
                  : "-"}
              </strong>
            </div>
            <div>
              <span style={{ color: "#555" }}>Station:</span> {tx.stationPrefix}
            </div>
            <div>
              <span style={{ color: "#555" }}>Ticket Type:</span>{" "}
              {tx.ticketType || "Normal Invoice"}
            </div>
            <div>
              <span style={{ color: "#555" }}>TX Type:</span>{" "}
              <strong style={{ color: txColor }}>
                {tx.txTypeName || "Purchase / Receiving"}
              </strong>
            </div>
            <div>
              <span style={{ color: "#555" }}>Status:</span>{" "}
              <strong style={{ color: isPending ? "#f59e0b" : "#16a34a" }}>
                {isPending ? "PENDING WEIGH OUT" : "COMPLETED"}
              </strong>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 11,
              borderBottom: "1px solid #ccc",
              paddingBottom: 3,
              marginBottom: 6,
              letterSpacing: 0.5,
            }}
          >
            {isPurch ? "SUPPLIER" : "CUSTOMER / DESTINATION"}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "4px 8px",
            }}
          >
            <div style={{ color: "#555" }}>
              {isPurch ? "Supplier:" : "Customer:"}
            </div>
            <div>
              <strong>{tx.supplierName}</strong>
            </div>
            <div style={{ color: "#555" }}>Vehicle No:</div>
            <div>
              <strong>{tx.plate}</strong>
            </div>
            <div style={{ color: "#555" }}>Driver:</div>
            <div>{tx.driverName}</div>
            {isPurch &&
            ((Array.isArray(tx.harvesters) && tx.harvesters.length > 0) ||
              tx.harvester) ? (
              <>
                <div style={{ color: "#555" }}>Harvester(s):</div>
                <div>
                  {Array.isArray(tx.harvesters) && tx.harvesters.length > 0
                    ? tx.harvesters.join(", ")
                    : tx.harvester}
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontWeight: 900,
              fontSize: 11,
              borderBottom: "1px solid #ccc",
              paddingBottom: 3,
              marginBottom: 6,
              letterSpacing: 0.5,
            }}
          >
            PRODUCT
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "4px 8px",
            }}
          >
            <div style={{ color: "#555" }}>Product:</div>
            <div>
              <strong>{tx.product || "FFB"}</strong>
            </div>
            {tx.dnNo ? (
              <>
                <div style={{ color: "#555" }}>DN No.:</div>
                <div>{tx.dnNo}</div>
              </>
            ) : null}
          </div>
        </div>

        <div
          style={{
            border: "2px solid #000",
            borderRadius: 4,
            padding: "10px 12px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontWeight: 900,
              fontSize: 11,
              marginBottom: 8,
              letterSpacing: 0.5,
            }}
          >
            WEIGHT RECORD
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "5px 8px",
            }}
          >
            <div style={{ color: "#555" }}>Time In:</div>
            <div>
              {tx.weightIn
                ? new Date(tx.weightIn).toLocaleTimeString("en-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </div>
            <div style={{ color: "#555" }}>Time Out:</div>
            <div>
              {tx.weightOut
                ? new Date(tx.weightOut).toLocaleTimeString("en-MY", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Pending"}
            </div>
          </div>
          <div
            style={{
              borderTop: "1px dashed #999",
              marginTop: 8,
              paddingTop: 8,
              display: "grid",
              gridTemplateColumns: "120px 1fr",
              gap: "5px 8px",
            }}
          >
            <div style={{ color: "#555" }}>Gross Weight:</div>
            <div style={{ fontWeight: 700 }}>{fmt(tx.grossKg)} kg</div>
            <div style={{ color: "#555" }}>Tare Weight:</div>
            <div style={{ fontWeight: 700 }}>
              {tx.tareKg != null ? fmt(tx.tareKg) + " kg" : "Pending"}
            </div>
          </div>
          <div
            style={{
              borderTop: "2px solid #000",
              marginTop: 6,
              paddingTop: 6,
              display: "grid",
              gridTemplateColumns: "120px 1fr",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 14 }}>NET WEIGHT:</div>
            <div style={{ fontWeight: 900, fontSize: 14 }}>
              {tx.netKg != null ? fmt(tx.netKg) + " kg" : "Pending"}
            </div>
          </div>
        </div>

        {tx.remarks && (
          <div
            style={{
              marginBottom: 10,
              padding: "6px 10px",
              background: "#f9f9f9",
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            <span style={{ color: "#555" }}>Remarks:</span> {tx.remarks}
          </div>
        )}
        {tx.manualEntry && (
          <div
            style={{
              marginBottom: 10,
              padding: "6px 10px",
              background: "#fffbeb",
              border: "1px solid #f59e0b",
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            <strong style={{ color: "#f59e0b" }}>Manual Entry</strong> --
            Reason: {tx.manualReason} -- Captured by: {tx.capturedBy}
          </div>
        )}

        <div style={{ marginBottom: 10, fontSize: 11, color: "#555" }}>
          <span>Created By: {tx.createdBy || "operator"}</span>
          {"  |  "}
          {tx.isModified && (
            <span style={{ color: "#f59e0b" }}>
              Modified: Yes (Last: {tx.modifiedBy} at{" "}
              {tx.modifiedAt
                ? new Date(tx.modifiedAt).toLocaleDateString("en-MY")
                : "--"}
              ){"  |  "}
            </span>
          )}
          <span>
            Printed:{" "}
            {new Date().toLocaleString("en-MY", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
              Issued By:
            </div>
            <div style={{ borderBottom: "1px solid #000", height: 28 }}></div>
            <div style={{ fontSize: 9, color: "#999", marginTop: 3 }}>
              Name / Signature / Date
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
              Received By:
            </div>
            <div style={{ borderBottom: "1px solid #000", height: 28 }}></div>
            <div style={{ fontSize: 9, color: "#999", marginTop: 3 }}>
              Name / Signature / Date
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            borderTop: "1px dashed #ccc",
            paddingTop: 8,
            fontSize: 9,
            color: "#aaa",
          }}
        >
          Computer generated document -- PalmWeigh Pro UAT Demo
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button
            onClick={function () {
              window.print();
            }}
            style={{
              flex: 1,
              padding: "9px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            PRINT
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "9px",
              background: "#eee",
              color: "#000",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
// ---- CRUD MODULE (shared) ---------------------------------------------------
function CrudMod(props) {
  var title = props.title,
    color = props.color || T.accent;
  var items = props.items,
    setItems = props.setItems;
  var buildEmpty = props.buildEmpty,
    fields = props.fields,
    cols = props.cols;

  var [search, setSearch] = useState("");
  var [form, setForm] = useState(null);
  var [editId, setEditId] = useState(null);

  var q = search.toLowerCase();
  var filtered = items.filter(function (it) {
    return Object.values(it).some(function (v) {
      return String(v).toLowerCase().includes(q);
    });
  });

  function openNew() {
    setForm(buildEmpty());
    setEditId(null);
  }
  function openEdit(it) {
    setForm(
      Object.assign({}, it, {
        estates: Array.isArray(it.estates)
          ? it.estates.join(", ")
          : it.estates || "",
      }),
    );
    setEditId(it.id);
  }
  function setField(k, v) {
    setForm(function (f) {
      return Object.assign({}, f, { [k]: v });
    });
  }

  function save() {
    if (!form) return;
    var record = Object.assign({}, form);
    if (typeof record.estates === "string") {
      record.estates = record.estates
        .split(",")
        .map(function (e) {
          return e.trim();
        })
        .filter(Boolean);
    }
    if (record.tare) record.tare = parseInt(record.tare);
    if (editId) {
      setItems(function (prev) {
        return prev.map(function (i) {
          return i.id === editId
            ? Object.assign({}, record, { id: editId })
            : i;
        });
      });
    } else {
      setItems(function (prev) {
        return prev.concat([
          Object.assign({}, record, { id: "id_" + Date.now() }),
        ]);
      });
    }
    setForm(null);
    setEditId(null);
  }

  function toggle(id) {
    setItems(function (prev) {
      return prev.map(function (i) {
        return i.id === id ? Object.assign({}, i, { active: !i.active }) : i;
      });
    });
  }

  var F = form || {};
  var actionCol = {
    key: "id",
    label: "Actions",
    render: function (_, row) {
      return (
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <Btn
            label="Edit"
            icon="edit"
            small={true}
            variant="ghost"
            onClick={function () {
              openEdit(row);
            }}
          />
          <span
            onClick={function () {
              toggle(row.id);
            }}
            style={{ cursor: "pointer" }}
          >
            <Badge
              label={row.active ? "ACTIVE" : "INACTIVE"}
              color={row.active ? T.accent : T.red}
            />
          </span>
        </div>
      );
    },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
          <div
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Ic d={IC.search} size={13} color={T.dim} />
          </div>
          <input
            value={search}
            onChange={function (e) {
              setSearch(e.target.value);
            }}
            placeholder={"Search " + title.toLowerCase() + "..."}
            style={Object.assign({}, IS, { paddingLeft: 30 })}
          />
        </div>
        <Btn label={"Add " + title} icon="plus" onClick={openNew} />
      </div>

      {form && (
        <Card style={{ borderColor: color + "44" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: color,
              marginBottom: 12,
            }}
          >
            {editId ? "EDIT" : "NEW"} {title.toUpperCase()}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
              gap: 10,
            }}
          >
            {fields.map(function (f) {
              return (
                <FInput
                  key={f.key}
                  label={f.label}
                  value={F[f.key] || ""}
                  onChange={function (v) {
                    setField(f.key, v);
                  }}
                  type={f.type || "text"}
                  placeholder={f.placeholder || ""}
                  options={f.options}
                  required={f.required}
                  style={f.full ? { gridColumn: "span 2" } : {}}
                />
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <Btn label="Save" icon="check" onClick={save} />
            <Btn
              label="Cancel"
              icon="x"
              onClick={function () {
                setForm(null);
              }}
              variant="ghost"
            />
          </div>
        </Card>
      )}

      <Card>
        <div style={{ fontSize: 11, color: T.dim, marginBottom: 8 }}>
          {filtered.length} records
        </div>
        <DataTable cols={cols.concat([actionCol])} rows={filtered} />
      </Card>
    </div>
  );
}

function SupplierMgmt(props) {
  return (
    <CrudMod
      title="Customer / Supplier"
      color={T.purple}
      items={props.suppliers}
      setItems={props.setSuppliers}
      buildEmpty={function () {
        return {
          name: "",
          code: "",
          address: "",
          contact: "",
          estates: "",
          active: true,
        };
      }}
      fields={[
        { key: "name", label: "Company Name", required: true },
        { key: "code", label: "Code (e.g. LMJ)", required: true },
        { key: "contact", label: "Contact No" },
        { key: "address", label: "Address" },
        {
          key: "estates",
          label: "Estates / Blocks (comma-separated)",
          full: true,
        },
      ]}
      cols={[
        {
          key: "code",
          label: "Code",
          render: function (v) {
            return (
              <span
                style={{
                  fontFamily: "IBM Plex Mono,monospace",
                  color: T.accent,
                  fontWeight: 700,
                }}
              >
                {v}
              </span>
            );
          },
        },
        { key: "name", label: "Customer / Supplier" },
        { key: "contact", label: "Contact" },
        { key: "address", label: "Address" },
        {
          key: "estates",
          label: "Estates",
          render: function (v) {
            return (Array.isArray(v) ? v : []).slice(0, 3).map(function (e) {
              return (
                <span key={e} style={{ marginRight: 4 }}>
                  <Badge label={e} color={T.purple} />
                </span>
              );
            });
          },
        },
      ]}
    />
  );
}

function VehicleMgmt(props) {
  var drivers = props.drivers;
  return (
    <CrudMod
      title="Vehicle"
      color={T.blue}
      items={props.vehicles}
      setItems={props.setVehicles}
      buildEmpty={function () {
        return {
          plate: "",
          type: "Lorry",
          tare: "",
          rfid: "",
          driverId: "",
          stationId: "s1",
          active: true,
        };
      }}
      fields={[
        { key: "plate", label: "Plate No", required: true },
        {
          key: "type",
          label: "Type",
          options: [
            { value: "Lorry", label: "Lorry" },
            { value: "Truck", label: "Truck" },
            { value: "Pickup", label: "Pickup" },
            { value: "Trailer", label: "Trailer" },
          ],
        },
        {
          key: "tare",
          label: "Tare Weight (kg)",
          type: "number",
          required: true,
        },
        { key: "rfid", label: "RFID Tag", placeholder: "Optional" },
        {
          key: "driverId",
          label: "Default Driver",
          options: drivers.map(function (d) {
            return { value: d.id, label: d.name };
          }),
        },
        {
          key: "stationId",
          label: "Station",
          options: STATIONS.map(function (s) {
            return { value: s.id, label: s.name + " (" + s.location + ")" };
          }),
        },
      ]}
      cols={[
        {
          key: "plate",
          label: "Plate",
          render: function (v) {
            return (
              <span
                style={{
                  fontFamily: "IBM Plex Mono,monospace",
                  color: T.accent,
                  fontWeight: 700,
                }}
              >
                {v}
              </span>
            );
          },
        },
        { key: "type", label: "Type" },
        {
          key: "tare",
          label: "Tare (kg)",
          render: function (v) {
            return (
              <span style={{ fontFamily: "IBM Plex Mono,monospace" }}>
                {fmt(v)}
              </span>
            );
          },
        },
        {
          key: "rfid",
          label: "RFID",
          render: function (v) {
            return v ? (
              <Badge label={v} color={T.blue} />
            ) : (
              <span style={{ color: T.dim }}>--</span>
            );
          },
        },
        {
          key: "driverId",
          label: "Driver",
          render: function (v) {
            var d = drivers.find(function (x) {
              return x.id === v;
            });
            return d ? d.name : "--";
          },
        },
      ]}
    />
  );
}

function DriverMgmt(props) {
  return (
    <CrudMod
      title="Driver"
      items={props.drivers}
      setItems={props.setDrivers}
      buildEmpty={function () {
        return {
          name: "",
          ic: "",
          phone: "",
          rfid: "",
          license: "",
          stationId: "s1",
          active: true,
        };
      }}
      fields={[
        { key: "name", label: "Full Name", required: true },
        { key: "ic", label: "IC Number", required: true },
        { key: "phone", label: "Phone" },
        { key: "rfid", label: "RFID Tag", placeholder: "Optional" },
        { key: "license", label: "License No" },
        {
          key: "stationId",
          label: "Station",
          options: STATIONS.map(function (s) {
            return { value: s.id, label: s.name + " (" + s.location + ")" };
          }),
        },
      ]}
      cols={[
        { key: "name", label: "Name" },
        { key: "ic", label: "IC No" },
        { key: "phone", label: "Phone" },
        {
          key: "rfid",
          label: "RFID",
          render: function (v) {
            return v ? (
              <Badge label={v} color={T.blue} />
            ) : (
              <span style={{ color: T.dim }}>--</span>
            );
          },
        },
        { key: "license", label: "License" },
        {
          key: "stationId",
          label: "Station",
          render: function (v) {
            var s = STATIONS.find(function (x) {
              return x.id === v;
            });
            return s ? s.name : v;
          },
        },
      ]}
    />
  );
}

// ---- SETTINGS ---------------------------------------------------------------
function AppSettings(props) {
  var auditLog = props.auditLog || [];
  var isAdmin =
    props.currentUser &&
    (props.currentUser.role === "admin" ||
      props.currentUser.role === "supervisor");
  var [conf, setConf] = useState(false);
  function doReset() {
    if (!conf) {
      setConf(true);
      return;
    }
    props.setTxs(TX0);
    props.setDrivers(DRIVERS0);
    props.setVehicles(VEHICLES0);
    props.setSuppliers(SUPPLIERS0);
    props.setCounters(COUNTERS0);
    if (props.setHarvesters) props.setHarvesters(HARVESTERS0);
    if (props.setAuditLog) props.setAuditLog([]);
    setConf(false);
    alert("Demo data has been reset to defaults.");
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        maxWidth: 640,
      }}
    >
      <Card>
        <div
          style={{
            fontSize: 12,
            color: T.accent,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          SYSTEM INFORMATION
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            fontSize: 12,
          }}
        >
          {[
            ["System", "PalmWeigh Pro"],
            ["Version", "v4.1 Phase 1 UAT"],
            ["Company", COMPANY],
            ["Logged In", props.currentUser ? props.currentUser.name : "--"],
            [
              "Role",
              props.currentUser ? props.currentUser.role.toUpperCase() : "--",
            ],
          ].map(function (p) {
            return (
              <div
                key={p[0]}
                style={{
                  padding: "8px 10px",
                  background: T.bg,
                  borderRadius: 6,
                }}
              >
                <div style={{ fontSize: 10, color: T.dim, marginBottom: 2 }}>
                  {p[0]}
                </div>
                <div
                  style={{
                    color: T.text,
                    fontFamily: "IBM Plex Mono,monospace",
                  }}
                >
                  {p[1]}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div
          style={{
            fontSize: 12,
            color: T.accent,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          STATION CONFIGURATION
        </div>
        <DataTable
          cols={[
            { key: "id", label: "ID" },
            { key: "name", label: "Station Name" },
            { key: "location", label: "Location" },
            {
              key: "prefix",
              label: "Ticket Prefix",
              render: function (v) {
                return <Badge label={v} color={T.amber} />;
              },
            },
          ]}
          rows={STATIONS}
        />
      </Card>

      <Card>
        <div
          style={{
            fontSize: 12,
            color: T.accent,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          USER ACCOUNTS
        </div>
        <div style={{ fontSize: 11, color: T.dim, marginBottom: 12 }}>
          UAT demo only -- production will use proper authentication
        </div>
        <DataTable
          cols={[
            { key: "name", label: "Name" },
            { key: "username", label: "Username" },
            {
              key: "role",
              label: "Role",
              render: function (v) {
                return (
                  <Badge
                    label={v.toUpperCase()}
                    color={v === "admin" ? T.accent : T.blue}
                  />
                );
              },
            },
          ]}
          rows={props.users}
        />
      </Card>

      <Card>
        <div
          style={{
            fontSize: 12,
            color: T.accent,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          FUTURE MODULES ROADMAP
        </div>
        <div style={{ fontSize: 11, color: T.dim, marginBottom: 12 }}>
          These modules are not part of the current UAT demo and are planned for
          future development phases.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            "Purchase Management",
            "Delivery / Despatch Management",
            "Multi Weighbridge Branch Management",
            "Offline Sync Centre",
            "AI Payroll Assistant",
            "Supplier Settlement",
            "Statement of Account",
            "Data Migration Utility",
            "Hardware Indicator Integration",
            "RFID / QR Vehicle Tracking",
          ].map(function (m) {
            return (
              <div
                key={m}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 12px",
                  background: T.bg,
                  borderRadius: 6,
                }}
              >
                <span style={{ fontSize: 12, color: T.text }}>{m}</span>
                <Badge label="Future" color={T.purple} />
              </div>
            );
          })}
        </div>
      </Card>

      {isAdmin && (
        <Card>
          <div
            style={{
              fontSize: 12,
              color: T.accent,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            AUDIT LOG SUMMARY
          </div>
          <div style={{ fontSize: 11, color: T.dim, marginBottom: 10 }}>
            {auditLog.length} modification record
            {auditLog.length !== 1 ? "s" : ""} stored. Full history visible
            per-ticket in Ticket Records.
          </div>
          {auditLog.slice(0, 5).map(function (entry, i) {
            return (
              <div
                key={i}
                style={{
                  padding: "8px 10px",
                  background: T.bg,
                  borderRadius: 6,
                  marginBottom: 6,
                  fontSize: 11,
                }}
              >
                <span
                  style={{
                    color: T.accent,
                    fontFamily: "IBM Plex Mono,monospace",
                  }}
                >
                  {entry.ticketId}
                </span>
                <span style={{ color: T.dim, marginLeft: 10 }}>
                  {fmtD(entry.ts)}
                </span>
                <span style={{ color: T.text, marginLeft: 10 }}>
                  by {entry.modifiedBy}
                </span>
                <span style={{ color: T.amber, marginLeft: 10 }}>
                  {entry.reason}
                </span>
              </div>
            );
          })}
          {auditLog.length === 0 && (
            <div style={{ color: T.dim, fontSize: 11 }}>
              No modifications recorded yet.
            </div>
          )}
        </Card>
      )}

      <Card style={{ borderColor: T.red + "44" }}>
        <div
          style={{
            fontSize: 12,
            color: T.red,
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          RESET DEMO DATA
        </div>
        <div style={{ fontSize: 12, color: T.mid, marginBottom: 12 }}>
          Restores all demo transactions, drivers, vehicles, and suppliers to
          default values. Cannot be undone.
        </div>
        {conf && (
          <div
            style={{
              fontSize: 12,
              color: T.amber,
              marginBottom: 10,
              padding: "8px 10px",
              background: T.amber + "11",
              borderRadius: 6,
              border: "1px solid " + T.amber + "33",
            }}
          >
            Click again to confirm. All current data will be overwritten.
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <Btn
            label={conf ? "CONFIRM RESET" : "RESET DEMO DATA"}
            icon="refresh"
            onClick={doReset}
            variant="danger"
          />
          {conf && (
            <Btn
              label="Cancel"
              icon="x"
              onClick={function () {
                setConf(false);
              }}
              variant="ghost"
            />
          )}
        </div>
      </Card>
    </div>
  );
}

// ---- NAV CONFIG -------------------------------------------------------------

// ---- AI PAYROLL PREVIEW (Demo mockup - no real AI or backend) ---------------
var PAYROLL_WORKERS = [
  {
    id: "W001",
    name: "Ahmad bin Yusof",
    days: 22,
    ot: 8,
    basic: 1800,
    status: "OK",
  },
  {
    id: "W002",
    name: "Azman bin Harun",
    days: 20,
    ot: 14,
    basic: 1800,
    status: "High OT",
  },
  {
    id: "W003",
    name: "Kumar Selvam",
    days: 18,
    ot: 6,
    basic: 1600,
    status: "Review",
  },
  { id: "W004", name: "Raj Gopal", days: 22, ot: 0, basic: 1700, status: "OK" },
  {
    id: "W005",
    name: "Lee Chee Wai",
    days: 15,
    ot: 4,
    basic: 1600,
    status: "Missing",
  },
  {
    id: "W006",
    name: "Siti Aminah binti Johari",
    days: 22,
    ot: 18,
    basic: 1800,
    status: "High OT",
  },
  {
    id: "W007",
    name: "Faridah Othman",
    days: 21,
    ot: 2,
    basic: 1500,
    status: "OK",
  },
  {
    id: "W008",
    name: "Lim Boon Keat",
    days: 22,
    ot: 6,
    basic: 1900,
    status: "OK",
  },
  {
    id: "W009",
    name: "Selvakumar Raju",
    days: 19,
    ot: 10,
    basic: 1700,
    status: "Review",
  },
  {
    id: "W010",
    name: "Nurul Hana Zainol",
    days: 0,
    ot: 0,
    basic: 1600,
    status: "Missing",
  },
];

function calcPayroll(w) {
  var OT_RATE = 10.5;
  var DEDUCT = w.status === "Missing" ? 320 : w.days < 20 ? 120 : 0;
  var otPay = Math.round(w.ot * OT_RATE * 100) / 100;
  var net = w.basic + otPay - DEDUCT;
  return { otPay: otPay, deductions: DEDUCT, net: net };
}

function AIPayroll() {
  var [tab, setTab] = useState("summary");

  var totalDays = PAYROLL_WORKERS.reduce(function (s, w) {
    return s + w.days;
  }, 0);
  var totalOT = PAYROLL_WORKERS.reduce(function (s, w) {
    return s + w.ot;
  }, 0);
  var totalNet = PAYROLL_WORKERS.reduce(function (s, w) {
    return s + calcPayroll(w).net;
  }, 0);
  var highOT = PAYROLL_WORKERS.filter(function (w) {
    return w.ot >= 10;
  });
  var missing = PAYROLL_WORKERS.filter(function (w) {
    return w.status === "Missing";
  });
  var review = PAYROLL_WORKERS.filter(function (w) {
    return w.status === "Review";
  });

  var insights = [
    {
      color: T.amber,
      text:
        highOT.length +
        " worker" +
        (highOT.length !== 1 ? "s" : "") +
        " have high overtime (>= 10 hrs): " +
        highOT
          .map(function (w) {
            return w.name.split(" ")[0];
          })
          .join(", "),
    },
    {
      color: T.red,
      text:
        missing.length +
        " worker" +
        (missing.length !== 1 ? "s" : "") +
        " have missing attendance records and may require follow-up",
    },
    {
      color: T.purple,
      text:
        review.length +
        " worker salary requires supervisor review before finalising",
    },
    {
      color: T.accent,
      text:
        "Total estimated monthly payroll: RM " +
        Math.round(totalNet).toLocaleString("en-MY"),
    },
    {
      color: T.blue,
      text:
        "Average working days this period: " +
        (totalDays / PAYROLL_WORKERS.length).toFixed(1) +
        " days",
    },
  ];

  var TABS = [
    { id: "summary", label: "Summary" },
    { id: "workers", label: "Payroll Table" },
    { id: "insights", label: "AI Insights" },
  ];

  var statusColor = function (s) {
    if (s === "High OT") return T.amber;
    if (s === "Missing") return T.red;
    if (s === "Review") return T.purple;
    return T.accent;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          padding: "10px 16px",
          background: T.amber + "18",
          border: "1px solid " + T.amber + "44",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Ic d={IC.alert} size={16} color={T.amber} />
        <span style={{ fontSize: 12, color: T.amber, fontWeight: 600 }}>
          Demo Preview Only -- final payroll rules will follow company salary
          policy.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid " + T.border,
        }}
      >
        {TABS.map(function (t) {
          var active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={function () {
                setTab(t.id);
              }}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  "2px solid " + (active ? T.accent : "transparent"),
                color: active ? T.accent : T.mid,
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                fontFamily: "IBM Plex Mono,monospace",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "summary" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 10,
            }}
          >
            <StatCard
              label="Total Workers"
              value={PAYROLL_WORKERS.length}
              sub="on payroll list"
              color={T.accent}
              icon="driver"
            />
            <StatCard
              label="Attendance Records"
              value={
                PAYROLL_WORKERS.filter(function (w) {
                  return w.days > 0;
                }).length
              }
              sub="with valid records"
              color={T.blue}
              icon="check"
            />
            <StatCard
              label="Total Working Days"
              value={totalDays}
              sub="across all workers"
              color={T.mid}
              icon="refresh"
            />
            <StatCard
              label="Total Overtime Hours"
              value={totalOT + "h"}
              sub="this period"
              color={T.amber}
              icon="chart"
            />
            <StatCard
              label="Est. Monthly Payroll"
              value={"RM " + Math.round(totalNet / 1000).toFixed(1) + "k"}
              sub={"RM " + Math.round(totalNet).toLocaleString("en-MY")}
              color={T.accent}
              icon="scale"
            />
            <StatCard
              label="Pending Issues"
              value={missing.length + review.length}
              sub="require attention"
              color={T.red}
              icon="alert"
            />
          </div>

          <Card>
            <div
              style={{
                fontSize: 11,
                color: T.mid,
                fontWeight: 700,
                marginBottom: 14,
                letterSpacing: 0.5,
              }}
            >
              PAYROLL CALCULATION FORMULA
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                padding: "14px 18px",
                background: T.bg,
                borderRadius: 8,
                fontFamily: "IBM Plex Mono,monospace",
                fontSize: 13,
              }}
            >
              <span style={{ color: T.blue }}>Basic Salary</span>
              <span style={{ color: T.dim }}>+</span>
              <span style={{ color: T.accent }}>Overtime Pay</span>
              <span style={{ color: T.dim }}>-</span>
              <span style={{ color: T.red }}>Deductions</span>
              <span style={{ color: T.dim }}>=</span>
              <span style={{ color: T.text, fontWeight: 800, fontSize: 15 }}>
                Net Salary
              </span>
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: T.dim,
                lineHeight: 1.8,
              }}
            >
              <div>Overtime Rate: RM 10.50 per hour (demo rate)</div>
              <div>
                Deductions include unpaid leave, late deductions, and statutory
                contributions (demo only)
              </div>
              <div>
                Final values subject to HR approval and company salary policy
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "workers" && (
        <Card>
          <div
            style={{
              fontSize: 11,
              color: T.mid,
              fontWeight: 700,
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            WORKER PAYROLL TABLE -- {PAYROLL_WORKERS.length} Workers
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid " + T.border }}>
                  {[
                    "Worker ID",
                    "Worker Name",
                    "Working Days",
                    "OT Hours",
                    "Basic Salary",
                    "OT Pay",
                    "Deductions",
                    "Est. Net Salary",
                    "Status",
                  ].map(function (h) {
                    return (
                      <th
                        key={h}
                        style={{
                          padding: "7px 10px",
                          textAlign: "left",
                          color: T.dim,
                          fontWeight: 600,
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PAYROLL_WORKERS.map(function (w) {
                  var p = calcPayroll(w);
                  return (
                    <tr
                      key={w.id}
                      style={{ borderBottom: "1px solid " + T.border + "22" }}
                      onMouseEnter={function (e) {
                        e.currentTarget.style.background = T.surface;
                      }}
                      onMouseLeave={function (e) {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 10px",
                          color: T.dim,
                          fontFamily: "IBM Plex Mono,monospace",
                          fontSize: 11,
                        }}
                      >
                        {w.id}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          color: T.text,
                          fontWeight: 600,
                        }}
                      >
                        {w.name}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          color: T.text,
                          fontFamily: "IBM Plex Mono,monospace",
                          textAlign: "center",
                        }}
                      >
                        {w.days}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "IBM Plex Mono,monospace",
                          textAlign: "center",
                          color: w.ot >= 10 ? T.amber : T.text,
                        }}
                      >
                        {w.ot}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "IBM Plex Mono,monospace",
                          color: T.blue,
                        }}
                      >
                        {"RM " + w.basic.toLocaleString("en-MY")}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "IBM Plex Mono,monospace",
                          color: T.accent,
                        }}
                      >
                        {"RM " + p.otPay.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "IBM Plex Mono,monospace",
                          color: p.deductions > 0 ? T.red : T.dim,
                        }}
                      >
                        {"RM " + p.deductions.toFixed(2)}
                      </td>
                      <td
                        style={{
                          padding: "8px 10px",
                          fontFamily: "IBM Plex Mono,monospace",
                          fontWeight: 800,
                          color: T.text,
                        }}
                      >
                        {"RM " + Math.round(p.net).toLocaleString("en-MY")}
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <Badge label={w.status} color={statusColor(w.status)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid " + T.border }}>
                  <td
                    colSpan={4}
                    style={{
                      padding: "10px",
                      fontSize: 12,
                      color: T.mid,
                      fontWeight: 700,
                    }}
                  >
                    TOTAL
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontFamily: "IBM Plex Mono,monospace",
                      fontWeight: 700,
                      color: T.blue,
                      fontSize: 12,
                    }}
                  >
                    {"RM " +
                      PAYROLL_WORKERS.reduce(function (s, w) {
                        return s + w.basic;
                      }, 0).toLocaleString("en-MY")}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontFamily: "IBM Plex Mono,monospace",
                      fontWeight: 700,
                      color: T.accent,
                      fontSize: 12,
                    }}
                  >
                    {"RM " +
                      PAYROLL_WORKERS.reduce(function (s, w) {
                        return s + calcPayroll(w).otPay;
                      }, 0).toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontFamily: "IBM Plex Mono,monospace",
                      fontWeight: 700,
                      color: T.red,
                      fontSize: 12,
                    }}
                  >
                    {"RM " +
                      PAYROLL_WORKERS.reduce(function (s, w) {
                        return s + calcPayroll(w).deductions;
                      }, 0).toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "10px",
                      fontFamily: "IBM Plex Mono,monospace",
                      fontWeight: 800,
                      color: T.accent,
                      fontSize: 13,
                    }}
                  >
                    {"RM " + Math.round(totalNet).toLocaleString("en-MY")}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {tab === "insights" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card style={{ borderColor: T.purple + "44", background: T.card }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: T.purple + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ic d={IC.chart} size={16} color={T.purple} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                  AI Payroll Insights
                </div>
                <div style={{ fontSize: 11, color: T.dim }}>
                  Rule-based analysis -- demo preview only
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {insights.map(function (ins, i) {
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "12px 14px",
                      background: T.bg,
                      borderRadius: 8,
                      borderLeft: "3px solid " + ins.color,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: ins.color,
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    ></div>
                    <div
                      style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}
                    >
                      {ins.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div
              style={{
                fontSize: 11,
                color: T.mid,
                fontWeight: 700,
                marginBottom: 12,
                letterSpacing: 0.5,
              }}
            >
              WORKER STATUS BREAKDOWN
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 10,
              }}
            >
              {[
                [
                  "OK",
                  PAYROLL_WORKERS.filter(function (w) {
                    return w.status === "OK";
                  }).length,
                  T.accent,
                ],
                [
                  "High OT",
                  PAYROLL_WORKERS.filter(function (w) {
                    return w.status === "High OT";
                  }).length,
                  T.amber,
                ],
                [
                  "Review",
                  PAYROLL_WORKERS.filter(function (w) {
                    return w.status === "Review";
                  }).length,
                  T.purple,
                ],
                [
                  "Missing",
                  PAYROLL_WORKERS.filter(function (w) {
                    return w.status === "Missing";
                  }).length,
                  T.red,
                ],
              ].map(function (row) {
                return (
                  <div
                    key={row[0]}
                    style={{
                      padding: "14px",
                      background: T.bg,
                      borderRadius: 8,
                      textAlign: "center",
                      borderTop: "3px solid " + row[2],
                    }}
                  >
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: row[2],
                        fontFamily: "IBM Plex Mono,monospace",
                      }}
                    >
                      {row[1]}
                    </div>
                    <div style={{ fontSize: 11, color: T.dim, marginTop: 4 }}>
                      {row[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div
            style={{
              padding: "10px 16px",
              background: T.blue + "11",
              border: "1px solid " + T.blue + "33",
              borderRadius: 8,
              fontSize: 12,
              color: T.blue,
            }}
          >
            <strong>Next Steps (Future Phases):</strong> Connect attendance
            records from biometric device, integrate with payroll software,
            enable manager approval workflow, generate EPF/SOCSO/EIS
            contribution reports.
          </div>
        </div>
      )}
    </div>
  );
}

// ---- FUTURE MODULES (Roadmap - Presentation Only) ---------------------------
function FutureModules() {
  var phases = [
    {
      phase: "Phase 2",
      color: T.blue,
      label: "Available for Development",
      items: [
        {
          name: "Desktop Offline Mode",
          desc: "Full offline operation with local database sync when connectivity restored.",
        },
        {
          name: "Multi Collection Centres",
          desc: "Support multiple weighbridge stations under one HQ account with centralised reporting.",
        },
        {
          name: "Purchase Management",
          desc: "Full purchase order, receiving, and supplier management module.",
        },
        {
          name: "Delivery / Despatch Management",
          desc: "Outgoing goods tracking, delivery orders, and despatch records.",
        },
        {
          name: "Data Migration",
          desc: "Import historical ticket records from existing systems into PalmWeigh.",
        },
        {
          name: "HQ Reporting",
          desc: "Consolidated reports across all stations viewable from headquarters.",
        },
      ],
    },
    {
      phase: "Phase 3",
      color: T.purple,
      label: "Planned",
      items: [
        {
          name: "Supplier Settlement",
          desc: "Record and manage monthly settlement with registered suppliers. View outstanding balances.",
        },
        {
          name: "Statement of Account",
          desc: "Generate and send statements of account to suppliers with full transaction history.",
        },
        {
          name: "Payroll Management",
          desc: "Full worker attendance, salary calculation, and payslip generation module.",
        },
        {
          name: "AI Payroll Assistant",
          desc: "Rule-based AI to flag anomalies, suggest corrections, and summarise payroll.",
        },
        {
          name: "Business Intelligence",
          desc: "Charts, trends, and KPI dashboards for management decision making.",
        },
      ],
    },
    {
      phase: "Phase 4",
      color: T.amber,
      label: "Planned",
      items: [
        {
          name: "Hardware Indicator Integration",
          desc: "Live RS-232 / TCP-IP / Modbus connection to physical weighbridge indicator.",
        },
        {
          name: "RFID / QR Vehicle Tracking",
          desc: "Automatic vehicle and driver identification via RFID reader at gate.",
        },
        {
          name: "Offline Sync Centre",
          desc: "Branch-level offline operation with centralised sync to HQ database.",
        },
        {
          name: "Camera Integration",
          desc: "Capture vehicle photos at entry and exit for audit trail.",
        },
      ],
    },
    {
      phase: "Phase 5",
      color: T.accent,
      label: "Future Expansion",
      items: [
        {
          name: "Mobile App",
          desc: "iOS and Android app for supervisors and management to monitor operations remotely.",
        },
        {
          name: "Management Portal",
          desc: "Web portal for owners and managers to view live operations and approve transactions.",
        },
        {
          name: "WhatsApp Notifications",
          desc: "Automated ticket confirmations, alerts, and daily summaries via WhatsApp.",
        },
      ],
    },
  ];
  var statusColors = {
    "Available for Development": T.blue,
    Planned: T.amber,
    "Future Expansion": T.accent,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          padding: "12px 16px",
          background: T.surface,
          border: "1px solid " + T.border,
          borderRadius: 10,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <Ic d={IC.alert} size={18} color={T.amber} />
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.amber,
              marginBottom: 4,
            }}
          >
            Notice
          </div>
          <div style={{ fontSize: 12, color: T.mid, lineHeight: 1.6 }}>
            These modules are not included in the current demo and are shown for
            future expansion planning only. All features listed below require
            separate development phases, timelines, and agreements.
          </div>
        </div>
      </div>

      {phases.map(function (ph) {
        return (
          <div key={ph.phase}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: ph.color,
                  fontFamily: "IBM Plex Mono,monospace",
                }}
              >
                {ph.phase}
              </div>
              <Badge label={ph.label} color={statusColors[ph.label] || T.mid} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 10,
              }}
            >
              {ph.items.map(function (item) {
                return (
                  <div
                    key={item.name}
                    style={{
                      background: T.card,
                      border: "1px solid " + T.border,
                      borderLeft: "3px solid " + ph.color,
                      borderRadius: 10,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: T.text,
                        marginBottom: 6,
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{ fontSize: 11, color: T.dim, lineHeight: 1.6 }}
                    >
                      {item.desc}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <Badge label={ph.label} color={ph.color} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div
        style={{
          padding: "12px 16px",
          background: T.blue + "11",
          border: "1px solid " + T.blue + "33",
          borderRadius: 8,
          fontSize: 12,
          color: T.blue,
          lineHeight: 1.7,
        }}
      >
        <strong>Current Demo Scope:</strong> Login, Weigh In (Registered
        Supplier and Walk-In Customer), Pending Queue, Weigh Out, Ticket
        Records, Print Preview, Customer/Supplier Management, Vehicle
        Management, Driver Management, Settings, and AI Payroll Preview.
      </div>
    </div>
  );
}

// ---- COMING SOON STUB -------------------------------------------------------
function ComingSoon(props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 400,
      }}
    >
      <Card
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: T.purple + "22",
            border: "2px solid " + T.purple + "66",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Ic d={IC.rocket} size={28} color={T.purple} />
        </div>
        <Badge label="COMING SOON" color={T.purple} />
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: T.text,
            marginTop: 14,
            marginBottom: 10,
          }}
        >
          {props.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: T.mid,
            lineHeight: 1.7,
            marginBottom: 20,
          }}
        >
          {props.desc}
        </div>
        <div
          style={{
            padding: "10px 16px",
            background: T.purple + "11",
            border: "1px solid " + T.purple + "33",
            borderRadius: 8,
            fontSize: 12,
            color: T.purple,
          }}
        >
          This module is planned for a future development phase. It is not
          included in the current UAT demo scope.
        </div>
      </Card>
    </div>
  );
}

var NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "weighIn", label: "Weigh In", icon: "weighIn" },
  { id: "queue", label: "Pending Queue", icon: "queue" },
  { id: "weighOut", label: "Weigh Out", icon: "weighOut" },
  { id: "records", label: "Ticket Records", icon: "records" },
  { id: "suppliers", label: "Customer / Supplier", icon: "supplier" },
  { id: "vehicles", label: "Vehicles", icon: "vehicle" },
  { id: "drivers", label: "Drivers", icon: "driver" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "payroll", label: "AI Payroll", icon: "payroll" },
  { id: "settlement", label: "Settlement", icon: "invoice" },
  { id: "statement", label: "Statement", icon: "records" },
  { id: "future", label: "Future Modules", icon: "rocket" },
];

// ---- MAIN APP ---------------------------------------------------------------
export default function PalmWeighPro() {
  var [txs, setTxs] = useLS("pw4_txs", TX0);
  var [drivers, setDrivers] = useLS("pw4_drivers", DRIVERS0);
  var [vehicles, setVehicles] = useLS("pw4_vehicles", VEHICLES0);
  var [suppliers, setSuppliers] = useLS("pw4_suppliers", SUPPLIERS0);
  var [harvesters, setHarvesters] = useLS("pw4_harvesters", HARVESTERS0);
  var [counters, setCounters] = useLS("pw4_counters", COUNTERS0);
  var [auditLog, setAuditLog] = useLS("pw4_audit", []);
  var [users] = useLS("pw4_users", USERS0);
  var [currentUser, setCurrentUser] = useState(null);
  var [page, setPage] = useState("dashboard");
  var [station, setStation] = useState("s1");
  var [collapsed, setCollapsed] = useState(false);
  var [printTx, setPrintTx] = useState(null);
  var [queueTarget, setQueueTarget] = useState(null);

  var pending = txs.filter(function (t) {
    return t.status === "pending_out" && t.stationId === station;
  }).length;

  function goWeighOut(txId) {
    setQueueTarget(txId);
    setPage("weighOut");
  }

  if (!currentUser) return <Login users={users} onLogin={setCurrentUser} />;

  var staNow = STATIONS.find(function (s) {
    return s.id === station;
  });
  var pageTitle =
    (
      NAV.find(function (n) {
        return n.id === page;
      }) || {}
    ).label || "";

  return (
    <div>
      <style>
        {[
          "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700;900&family=IBM+Plex+Sans:wght@400;600;700;800&display=swap');",
          "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
          "body{background:" +
            T.bg +
            ";font-family:'IBM Plex Sans',sans-serif;color:" +
            T.text +
            ";}",
          "::-webkit-scrollbar{width:5px;height:5px;}",
          "::-webkit-scrollbar-track{background:" + T.bg + ";}",
          "::-webkit-scrollbar-thumb{background:" +
            T.border +
            ";border-radius:3px;}",
          "select option{background:" + T.surface + ";color:" + T.text + ";}",
          "input:focus,select:focus{border-color:" +
            T.accent +
            "!important;outline:none;}",
        ].join("")}
      </style>

      {printTx && (
        <PrintPreview
          tx={printTx}
          onClose={function () {
            setPrintTx(null);
          }}
        />
      )}

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* SIDEBAR */}
        <div
          style={{
            width: collapsed ? 52 : 214,
            background: T.surface,
            borderRight: "1px solid " + T.border,
            display: "flex",
            flexDirection: "column",
            transition: "width .2s",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: collapsed ? "12px 0" : "12px 12px",
              borderBottom: "1px solid " + T.border,
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: collapsed ? "center" : "space-between",
            }}
          >
            {!collapsed && (
              <div>
                <div
                  style={{
                    fontFamily: "IBM Plex Mono,monospace",
                    fontWeight: 900,
                    color: T.accent,
                    fontSize: 13,
                    letterSpacing: -0.5,
                  }}
                >
                  PALMWEIGH
                </div>
                <div style={{ fontSize: 9, color: T.dim, letterSpacing: 1.5 }}>
                  PRO - SABAH
                </div>
              </div>
            )}
            <button
              onClick={function () {
                setCollapsed(function (c) {
                  return !c;
                });
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                lineHeight: 0,
                padding: 0,
              }}
            >
              <Ic
                d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}
                size={16}
                color={T.dim}
              />
            </button>
          </div>

          {!collapsed && (
            <div
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid " + T.border,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: T.dim,
                  marginBottom: 3,
                  letterSpacing: 0.5,
                }}
              >
                ACTIVE STATION
              </div>
              <select
                value={station}
                onChange={function (e) {
                  setStation(e.target.value);
                }}
                style={Object.assign({}, IS, {
                  fontSize: 11,
                  padding: "5px 8px",
                })}
              >
                {STATIONS.map(function (s) {
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.prefix})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          <nav style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
            {NAV.map(function (item) {
              var active = page === item.id;
              var hasBadge =
                (item.id === "weighOut" || item.id === "queue") && pending > 0;
              return (
                <button
                  key={item.id}
                  onClick={function () {
                    setPage(item.id);
                  }}
                  style={{
                    width: "100%",
                    background: active ? T.accent + "18" : "none",
                    borderLeft:
                      "3px solid " + (active ? T.accent : "transparent"),
                    border: "none",
                    borderRight: "none",
                    borderTop: "none",
                    borderBottom: "none",
                    color: active ? T.accent : T.mid,
                    padding: collapsed ? "9px 0" : "8px 11px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: active ? 700 : 400,
                    justifyContent: collapsed ? "center" : "flex-start",
                    fontFamily: "IBM Plex Sans,sans-serif",
                  }}
                >
                  <div style={{ position: "relative", lineHeight: 0 }}>
                    <Ic
                      d={IC[item.icon]}
                      size={15}
                      color={active ? T.accent : T.mid}
                    />
                    {hasBadge && !collapsed && (
                      <div
                        style={{
                          position: "absolute",
                          top: -3,
                          right: -3,
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: T.amber,
                        }}
                      />
                    )}
                  </div>
                  {!collapsed && item.label}
                  {!collapsed && hasBadge && (
                    <Badge label={pending} color={T.amber} />
                  )}
                </button>
              );
            })}
          </nav>

          {!collapsed && (
            <div
              style={{
                padding: "8px 10px",
                borderTop: "1px solid " + T.border,
              }}
            >
              <div style={{ fontSize: 10, color: T.dim, marginBottom: 6 }}>
                {currentUser.name} - {currentUser.role.toUpperCase()}
              </div>
              <button
                onClick={function () {
                  setCurrentUser(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.dim,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: "IBM Plex Sans,sans-serif",
                }}
              >
                <Ic d={IC.logout} size={13} color={T.dim} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 48,
              background: T.surface,
              borderBottom: "1px solid " + T.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 18px",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                {pageTitle}
              </div>
              {staNow && <Badge label={staNow.prefix} color={T.accent} />}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 11,
                color: T.dim,
              }}
            >
              {pending > 0 && (
                <Badge label={pending + " pending"} color={T.amber} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Ic d={IC.wifi} size={12} color={T.accent} />
                <span>Online</span>
              </div>
              <div style={{ fontFamily: "IBM Plex Mono,monospace" }}>
                {new Date().toLocaleTimeString("en-MY", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#0d1829",
              borderBottom: "1px solid " + T.border,
              padding: "8px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Badge label="UAT DEMO" color={T.amber} />
              <span style={{ fontSize: 11, color: T.dim }}>
                PalmWeigh Pro -- UAT Demonstration Version. Data is stored
                locally and can be reset in Settings at any time.
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                color: T.dim,
                fontFamily: "IBM Plex Mono,monospace",
              }}
            >
              For workflow testing and evaluation purposes only.
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
            {page === "dashboard" && <Dashboard txs={txs} station={station} />}
            {page === "weighIn" && (
              <WeighIn
                txs={txs}
                setTxs={setTxs}
                drivers={drivers}
                setDrivers={setDrivers}
                vehicles={vehicles}
                setVehicles={setVehicles}
                suppliers={suppliers}
                setSuppliers={setSuppliers}
                harvesters={harvesters}
                setHarvesters={setHarvesters}
                stationId={station}
                counters={counters}
                setCounters={setCounters}
                stations={STATIONS}
                currentUser={currentUser}
                onGoWeighOut={function () {
                  setPage("weighOut");
                }}
                onGoQueue={function () {
                  setPage("queue");
                }}
              />
            )}
            {page === "queue" && (
              <PendingQueue
                txs={txs}
                setTxs={setTxs}
                stationId={station}
                onWeighOut={goWeighOut}
                suppliers={suppliers}
                vehicles={vehicles}
                drivers={drivers}
                harvesters={harvesters}
                auditLog={auditLog}
                setAuditLog={setAuditLog}
                currentUser={currentUser}
              />
            )}
            {page === "weighOut" && (
              <WeighOut
                txs={txs}
                setTxs={setTxs}
                stationId={station}
                preSelected={queueTarget}
              />
            )}
            {page === "records" && (
              <TicketRecords
                txs={txs}
                setTxs={setTxs}
                stationId={station}
                onPrint={setPrintTx}
                suppliers={suppliers}
                vehicles={vehicles}
                drivers={drivers}
                harvesters={harvesters}
                auditLog={auditLog}
                setAuditLog={setAuditLog}
                currentUser={currentUser}
              />
            )}
            {page === "suppliers" && (
              <SupplierMgmt suppliers={suppliers} setSuppliers={setSuppliers} />
            )}
            {page === "vehicles" && (
              <VehicleMgmt
                vehicles={vehicles}
                setVehicles={setVehicles}
                drivers={drivers}
              />
            )}
            {page === "drivers" && (
              <DriverMgmt drivers={drivers} setDrivers={setDrivers} />
            )}
            {page === "payroll" && <AIPayroll />}
            {page === "settlement" && (
              <ComingSoon
                title="Supplier Settlement"
                desc="Record and manage monthly settlement with registered suppliers. View outstanding balances and generate settlement reports."
              />
            )}
            {page === "statement" && (
              <ComingSoon
                title="Statement of Account"
                desc="Generate and send statements of account to suppliers. View transaction history by supplier and date range."
              />
            )}
            {page === "future" && <FutureModules />}
            {page === "settings" && (
              <AppSettings
                setTxs={setTxs}
                setDrivers={setDrivers}
                setVehicles={setVehicles}
                setSuppliers={setSuppliers}
                setCounters={setCounters}
                setHarvesters={setHarvesters}
                setAuditLog={setAuditLog}
                auditLog={auditLog}
                users={users}
                currentUser={currentUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
