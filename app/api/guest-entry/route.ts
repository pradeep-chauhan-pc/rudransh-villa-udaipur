const RECIPIENT = "rudranshvillaudaipur@gmail.com";
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type GuestRecord = {
  name: string;
  age: string;
  gender: string;
  idType: string;
  idNumber: string;
};

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function safePart(input: string) {
  return input.normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "guest";
}

function fileExtension(file: File) {
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

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const guestCount = Number(value(form, "guestCount"));
    const mobile = value(form, "mobile");
    const checkIn = value(form, "checkIn");
    const checkOut = value(form, "checkOut");
    const address = value(form, "address");
    const vehicleNumber = value(form, "vehicleNumber");
    const consent = value(form, "consent");

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 6) {
      return Response.json({ error: "Please select between 1 and 6 guests." }, { status: 400 });
    }
    if (!mobile || !checkIn || !checkOut || !address || !consent) {
      return Response.json({ error: "Please complete all required booking details." }, { status: 400 });
    }
    if (!/^[0-9 +()\-]{10,15}$/.test(mobile)) {
      return Response.json({ error: "Please enter a valid mobile number." }, { status: 400 });
    }
    if (address.length < 10) {
      return Response.json({ error: "Please enter the complete permanent address." }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return Response.json({ error: "Check-out date must be after the check-in date." }, { status: 400 });
    }

    const reference = `RV-${checkIn.replaceAll("-", "")}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const records: GuestRecord[] = [];
    const attachments: { filename: string; content: string }[] = [];

    for (let index = 0; index < guestCount; index++) {
      const name = value(form, `guest_${index}_name`);
      const age = value(form, `guest_${index}_age`);
      const gender = value(form, `guest_${index}_gender`);
      const idType = value(form, `guest_${index}_idType`);
      const idNumber = value(form, `guest_${index}_idNumber`);
      const front = form.get(`guest_${index}_front`);
      const back = form.get(`guest_${index}_back`);

      if (name.length < 2 || !age || !gender || !idType || idNumber.length < 4 || !(front instanceof File) || !(back instanceof File)) {
        return Response.json({ error: `Please complete all details for Guest ${index + 1}.` }, { status: 400 });
      }
      const numericAge = Number(age);
      if (!Number.isInteger(numericAge) || numericAge < 0 || numericAge > 120) {
        return Response.json({ error: `Please enter a valid age for Guest ${index + 1}.` }, { status: 400 });
      }
      for (const [side, file] of [["front", front], ["back", back]] as const) {
        if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES || file.size === 0) {
          return Response.json({ error: `Guest ${index + 1} ${side} photo could not be accepted. Please choose a JPG, PNG or WebP image and try again.` }, { status: 400 });
        }
      }

      const guestName = safePart(name);
      const [frontBytes, backBytes] = await Promise.all([front.arrayBuffer(), back.arrayBuffer()]);
      attachments.push(
        { filename: `${index + 1}-${guestName}-front.${fileExtension(front)}`, content: toBase64(frontBytes) },
        { filename: `${index + 1}-${guestName}-back.${fileExtension(back)}`, content: toBase64(backBytes) },
      );
      records.push({ name, age, gender, idType, idNumber });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Email service is not configured. Please contact the villa team." }, { status: 503 });
    }

    const guestRows = records.map((guest, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(guest.name)}</td><td>${escapeHtml(guest.age)}</td><td>${escapeHtml(guest.gender)}</td><td>${escapeHtml(guest.idType)}</td><td>${escapeHtml(guest.idNumber)}</td></tr>`).join("");
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Rudransh Villa <onboarding@resend.dev>",
        to: [RECIPIENT],
        subject: `Guest entry: ${reference} · ${checkIn} · ${records[0].name}`,
        html: `<h2>New guest entry</h2><p><strong>Reference:</strong> ${reference}</p><p><strong>Stay:</strong> ${checkIn} to ${checkOut}<br><strong>Mobile:</strong> ${escapeHtml(mobile)}<br><strong>Address:</strong> ${escapeHtml(address)}<br><strong>Vehicle:</strong> ${escapeHtml(vehicleNumber || "Not provided")}</p><table border="1" cellpadding="7" cellspacing="0"><thead><tr><th>#</th><th>Name</th><th>Age</th><th>Gender</th><th>ID type</th><th>ID number</th></tr></thead><tbody>${guestRows}</tbody></table><p>Front and back ID photos are attached to this email. No guest details or images are stored by the form.</p>`,
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
