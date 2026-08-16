const RECIPIENT = "rudranshvillaudaipur@gmail.com";
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const TERMS_VERSION = "2026-08-09";

type GuestRecord = {
  name: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  foreignDetails?: {
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
  };
};

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function safePart(input: string) {
  return input.normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "guest";
}

function fileExtension(file: File) {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function toBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + 0x8000, bytes.length)));
  }
  return btoa(binary);
}

function escapeHtml(input: string) {
  return input.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] ?? char));
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isTime(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

function normaliseName(value: string) {
  return value.toLocaleLowerCase("en-IN").replace(/\s+/g, " ").trim();
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const guestCount = Number(value(form, "guestCount"));
    const mobile = value(form, "mobile");
    const checkIn = value(form, "checkIn");
    const checkInTime = value(form, "checkInTime");
    const checkOut = value(form, "checkOut");
    const checkOutTime = value(form, "checkOutTime");
    const declarationName = value(form, "declarationName");
    const consent = value(form, "consent");
    const propertyRulesAcknowledged = value(form, "propertyRulesAcknowledged");
    const termsVersion = value(form, "termsVersion");

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 6) {
      return Response.json({ error: "Please select between 1 and 6 guests." }, { status: 400 });
    }
    if (!mobile || !checkIn || !checkInTime || !checkOut || !checkOutTime || !declarationName || !consent || !propertyRulesAcknowledged || termsVersion !== TERMS_VERSION) {
      return Response.json({ error: "Please complete all required booking details." }, { status: 400 });
    }
    if (!/^[0-9 +()\-]{10,15}$/.test(mobile)) {
      return Response.json({ error: "Please enter a valid mobile number." }, { status: 400 });
    }
    if (!isDate(checkIn) || !isDate(checkOut) || !isTime(checkInTime) || !isTime(checkOutTime)) {
      return Response.json({ error: "Please enter valid check-in and check-out dates and times." }, { status: 400 });
    }
    if (checkOutTime !== "10:00") {
      return Response.json({ error: "Check-out time is fixed at 10:00 AM." }, { status: 400 });
    }
    if (checkOut < checkIn || (checkOut === checkIn && checkOutTime <= checkInTime)) {
      return Response.json({ error: "Check-out date must be after the check-in date." }, { status: 400 });
    }

    const reference = `RV-${checkIn.replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const submittedAt = new Date().toISOString();
    const records: GuestRecord[] = [];
    const attachments: { filename: string; content: string }[] = [];

    for (let index = 0; index < guestCount; index++) {
      const name = value(form, `guest_${index}_name`);
      const gender = value(form, `guest_${index}_gender`);
      const nationality = value(form, `guest_${index}_nationality`);
      const residencyStatus = value(form, `guest_${index}_residencyStatus`);
      const idType = value(form, `guest_${index}_idType`);
      const idNumber = value(form, `guest_${index}_idNumber`);
      const front = form.get(`guest_${index}_front`);
      const back = form.get(`guest_${index}_back`);

      if (name.length < 2 || !gender || nationality.length < 2 || !idType || idNumber.length < 4 || !(front instanceof File) || !(back instanceof File)) {
        return Response.json({ error: `Please complete all details for Guest ${index + 1}.` }, { status: 400 });
      }
      if (residencyStatus !== "indian" && residencyStatus !== "foreign") {
        return Response.json({ error: `Please select a valid guest category for Guest ${index + 1}.` }, { status: 400 });
      }
      for (const [side, file] of [["front", front], ["back", back]] as const) {
        if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES || file.size === 0) {
          return Response.json({ error: `Guest ${index + 1} ${side} document could not be accepted. Please choose a JPG, PNG, WebP, or PDF file under 2 MB and try again.` }, { status: 400 });
        }
      }

      let foreignDetails: GuestRecord["foreignDetails"];
      if (residencyStatus === "foreign") {
        const passportNumber = value(form, `guest_${index}_passportNumber`);
        const passportIssuePlace = value(form, `guest_${index}_passportIssuePlace`);
        const passportExpiryDate = value(form, `guest_${index}_passportExpiryDate`);
        const visaOrOciNumber = value(form, `guest_${index}_visaOrOciNumber`);
        const visaOrOciType = value(form, `guest_${index}_visaOrOciType`);
        const visaOrOciExpiryDate = value(form, `guest_${index}_visaOrOciExpiryDate`);
        const arrivalInIndiaDate = value(form, `guest_${index}_arrivalInIndiaDate`);
        const arrivalInIndiaPlace = value(form, `guest_${index}_arrivalInIndiaPlace`);
        const arrivedFrom = value(form, `guest_${index}_arrivedFrom`);
        const nextDestination = value(form, `guest_${index}_nextDestination`);

        if (passportNumber.length < 4 || passportIssuePlace.length < 2 || !isDate(passportExpiryDate) || visaOrOciNumber.length < 3 || visaOrOciType.length < 2 || !isDate(visaOrOciExpiryDate) || !isDate(arrivalInIndiaDate) || arrivalInIndiaPlace.length < 2 || arrivedFrom.length < 2 || nextDestination.length < 2) {
          return Response.json({ error: `Please complete the passport, visa/OCI, and arrival details for Guest ${index + 1}.` }, { status: 400 });
        }
        if (passportExpiryDate < checkIn || visaOrOciExpiryDate < checkIn || arrivalInIndiaDate > checkIn) {
          return Response.json({ error: `Please check the document validity and India arrival date for Guest ${index + 1}.` }, { status: 400 });
        }
        foreignDetails = { passportNumber, passportIssuePlace, passportExpiryDate, visaOrOciNumber, visaOrOciType, visaOrOciExpiryDate, arrivalInIndiaDate, arrivalInIndiaPlace, arrivedFrom, nextDestination };
      }

      const guestName = safePart(name);
      const [frontBytes, backBytes] = await Promise.all([front.arrayBuffer(), back.arrayBuffer()]);
      attachments.push(
        { filename: `${guestName}-${residencyStatus === "foreign" ? "passport" : "front"}.${fileExtension(front)}`, content: toBase64(frontBytes) },
        { filename: `${guestName}-${residencyStatus === "foreign" ? "visa-or-oci" : "back"}.${fileExtension(back)}`, content: toBase64(backBytes) },
      );
      records.push({ name, gender, nationality, idType, idNumber, foreignDetails });
    }

    if (normaliseName(declarationName) !== normaliseName(records[0].name)) {
      return Response.json({ error: "The primary guest acknowledgement must match Guest 1's full name." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Email service is not configured. Please contact the villa team." }, { status: 503 });
    }

    const guestRows = records.map((guest, index) => {
      const immigration = guest.foreignDetails
        ? `Passport: ${escapeHtml(guest.foreignDetails.passportNumber)} (${escapeHtml(guest.foreignDetails.passportIssuePlace)}, expires ${guest.foreignDetails.passportExpiryDate})<br>Visa/OCI: ${escapeHtml(guest.foreignDetails.visaOrOciNumber)} · ${escapeHtml(guest.foreignDetails.visaOrOciType)} (expires ${guest.foreignDetails.visaOrOciExpiryDate})<br>India arrival: ${guest.foreignDetails.arrivalInIndiaDate}, ${escapeHtml(guest.foreignDetails.arrivalInIndiaPlace)} from ${escapeHtml(guest.foreignDetails.arrivedFrom)}<br>Next destination: ${escapeHtml(guest.foreignDetails.nextDestination)}`
        : "Indian citizen";
      return `<tr><td>${index + 1}</td><td>${escapeHtml(guest.name)}</td><td>${escapeHtml(guest.gender)}</td><td>${escapeHtml(guest.nationality)}</td><td>${escapeHtml(guest.idType)}: ${escapeHtml(guest.idNumber)}</td><td>${immigration}</td></tr>`;
    }).join("");
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Rudransh Villa <onboarding@resend.dev>",
        to: [RECIPIENT],
        subject: `Guest entry: ${reference} · ${checkIn} · ${records[0].name}`,
        html: `<h2>New homestay guest entry</h2><p><strong>Reference:</strong> ${reference}</p><p><strong>Stay:</strong> ${checkIn} ${checkInTime} to ${checkOut} ${checkOutTime}<br><strong>Mobile:</strong> ${escapeHtml(mobile)}<br><strong>Primary guest acknowledgement:</strong> ${escapeHtml(declarationName)}<br><strong>Property rules accepted:</strong> Yes<br><strong>Terms version:</strong> ${TERMS_VERSION}<br><strong>Submitted (UTC):</strong> ${submittedAt}</p><table border="1" cellpadding="7" cellspacing="0"><thead><tr><th>#</th><th>Name</th><th>Gender</th><th>Nationality</th><th>ID</th><th>Immigration details</th></tr></thead><tbody>${guestRows}</tbody></table><p>Verify every original document at arrival. For each foreign national or OCI cardholder, submit the official Form C/III to FRRO/FRO within 24 hours; this email is not the government filing.</p>`,
        attachments,
      }),
    });

    if (!emailResponse.ok) {
      console.error("Email delivery failed", emailResponse.status, await emailResponse.text());
      return Response.json({ error: "The email could not be sent. Please try again." }, { status: 502 });
    }

    return Response.json({ message: "Guest entry emailed successfully.", reference }, { status: 201 });
  } catch (error) {
    console.error("Guest entry submission failed", error);
    return Response.json({ error: "We could not submit the form. Please try again or contact the villa team." }, { status: 500 });
  }
}
