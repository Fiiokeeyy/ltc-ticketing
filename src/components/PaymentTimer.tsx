"use client";

import { useEffect, useState } from "react";

interface PaymentTimerProps {
  expiryTime: string;
}

export default function PaymentTimer({ expiryTime }: PaymentTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiry = new Date(expiryTime);
      const now = new Date();
      const difference = expiry.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("Waktu habis");
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  const isExpiringSoon = () => {
    const expiry = new Date(expiryTime);
    const now = new Date();
    const difference = expiry.getTime() - now.getTime();
    const hoursLeft = difference / (1000 * 60 * 60);
    return hoursLeft <= 1; // Less than 1 hour
  };

  return (
    <p
      className={`font-mono text-2xl font-bold ${
        isExpiringSoon() ? "text-red-600" : "text-orange-500"
      }`}
    >
      {timeLeft}
    </p>
  );
}
