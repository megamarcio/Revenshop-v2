
import { Reservation, ExtraBadge } from "../types/reservationTypes";

export const parseReservationList = (data: any): Reservation[] => {
  const list = Array.isArray(data) ? data : data?.data || [];
  return (list || []).map(item => {
    let customerFirstName = "-";
    let customerLastName = "-";
    
    if (item.customer && typeof item.customer === "object") {
      customerFirstName = item.customer.first_name || "-";
      customerLastName = item.customer.last_name || "-";
    } else if (item.customer_fullname) {
      const nameParts = String(item.customer_fullname).split(" ");
      customerFirstName = nameParts[0] || "-";
      customerLastName = nameParts.slice(1).join(" ") || "-";
    }

    const reservationId = item.reservation_id || item.custom_reservation_number || item.prefixed_id || item.id?.toString() || "-";
    const pickupDate = item.pick_up_date || item.checkin_datetime || item.initial_pick_up_date || "-";
    const returnDate = item.return_date || item.checkout_datetime || item.initial_return_date || "-";

    let plate = "-";
    if (Array.isArray(item.reservation_vehicle_information) && item.reservation_vehicle_information.length > 0) {
      plate = item.reservation_vehicle_information[0]?.plate || "-";
    } else if (item.reservation_vehicle_information && typeof item.reservation_vehicle_information === "object" && item.reservation_vehicle_information.plate) {
      plate = item.reservation_vehicle_information.plate;
    } else if (item.vehicle && typeof item.vehicle === "object") {
      plate = item.vehicle.plate || "-";
    } else if (item.vehicle_plate) {
      plate = item.vehicle_plate;
    }

    let phone_number = "-";
    if (item.customer && typeof item.customer === "object") {
      phone_number = item.customer.phone_number || item.customer.phone || "-";
    } else if (item.phone_number) {
      phone_number = item.phone_number;
    } else if (item.customer_phone) {
      phone_number = item.customer_phone;
    }

    return {
      reservation_id: reservationId,
      customer_first_name: customerFirstName,
      customer_last_name: customerLastName,
      pickup_date: pickupDate,
      return_date: returnDate,
      plate,
      phone_number
    };
  });
};

export function formatDateTime(dateStr: string): {
  date: string;
  time: string;
} {
  if (!dateStr || dateStr === "-") return {
    date: "-",
    time: "-"
  };
  try {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12;
    
    return {
      date: `${day}/${month}`,
      time: `${hours}:${minutes} ${ampm}`
    };
  } catch {
    return {
      date: "-",
      time: "-"
    };
  }
}

export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function getLocationBadge(lastName: string, type: "pickup" | "return"): string | null {
  if (!lastName) return null;
  const lower = lastName.toLowerCase().replace(/\s+/g, " ");
  if (type === "pickup") {
    if (lower.includes("in mco")) return "Mco";
    if (lower.includes("in fort")) return "Fort";
    if (lower.includes("in mia")) return "Mia";
    if (lower.includes("in tampa")) return "Tampa";
  } else if (type === "return") {
    if (lower.includes("out mco")) return "Mco";
    if (lower.includes("out fort")) return "Fort";
    if (lower.includes("out mia")) return "Mia";
    if (lower.includes("out tampa")) return "Tampa";
  }
  return null;
}

export function getExtraItemBadges(lastName: string): ExtraBadge[] {
  if (!lastName) return [];
  const lower = lastName.toLowerCase();
  const badges: ExtraBadge[] = [];

  const excludesStroller = lower.includes("não preciso carrinho") || lower.includes("no stroller");
  const excludesCarSeat = lower.includes("não preciso car seat") || lower.includes("no car seat");

  const includesStroller = lower.includes("carrinho") || lower.includes("stroller");
  const includesCarSeat = lower.includes("cadeirinha") || lower.includes("car seat");

  if (includesStroller && !excludesStroller) {
    badges.push({ text: "Carrinho", type: 'item' });
  }
  if (includesCarSeat && !excludesCarSeat) {
    badges.push({ text: "Cadeirinha", type: 'item' });
  }

  if (lower.includes("sign não")) {
    badges.push({ text: "Sign", type: 'alert' });
  }

  return badges;
}

export function getOrderedReservations(
  reservations: Reservation[],
  type: "pickup" | "return"
): Reservation[] {
  const key = type === "pickup" ? "pickup_date" : "return_date";
  return [...reservations].sort((a: Reservation, b: Reservation) => {
    if (!a[key] && !b[key]) return 0;
    if (!a[key]) return 1;
    if (!b[key]) return -1;
    const dateA = new Date(a[key]).getTime();
    const dateB = new Date(b[key]).getTime();
    return dateA - dateB;
  });
}
