export type InquiryStatus = "new" | "contacted" | "in_progress" | "completed" | "archived";

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  budget?: string;
  status: InquiryStatus;
  createdAt: string;
  notes?: string;
}

const STORAGE_KEY = "tweb_agency_inquiries";

export const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: "inq-101",
    name: "Amanpreet Singh (DIMSUM BOX)",
    email: "orders@dimsumbox.in",
    phone: "+91 73411 41451",
    projectType: "Restaurant & Asian Dining",
    message: "We want to expand the DIMSUM BOX online ordering system with multi-outlet kitchen display and WhatsApp delivery notifications.",
    budget: "$4,000 - $8,000",
    status: "new",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    notes: "High priority lead from Morinda outlet. Wants WhatsApp automated order receipt."
  },
  {
    id: "inq-102",
    name: "Sophie Tremblay (Little Umbrella)",
    email: "hello@yourlittleumbrella.com",
    phone: "+1 (778) 452-5831",
    projectType: "Artisanal Cafe & Bakery",
    message: "Looking to add subscription coffee beans checkout and gift cards to our West 10th Ave Vancouver cafe website.",
    budget: "$3,500 - $6,000",
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    notes: "Sent proposal for online bakery catering & gift cards."
  },
  {
    id: "inq-103",
    name: "Gurinder Sandhu (The First Step)",
    email: "contact@thefirststepshoes.com",
    phone: "+91 97800 27090",
    projectType: "Footwear & Retail Store",
    message: "Need a full pan-India e-commerce checkout integration for our handcrafted formal shoes and sneakers collection with Shiprocket API.",
    budget: "$6,000 - $12,000",
    status: "contacted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    notes: "Discussed payment gateway (Razorpay) and shipping partner integration."
  }
];

export function getInquiries(): Inquiry[] {
  if (typeof window === "undefined") {
    return SAMPLE_INQUIRIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INQUIRIES));
      return SAMPLE_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SAMPLE_INQUIRIES;
  } catch (err) {
    console.error("Error reading inquiries from localStorage:", err);
    return SAMPLE_INQUIRIES;
  }
}

export function saveInquiry(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
  phone?: string;
  budget?: string;
}): Inquiry {
  const newInquiry: Inquiry = {
    id: `inq-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim(),
    projectType: data.projectType || "General Web Project",
    message: data.message.trim(),
    phone: data.phone?.trim(),
    budget: data.budget?.trim(),
    status: "new",
    createdAt: new Date().toISOString()
  };

  if (typeof window !== "undefined") {
    try {
      const current = getInquiries();
      const updated = [newInquiry, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tweb_inquiry_updated"));
    } catch (err) {
      console.error("Error saving inquiry to localStorage:", err);
    }
  }

  return newInquiry;
}

export function updateInquiryStatus(id: string, status: InquiryStatus): void {
  if (typeof window === "undefined") return;
  try {
    const current = getInquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("tweb_inquiry_updated"));
  } catch (err) {
    console.error("Error updating inquiry status:", err);
  }
}

export function updateInquiryNotes(id: string, notes: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getInquiries();
    const updated = current.map((item) => (item.id === id ? { ...item, notes } : item));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("tweb_inquiry_updated"));
  } catch (err) {
    console.error("Error updating inquiry notes:", err);
  }
}

export function deleteInquiry(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getInquiries();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("tweb_inquiry_updated"));
  } catch (err) {
    console.error("Error deleting inquiry:", err);
  }
}

export function resetToSampleInquiries(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INQUIRIES));
  window.dispatchEvent(new CustomEvent("tweb_inquiry_updated"));
}

export function clearAllInquiries(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("tweb_inquiry_updated"));
}
