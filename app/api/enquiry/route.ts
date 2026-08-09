const RECIPIENT = "rudranshvillaudaipur@gmail.com";

function value(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

function escapeHtml(input: string) {
  return input.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char] ?? char));
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = value(form, "name");
    const mobile = value(form, "mobile");
    const email = value(form, "email");
    const guests = value(form, "guests");
    const checkIn = value(form, "checkIn");
    const checkOut = value(form, "checkOut");
    const message = value(form, "message");

    if (name.length < 2 || !/^[0-9 +()\-]{10,15}$/.test(mobile) || !checkIn || !checkOut || !guests) {
      return Response.json({ error: "Please complete your name, mobile number, dates, and guest count." }, { status: 400 });
    }
    if (email && (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (checkOut <= checkIn) {
      return Response.json({ error: "Check-out date must be after check-in date." }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "Inquiry service is not configured. Please email the villa team directly." }, { status: 503 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Rudransh Villa <onboarding@resend.dev>",
        to: [RECIPIENT],
        reply_to: email || undefined,
        subject: `Stay inquiry · ${checkIn} · ${name}`,
        html: `<h2>New stay inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Mobile:</strong> ${escapeHtml(mobile)}<br><strong>Email:</strong> ${escapeHtml(email || "Not provided")}<br><strong>Guests:</strong> ${escapeHtml(guests)}<br><strong>Stay:</strong> ${checkIn} to ${checkOut}</p><p><strong>Guest note:</strong><br>${escapeHtml(message || "Not provided").replace(/\n/g, "<br>")}</p>`,
      }),
    });
    if (!response.ok) {
      console.error("Inquiry delivery failed", response.status, await response.text());
      return Response.json({ error: "Your inquiry could not be sent. Please try again." }, { status: 502 });
    }
    return Response.json({ message: "Thank you. The Rudransh Villa team will be in touch shortly." }, { status: 201 });
  } catch (error) {
    console.error("Inquiry submission failed", error);
    return Response.json({ error: "Your inquiry could not be sent. Please try again." }, { status: 500 });
  }
}
