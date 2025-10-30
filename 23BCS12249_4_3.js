import React, { useState, useEffect } from "react";

export default function App() {
  const busRoutes = [
    { id: 1, name: "Delhi → Mumbai" },
    { id: 2, name: "Bangalore → Chennai" },
    { id: 3, name: "Pune → Goa" },
  ];

  const TOTAL_SEATS = 12;
  const createSeats = () => {
    const s = {};
    for (let i = 1; i <= TOTAL_SEATS; i++) {
      s[i] = { status: "available", lockExpiry: null };
    }
    return s;
  };

  const [selectedBus, setSelectedBus] = useState(null);
  const [busSeats, setBusSeats] = useState({
    1: createSeats(),
    2: createSeats(),
    3: createSeats(),
  });
  const [message, setMessage] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      clearExpiredLocks();
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  });

  const clearExpiredLocks = () => {
    const updated = { ...busSeats };
    const now = Date.now();
    let changed = false;
    Object.keys(updated).forEach((busId) => {
      const seats = updated[busId];
      Object.keys(seats).forEach((id) => {
        if (seats[id].status === "locked" && seats[id].lockExpiry <= now) {
          seats[id] = { status: "available", lockExpiry: null };
          changed = true;
        }
      });
    });
    if (changed) setBusSeats(updated);
  };

  const lockSeat = (id) => {
    if (!selectedBus) return setMessage("⚠ Please select a bus first.");
    const updated = { ...busSeats };
    const seat = updated[selectedBus][id];
    if (seat.status === "booked") return setMessage(❌ Seat ${id} is already booked.);
    if (seat.status === "locked") return setMessage(⚠ Seat ${id} is already locked.);
    seat.status = "locked";
    seat.lockExpiry = Date.now() + 60000;
    setBusSeats(updated);
    setMessage(🔒 Seat ${id} locked successfully for 1 minute.);
  };

  const confirmSeat = (id) => {
    if (!selectedBus) return setMessage("⚠ Please select a bus first.");
    const updated = { ...busSeats };
    const seat = updated[selectedBus][id];
    if (seat.status === "available") return setMessage(⚠ Seat ${id} must be locked first.);
    if (seat.status === "locked" && seat.lockExpiry > Date.now()) {
      seat.status = "booked";
      seat.lockExpiry = null;
      setBusSeats(updated);
      setMessage(✅ Seat ${id} booked successfully!);
      return;
    }
    seat.status = "available";
    seat.lockExpiry = null;
    setBusSeats(updated);
    setMessage(⌛ Seat ${id} lock expired. Please lock again.);
  };

  const getRemainingTime = (seat) => {
    if (seat.status === "locked" && seat.lockExpiry) {
      const remaining = Math.max(0, Math.floor((seat.lockExpiry - Date.now()) / 1000));
      return remaining > 0 ? ${remaining}s : "Expired";
    }
    return "";
  };

  const seatColors = {
    available: "#b9fbc0",
    locked: "#ffdd57",
    booked: "#ff6b6b",
  };

  const SeatCard = ({ id, seat }) => (
    <div
      style={{
        backgroundColor: seatColors[seat.status],
        borderRadius: "12px",
        padding: "15px 10px",
        textAlign: "center",
        boxShadow: "0 3px 6px rgba(0,0,0,0.15)",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 style={{ margin: "5px 0", color: "#333" }}>Seat {id}</h3>
      <p style={{ fontSize: "13px", fontWeight: "bold", margin: "4px 0" }}>
        {seat.status.toUpperCase()}
      </p>
      {seat.status === "locked" && (
        <p style={{ fontSize: "12px", fontWeight: "600", margin: "0" }}>
          ⏳ {getRemainingTime(seat)}
        </p>
      )}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => lockSeat(id)}
          disabled={seat.status !== "available"}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            margin: "3px",
            cursor: seat.status === "available" ? "pointer" : "not-allowed",
          }}
        >
          Lock
        </button>
        <button
          onClick={() => confirmSeat(id)}
          disabled={seat.status === "available"}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 10px",
            margin: "3px",
            cursor: seat.status === "available" ? "not-allowed" : "pointer",
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );

  const seats = selectedBus ? busSeats[selectedBus] : null;
  const stats = selectedBus
    ? {
        booked: Object.values(seats).filter((s) => s.status === "booked").length,
        locked: Object.values(seats).filter((s) => s.status === "locked").length,
        available: Object.values(seats).filter((s) => s.status === "available").length,
      }
    : { booked: 0, locked: 0, available: 0 };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        margin: 0,
        background: "linear-gradient(135deg, #f8bbd0, #ffe0b2, #c8e6c9)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 12s ease infinite",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>
        {`
        @keyframes gradientShift {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        `}
      </style>

      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          padding: "40px 50px",
          width: "85%",
          maxWidth: "1200px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#222", marginBottom: "10px", fontSize: "2rem" }}>
          🚌 Bus Seat Booking System
        </h1>
        <p style={{ color: "#555", marginBottom: "25px", fontSize: "1rem" }}>
          Select a route, lock your seat, and confirm before it expires!
        </p>

        <div style={{ marginBottom: "25px" }}>
          <select
            value={selectedBus || ""}
            onChange={(e) => setSelectedBus(Number(e.target.value))}
            style={{
              padding: "12px 15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "16px",
              outline: "none",
              width: "250px",
              cursor: "pointer",
            }}
          >
            <option value="">-- Select Bus Route --</option>
            {busRoutes.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.name}
              </option>
            ))}
          </select>
        </div>

        {selectedBus ? (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                marginBottom: "20px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              <span>🟩 Available: {stats.available}</span>
              <span>🟨 Locked: {stats.locked}</span>
              <span>🟥 Booked: {stats.booked}</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "18px",
                justifyContent: "center",
                padding: "0 20px",
              }}
            >
              {Object.keys(seats).map((id) => (
                <SeatCard key={id} id={id} seat={seats[id]} />
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: "#777", fontStyle: "italic", marginTop: "20px" }}>
            Please select a bus route to view seats.
          </p>
        )}

        {message && (
          <div
            style={{
              backgroundColor: "#e7f0ff",
              border: "1px solid #007bff",
              color: "#004085",
              borderRadius: "10px",
              padding: "12px",
              marginTop: "25px",
              fontWeight: "500",
              width: "80%",
              marginInline: "auto",
            }}
          >
            {message}
          </div>
        )}
      </div>

      <footer
        style={{
          marginTop: "25px",
          color: "#555",
          fontSize: "14px",
        }}
      >
        Designed with ❤ using React
      </footer>
    </div>
  );
}
