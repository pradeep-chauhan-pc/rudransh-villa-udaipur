"use client";

import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type Guest = {
  name: string;
  age: string;
  gender: string;
  idType: string;
  idNumber: string;
  front: File | null;
  back: File | null;
};

const blankGuest = (): Guest => ({
  name: "",
  age: "",
  gender: "",
  idType: "Aadhaar Card",
  idNumber: "",
  front: null,
  back: null,
});

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const TARGET_FILE_BYTES = 1.5 * 1024 * 1024;

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
  onChange,
}: {
  guestIndex: number;
  side: "front" | "back";
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = `guest-${guestIndex}-${side}`;
  return (
    <div>
      <label className="upload" htmlFor={id}>
        <span className="upload-icon" aria-hidden="true">+</span>
        <span>
          <strong>{side === "front" ? "Front side" : "Back side"}</strong>
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
      formData.set(`guest_${index}_age`, guest.age);
      formData.set(`guest_${index}_gender`, guest.gender);
      formData.set(`guest_${index}_idType`, guest.idType);
      formData.set(`guest_${index}_idNumber`, guest.idNumber);
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
            <label><span>Check-in date</span><input name="checkIn" type="date" required /></label>
            <label><span>Check-out date</span><input name="checkOut" type="date" required /></label>
            <label className="wide"><span>Permanent address</span><textarea name="address" required minLength={10} rows={3} placeholder="House, street, city, state and PIN code" /></label>
            <label><span>Vehicle number <em>optional</em></span><input name="vehicleNumber" placeholder="e.g. RJ 27 AB 1234" /></label>
            <label><span>Number of guests</span><select value={guestCount || ""} required onChange={(event) => changeGuestCount(Number(event.target.value))}><option value="" disabled>Select number of guests</option>{[1,2,3,4,5,6].map((count) => <option key={count} value={count}>{count} {count === 1 ? "guest" : "guests"}</option>)}</select></label>
          </div>
        </section>

        <section className="card guests-card">
          <div className="section-heading">
            <span className="step">02</span>
            <div><h2>Guest details</h2><p>Add identity details and both sides of each ID.</p></div>
            <span className="guest-count">{progress}</span>
          </div>

          {guestCount === 0 ? <p className="select-guests-note">Select the number of guests above to open their detail sections.</p> : <div className="guest-list">
            {guests.map((guest, index) => (
              <fieldset className="guest" id={`guest-card-${index}`} key={index}>
                <legend><span>{String(index + 1).padStart(2, "0")}</span> Guest {index + 1}{index === 0 && <small>Primary guest</small>}</legend>
                <div className="field-grid">
                  <label className="wide"><span>Full name as on ID</span><input value={guest.name} onChange={(e) => updateGuest(index, "name", e.target.value)} minLength={2} maxLength={100} required placeholder="Enter full name" /></label>
                  <label><span>Age</span><input value={guest.age} onChange={(e) => updateGuest(index, "age", e.target.value)} type="number" min="0" max="120" required placeholder="Age" /></label>
                  <label><span>Gender</span><select value={guest.gender} onChange={(e) => updateGuest(index, "gender", e.target.value)} required><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select></label>
                  <label><span>ID type</span><select value={guest.idType} onChange={(e) => updateGuest(index, "idType", e.target.value)}><option>Aadhaar Card</option><option>Driving Licence</option><option>Passport</option><option>Voter ID</option><option>Other Government ID</option></select></label>
                  <label><span>ID number</span><input value={guest.idNumber} onChange={(e) => updateGuest(index, "idNumber", e.target.value)} minLength={4} maxLength={30} required placeholder="Enter ID number" /></label>
                </div>
                <div className="upload-grid">
                  <UploadField guestIndex={index} side="front" file={guest.front} onChange={(e) => handleFile(index, "front", e)} />
                  <UploadField guestIndex={index} side="back" file={guest.back} onChange={(e) => handleFile(index, "back", e)} />
                </div>
                <p className="upload-help">JPG, PNG or WebP · Large photos are automatically reduced · Details must be readable</p>
              </fieldset>
            ))}
          </div>}
        </section>

        <section className="card consent-card">
          <div className="section-heading">
            <span className="step">03</span>
            <div><h2>Declaration</h2><p>Please confirm before submitting.</p></div>
          </div>
          <label className="checkbox"><input type="checkbox" name="consent" required /><span>I confirm that the information and identity documents provided are correct. I consent to Rudransh Villa using them only for guest verification, safety and legal compliance.</span></label>
          <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting securely…" : "Submit guest details"}<span aria-hidden="true">→</span></button>
          <p className="submit-note">Details and ID photos are emailed to rudranshvillaudaipur@gmail.com and are not stored by this form.</p>
        </section>
      </form>

      <footer><span>Rudransh Villa</span><span>Udaipur, Rajasthan</span></footer>
    </main>
  );
}
