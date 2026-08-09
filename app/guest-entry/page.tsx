"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type Guest = {
  name: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  residencyStatus: "indian" | "foreign";
  address: string;
  idType: string;
  idNumber: string;
  passportNumber: string;
  passportIssuePlace: string;
  passportExpiryDate: string;
  visaOrOciNumber: string;
  visaOrOciType: string;
  visaOrOciExpiryDate: string;
  arrivalInIndiaDate: string;
  arrivalInIndiaPlace: string;
  arrivedFrom: string;
  nextDestination: string;
  front: File | null;
  back: File | null;
};

const blankGuest = (): Guest => ({
  name: "",
  dateOfBirth: "",
  gender: "",
  nationality: "India",
  residencyStatus: "indian",
  address: "",
  idType: "Aadhaar Card",
  idNumber: "",
  passportNumber: "",
  passportIssuePlace: "",
  passportExpiryDate: "",
  visaOrOciNumber: "",
  visaOrOciType: "",
  visaOrOciExpiryDate: "",
  arrivalInIndiaDate: "",
  arrivalInIndiaPlace: "",
  arrivedFrom: "",
  nextDestination: "",
  front: null,
  back: null,
});

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const TARGET_FILE_BYTES = 1.5 * 1024 * 1024;
const TERMS_VERSION = "2026-08-09";

async function optimisePhoto(file: File) {
  if (file.size <= TARGET_FILE_BYTES) return file;

  const bitmap = await createImageBitmap(file);
  const maxDimension = 1800;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This photo could not be processed.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.82;
  let blob: Blob | null = null;
  do {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    quality -= 0.12;
  } while (blob && blob.size > TARGET_FILE_BYTES && quality >= 0.34);

  if (!blob) throw new Error("This photo could not be processed.");
  const name = file.name.replace(/\.[^.]+$/, "") || "guest-id";
  return new File([blob], `${name}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
}

function UploadField({
  guestIndex,
  side,
  file,
  label,
  onChange,
}: {
  guestIndex: number;
  side: "front" | "back";
  file: File | null;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = `guest-${guestIndex}-${side}`;
  return (
    <div>
      <label className="upload" htmlFor={id}>
        <span className="upload-icon" aria-hidden="true">+</span>
        <span>
          <strong>{label ?? (side === "front" ? "Front side" : "Back side")}</strong>
          <small>{file ? file.name : "Tap to take or choose a photo"}</small>
        </span>
      </label>
      <input
        id={id}
        className="sr-only"
        type="file"
        name={`guest_${guestIndex}_${side}`}
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        required
        onChange={onChange}
      />
    </div>
  );
}

export default function Home() {
  const [guestCount, setGuestCount] = useState(0);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const progress = useMemo(() => guestCount ? `${guestCount} ${guestCount === 1 ? "guest" : "guests"}` : "Not selected", [guestCount]);

  function changeGuestCount(next: number) {
    setGuestCount(next);
    setGuests((current) => {
      const updated = [...current];
      while (updated.length < next) updated.push(blankGuest());
      return updated.slice(0, next);
    });
  }

  function updateGuest(index: number, field: keyof Guest, value: string | File | null) {
    setGuests((current) => current.map((guest, i) => (i === index ? { ...guest, [field]: value } : guest)));
  }

  async function handleFile(index: number, side: "front" | "back", event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > MAX_UPLOAD_BYTES) {
      event.target.value = "";
      updateGuest(index, side, null);
      setStatus("error");
      setMessage("This photo is too large. Please choose a photo smaller than 8 MB.");
      return;
    }
    try {
      setStatus("idle");
      setMessage(file && file.size > TARGET_FILE_BYTES ? "Optimising photo…" : "");
      updateGuest(index, side, file ? await optimisePhoto(file) : null);
      setMessage("");
    } catch {
      event.target.value = "";
      updateGuest(index, side, null);
      setStatus("error");
      setMessage("This photo format could not be processed. Please use a JPG, PNG or WebP image.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const checkIn = String(new FormData(form).get("checkIn") ?? "");
    const checkOut = String(new FormData(form).get("checkOut") ?? "");
    if (checkIn && checkOut && checkOut <= checkIn) {
      setStatus("error");
      setMessage("Check-out date must be after the check-in date.");
      form.querySelector<HTMLInputElement>('input[name="checkOut"]')?.focus();
      return;
    }
    setStatus("sending");
    setMessage("");

    const formData = new FormData(form);
    formData.set("guestCount", String(guestCount));
    guests.forEach((guest, index) => {
      formData.set(`guest_${index}_name`, guest.name);
      formData.set(`guest_${index}_dateOfBirth`, guest.dateOfBirth);
      formData.set(`guest_${index}_gender`, guest.gender);
      formData.set(`guest_${index}_nationality`, guest.nationality);
      formData.set(`guest_${index}_residencyStatus`, guest.residencyStatus);
      formData.set(`guest_${index}_address`, guest.address);
      formData.set(`guest_${index}_idType`, guest.idType);
      formData.set(`guest_${index}_idNumber`, guest.idNumber);
      formData.set(`guest_${index}_passportNumber`, guest.passportNumber);
      formData.set(`guest_${index}_passportIssuePlace`, guest.passportIssuePlace);
      formData.set(`guest_${index}_passportExpiryDate`, guest.passportExpiryDate);
      formData.set(`guest_${index}_visaOrOciNumber`, guest.visaOrOciNumber);
      formData.set(`guest_${index}_visaOrOciType`, guest.visaOrOciType);
      formData.set(`guest_${index}_visaOrOciExpiryDate`, guest.visaOrOciExpiryDate);
      formData.set(`guest_${index}_arrivalInIndiaDate`, guest.arrivalInIndiaDate);
      formData.set(`guest_${index}_arrivalInIndiaPlace`, guest.arrivalInIndiaPlace);
      formData.set(`guest_${index}_arrivedFrom`, guest.arrivedFrom);
      formData.set(`guest_${index}_nextDestination`, guest.nextDestination);
      if (guest.front) formData.set(`guest_${index}_front`, guest.front);
      if (guest.back) formData.set(`guest_${index}_back`, guest.back);
    });

    try {
      const response = await fetch("/api/guest-entry", { method: "POST", body: formData });
      const result = (await response.json()) as { message?: string; reference?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We could not submit the form.");
      setStatus("success");
      setMessage(`Details and photos emailed successfully. Reference: ${result.reference}`);
      form.reset();
      setGuestCount(0);
      setGuests([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not submit the form. Please try again.");
    }
  }

  return (
    <main>
      <header className="hero">
        <div className="hero-inner">
          <div className="brand-mark">
            <img src="/rudransh-villa-logo.png" alt="Rudransh Villa" />
          </div>
          <div>
            <p className="eyebrow">Rudransh Villa · Udaipur</p>
            <h1>Guest entry form</h1>
            <p className="hero-copy">Complete the details before check-in. It takes about 3 minutes.</p>
          </div>
          <div className="privacy-note"><span aria-hidden="true">●</span> Secure submission</div>
        </div>
      </header>

      <form onSubmit={submit}>
        {message && <div className={`notice ${status}`} role="status">{message}</div>}

        <section className="card">
          <div className="section-heading">
            <span className="step">01</span>
            <div><h2>Booking details</h2><p>Tell us when you are staying.</p></div>
          </div>
          <div className="field-grid">
            <label className="wide"><span>Primary mobile number</span><input name="mobile" type="tel" inputMode="tel" minLength={10} maxLength={15} pattern="[0-9 +()\-]{10,15}" required placeholder="10-digit mobile number" /></label>
            <label className="wide"><span>Primary email address <em>optional</em></span><input name="email" type="email" autoComplete="email" placeholder="name@example.com" /></label>
            <label><span>Check-in date</span><input name="checkIn" type="date" required /></label>
            <label><span>Check-in time</span><input name="checkInTime" type="time" required /></label>
            <label><span>Check-out date</span><input name="checkOut" type="date" required /></label>
            <label><span>Check-out time</span><input name="checkOutTime" type="time" value="10:00" readOnly aria-readonly="true" /></label>
            <label className="wide"><span>Booking source <em>optional</em></span><select name="bookingReference" defaultValue=""><option value="">Select booking source</option><option>Direct booking</option><option>Airbnb</option><option>Booking.com</option><option>MakeMyTrip</option><option>Goibibo</option><option>Agoda</option><option>Other</option></select></label>
            <label><span>Vehicle number <em>optional</em></span><input name="vehicleNumber" placeholder="e.g. RJ 27 AB 1234" /></label>
            <label><span>Number of guests</span><select value={guestCount || ""} required onChange={(event) => changeGuestCount(Number(event.target.value))}><option value="" disabled>Select number of guests</option>{[1,2,3,4,5,6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
          </div>
        </section>

        <section className="card guests-card">
          <div className="section-heading">
            <span className="step">02</span>
            <div><h2>Guest details</h2><p>Enter the details for every guest exactly as shown on their ID.</p></div>
            <span className="guest-count">{progress}</span>
          </div>

          {guestCount === 0 ? <p className="select-guests-note">Select the number of guests above to open their detail sections.</p> : <div className="guest-list">
            {guests.map((guest, index) => (
              <fieldset className="guest" id={`guest-card-${index}`} key={index}>
                <legend><span>{String(index + 1).padStart(2, "0")}</span> Guest {index + 1}{index === 0 && <small>Primary guest</small>}</legend>
                <div className="field-grid">
                  <label className="wide"><span>Full name as on ID</span><input value={guest.name} onChange={(e) => updateGuest(index, "name", e.target.value)} minLength={2} maxLength={100} required placeholder="Enter full name" /></label>
                  <label><span>Date of birth</span><input value={guest.dateOfBirth} onChange={(e) => updateGuest(index, "dateOfBirth", e.target.value)} type="date" required /></label>
                  <label><span>Gender</span><select value={guest.gender} onChange={(e) => updateGuest(index, "gender", e.target.value)} required><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></label>
                  <label><span>Guest category</span><select value={guest.residencyStatus} onChange={(e) => updateGuest(index, "residencyStatus", e.target.value)} required><option value="indian">Indian citizen</option><option value="foreign">Foreign national / OCI cardholder</option></select></label>
                  <label><span>Nationality</span><input value={guest.nationality} onChange={(e) => updateGuest(index, "nationality", e.target.value)} minLength={2} maxLength={60} required placeholder="e.g. India" /></label>
                  <label className="wide"><span>Permanent residential address</span><textarea value={guest.address} onChange={(e) => updateGuest(index, "address", e.target.value)} minLength={10} maxLength={300} rows={3} required placeholder="House, street, city, state/province, country and postal code" /></label>
                  <label><span>ID type</span><select value={guest.idType} onChange={(e) => updateGuest(index, "idType", e.target.value)}><option>Aadhaar Card</option><option>Driving Licence</option><option>Passport</option><option>Voter ID</option><option>Other Government ID</option></select></label>
                  <label><span>ID number</span><input value={guest.idNumber} onChange={(e) => updateGuest(index, "idNumber", e.target.value)} minLength={4} maxLength={30} required placeholder="Enter ID number" /></label>
                </div>
                {guest.residencyStatus === "foreign" && <div className="field-grid">
                  <p className="wide select-guests-note">Foreign nationals and OCI cardholders must present their original passport and visa/OCI card at check-in. Rudransh Villa must submit the official Form C/III report within 24 hours.</p>
                  <label><span>Passport number</span><input value={guest.passportNumber} onChange={(e) => updateGuest(index, "passportNumber", e.target.value)} minLength={4} maxLength={30} required placeholder="As shown on passport" /></label>
                  <label><span>Passport place of issue</span><input value={guest.passportIssuePlace} onChange={(e) => updateGuest(index, "passportIssuePlace", e.target.value)} minLength={2} maxLength={80} required placeholder="City and country" /></label>
                  <label><span>Passport expiry date</span><input value={guest.passportExpiryDate} onChange={(e) => updateGuest(index, "passportExpiryDate", e.target.value)} type="date" required /></label>
                  <label><span>Visa / OCI number</span><input value={guest.visaOrOciNumber} onChange={(e) => updateGuest(index, "visaOrOciNumber", e.target.value)} minLength={3} maxLength={40} required /></label>
                  <label><span>Visa / OCI type</span><input value={guest.visaOrOciType} onChange={(e) => updateGuest(index, "visaOrOciType", e.target.value)} minLength={2} maxLength={60} required placeholder="e.g. Tourist visa or OCI" /></label>
                  <label><span>Visa / OCI valid until</span><input value={guest.visaOrOciExpiryDate} onChange={(e) => updateGuest(index, "visaOrOciExpiryDate", e.target.value)} type="date" required /></label>
                  <label><span>Date of arrival in India</span><input value={guest.arrivalInIndiaDate} onChange={(e) => updateGuest(index, "arrivalInIndiaDate", e.target.value)} type="date" required /></label>
                  <label><span>Place of arrival in India</span><input value={guest.arrivalInIndiaPlace} onChange={(e) => updateGuest(index, "arrivalInIndiaPlace", e.target.value)} minLength={2} maxLength={80} required placeholder="Airport, land border, or city" /></label>
                  <label><span>Arrived from</span><input value={guest.arrivedFrom} onChange={(e) => updateGuest(index, "arrivedFrom", e.target.value)} minLength={2} maxLength={80} required placeholder="Country or last city" /></label>
                  <label><span>Next destination after stay</span><input value={guest.nextDestination} onChange={(e) => updateGuest(index, "nextDestination", e.target.value)} minLength={2} maxLength={120} required /></label>
                </div>}
                <div className="upload-grid">
                  <UploadField guestIndex={index} side="front" file={guest.front} label={guest.residencyStatus === "foreign" ? "Passport photo page" : undefined} onChange={(e) => handleFile(index, "front", e)} />
                  <UploadField guestIndex={index} side="back" file={guest.back} label={guest.residencyStatus === "foreign" ? "Visa / OCI card" : undefined} onChange={(e) => handleFile(index, "back", e)} />
                </div>
                <p className="upload-help">JPG, PNG or WebP · Large photos are automatically reduced · Details must be readable. Original documents must be checked in person at arrival.</p>
              </fieldset>
            ))}
          </div>}
        </section>

        <section className="card consent-card">
          <div className="section-heading">
            <span className="step">03</span>
            <div><h2>Property rules & declaration</h2><p>Please review and confirm before submitting.</p></div>
          </div>
          <div className="rules" aria-labelledby="rules-title">
            <h3 id="rules-title">Property and pool safety rules</h3>
            <p>These rules apply to every guest and visitor during the homestay.</p>
            <h4>Property rules</h4>
            <ol>
              <li>Only registered guests may stay at the property. Any visitor must be approved by the villa team and provide required identification.</li>
              <li>Respect quiet hours from <strong>10:00 PM to 7:00 AM</strong>; parties, excessive noise, and commercial activity require prior written approval.</li>
              <li>Alcohol is strictly prohibited on the property. Guests must not bring, possess, consume, sell, or supply alcohol anywhere on the premises.</li>
              <li>Illegal activity, weapons, illegal drugs, and hazardous materials are strictly prohibited on the property.</li>
              <li>Guests must take reasonable care of the property and report any loss, damage, or safety issue immediately. The primary guest is responsible for the actual reasonable repair or replacement cost of damage caused by their group, children, or visitors. Charges will be supported by an inspection record and itemised cost details, subject to applicable law.</li>
              <li>Guests are responsible for keeping their own belongings secure. The homestay is not responsible for personal items that remain in the guest’s possession, except where responsibility applies under law or an item has been formally accepted into the homestay’s custody.</li>
              <li>Follow reasonable safety instructions from the villa team. Access to a facility may be stopped where needed for safety, maintenance, or a rule violation.</li>
            </ol>
            <h4>Swimming pool</h4>
            <ol>
              <li>Pool hours are <strong>7:00 AM to 7:00 PM</strong>. Do not use the pool outside these hours.</li>
              <li>Children and minors may use the pool only with the continuous, close supervision of a responsible adult.</li>
              <li>No running, diving, rough play, glass containers, or unsafe behaviour in or around the pool.</li>
              <li>Do not use the pool while under the influence of alcohol, drugs, or medication that affects safe swimming.</li>
              <li>Stop using the pool and inform the villa team immediately if you notice damage, contamination, poor visibility, or another hazard.</li>
            </ol>
            <p className="rules-note">These rules do not remove any legal responsibility that Rudransh Villa may have to maintain a safe property.</p>
          </div>
          <input name="termsVersion" type="hidden" value={TERMS_VERSION} />
          <label><span>Primary guest’s full name</span><input name="declarationName" minLength={2} maxLength={100} required placeholder="Type the full name entered for Guest 1" /></label>
          <label className="checkbox"><input type="checkbox" name="consent" required /><span>I confirm that the information and documents are correct and belong to the listed guests. I authorise Rudransh Villa to use them for check-in, guest safety, and compliance with applicable legal requirements.</span></label>
          <label className="checkbox"><input type="checkbox" name="propertyRulesAcknowledged" required /><span>I have read and agree to the property and pool safety rules above. I will ensure that children in my group are supervised continuously while using the pool.</span></label>
          <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting securely…" : "Submit guest details"}<span aria-hidden="true">→</span></button>
          <p className="submit-note">Details and document images are sent securely to the villa team for verification and retained only as required for operations or applicable law. This form does not replace the official Form C/III submission for foreign guests.</p>
        </section>
      </form>

      <footer><span>Rudransh Villa</span><span>Udaipur, Rajasthan</span></footer>
    </main>
  );
}
