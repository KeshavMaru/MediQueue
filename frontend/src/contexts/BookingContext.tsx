import { createContext, useContext, useState } from "react";

const BookingContext = createContext<any>(null);

export const BookingProvider = ({ children }: { children: any }) => {
  const [latestBookingId, setLatestBookingId] = useState<string | null>(null);

  return (
    <BookingContext.Provider
      value={{
        latestBookingId,
        setLatestBookingId,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
