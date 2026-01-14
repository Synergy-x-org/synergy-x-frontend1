export type ReservationRedirect = {
  flow: "quote_to_reservation";
  redirectTo: string; // "/online-reservation"
};

const KEY = "authRedirect";

export const setReservationRedirect = (redirectTo: string) => {
  const payload: ReservationRedirect = {
    flow: "quote_to_reservation",
    redirectTo,
  };
  sessionStorage.setItem(KEY, JSON.stringify(payload));
};

export const getReservationRedirect = (): ReservationRedirect | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ReservationRedirect) : null;
  } catch {
    return null;
  }
};

export const clearReservationRedirect = () => {
  sessionStorage.removeItem(KEY);
};
