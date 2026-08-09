import type { Metadata } from "next";
import StayLandingPage from "../components/StayLandingPage";

export const metadata: Metadata = {
  title: "Private Pool Villa in Udaipur",
  description: "Plan a private pool villa stay in Udaipur at Rudransh Villa—an unhurried homestay for families and groups.",
  alternates: { canonical: "/private-pool-villa-udaipur" },
};

export default function PrivatePoolVillaUdaipurPage() {
  return <StayLandingPage
    eyebrow="Private pool villa in Udaipur"
    title="Make the pool the only plan."
    description="A private villa stay where the afternoon belongs to the water, the people you came with, and nothing on a timetable."
    introduction="Rudransh Villa gives families and groups a private Udaipur stay with poolside time at the centre of the day and comfortable spaces for everything after."
    highlights={[
      { title: "A slower waterline", copy: "The pool is open daily from 7 AM to 7 PM for registered villa guests." },
      { title: "For your own group", copy: "Private villa time for the people you chose to travel with." },
      { title: "A comfortable return", copy: "Step from poolside hours into air-conditioned comfort, Wi-Fi and a quiet evening." },
    ]}
    questions={[
      { question: "What are the pool timings?", answer: "The pool is open from 7 AM to 7 PM. Children must always be accompanied and supervised by a responsible adult." },
      { question: "Can I enquire for a group stay?", answer: "Yes. Share your dates and number of guests through the enquiry form, and the villa team will confirm availability." },
      { question: "Is the pool use private?", answer: "Rudransh Villa is offered as a private villa stay. Confirm the exact stay arrangement and availability with the villa team before booking." },
    ]}
  />;
}
