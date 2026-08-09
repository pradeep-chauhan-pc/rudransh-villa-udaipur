import type { Metadata } from "next";
import StayLandingPage from "../components/StayLandingPage";

export const metadata: Metadata = {
  title: "Homestay in Udaipur",
  description: "Rudransh Villa is a private homestay in Udaipur for families and groups seeking space, a swimming pool and an unhurried stay.",
  alternates: { canonical: "/homestay-in-udaipur" },
};

export default function HomestayInUdaipurPage() {
  return <StayLandingPage
    eyebrow="Private homestay in Udaipur"
    title="Feel at home. Stay somewhere special."
    description="Rudransh Villa is a private Udaipur homestay for guests who want the ease of a home with the atmosphere of a considered villa escape."
    introduction="Bring the people who matter, settle in comfortably, and let the stay be simple: room to relax, a pool for the day, and time together in the evening."
    highlights={[
      { title: "For together time", copy: "A private setting for family getaways, reunions and relaxed group stays." },
      { title: "Thoughtful essentials", copy: "Air conditioning, Wi-Fi and on-site parking make the practical parts easy." },
      { title: "Villa, not rush", copy: "An unhurried alternative to a standard hotel stay in Udaipur." },
    ]}
    questions={[
      { question: "What makes this a private homestay?", answer: "Rudransh Villa is designed around the comfort and privacy of your own group rather than a conventional hotel-style stay." },
      { question: "Is email required to make an enquiry?", answer: "No. Your name, mobile number, stay dates and guest count are the required enquiry details. Email is optional." },
      { question: "What is the check-out time?", answer: "The standard check-out time is 10 AM. For any request outside the standard timings, please contact the villa team before your stay." },
    ]}
  />;
}
