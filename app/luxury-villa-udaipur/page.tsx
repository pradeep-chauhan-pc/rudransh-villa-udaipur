import type { Metadata } from "next";
import StayLandingPage from "../components/StayLandingPage";

export const metadata: Metadata = {
  title: "Luxury Villa in Udaipur",
  description: "Discover Rudransh Villa, a private luxury villa stay in Udaipur with a swimming pool, air-conditioned comfort, Wi-Fi and parking.",
  alternates: { canonical: "/luxury-villa-udaipur" },
};

export default function LuxuryVillaUdaipurPage() {
  return <StayLandingPage
    eyebrow="Private luxury villa stay in Udaipur"
    title="A luxury villa stay, at your own pace."
    description="Rudransh Villa is a private Udaipur homestay for guests who want more privacy, more space, and time that feels entirely their own."
    introduction="This is not a rushed hotel stay. It is a villa made for families and groups to arrive, settle in, and enjoy a quieter rhythm together."
    highlights={[
      { title: "Private villa time", copy: "A stay shaped around your own people, plans and pace." },
      { title: "Poolside afternoons", copy: "A swimming pool for slower hours, open from 7 AM to 7 PM." },
      { title: "Comfort included", copy: "Air-conditioned spaces, Wi-Fi and on-site parking for an easy stay." },
    ]}
    questions={[
      { question: "Is Rudransh Villa suitable for a family stay in Udaipur?", answer: "Yes. The villa is designed for private group and family stays. Send your guest count and dates through the enquiry form so the team can confirm availability." },
      { question: "Does the villa have a swimming pool?", answer: "Yes. Pool access is available between 7 AM and 7 PM. Children must be supervised by a responsible adult." },
      { question: "How can I check availability?", answer: "Use the enquiry form on the Rudransh Villa website with your stay dates, guest count and mobile number. The villa team will respond with availability." },
    ]}
  />;
}
