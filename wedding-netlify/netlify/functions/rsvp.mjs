const RECIPIENT = "vleronsadiku7@gmail.com";
const ALLOWED_ATTENDANCE = new Set([
  "Po, me kënaqësi",
  "Jo, nuk do të mundem",
]);

const jsonResponse = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

async function readForm(request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const parsed = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Invalid RSVP body");
    }
    return new Map(
      Object.entries(parsed).map(([key, value]) => [key, String(value ?? "")]),
    );
  }

  return request.formData();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

const readTextField = (form, name) => {
  const value = form.get(name);
  return typeof value === "string" ? value : "";
};

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Kjo kërkesë nuk lejohet." });
  }

  let form;
  try {
    form = await readForm(request);
  } catch {
    return jsonResponse(400, { error: "Të dhënat e formularit nuk janë të vlefshme." });
  }

  // Silently accept bot submissions without sending email.
  if (readTextField(form, "bot-field").trim()) {
    return jsonResponse(200, { ok: true });
  }

  const firstName = readTextField(form, "firstName").trim();
  const lastName = readTextField(form, "lastName").trim();
  const attendance = readTextField(form, "attendance").trim();
  const wish = readTextField(form, "wish").trim();

  if (
    firstName.length < 1 ||
    firstName.length > 100 ||
    lastName.length < 1 ||
    lastName.length > 100 ||
    !ALLOWED_ATTENDANCE.has(attendance) ||
    wish.length > 1200
  ) {
    return jsonResponse(400, { error: "Ju lutemi kontrolloni të dhënat e RSVP-së." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return jsonResponse(503, {
      error: "Dërgimi i përgjigjeve nuk është konfiguruar ende.",
    });
  }

  const guestName = `${firstName} ${lastName}`;
  const safeName = escapeHtml(guestName);
  const safeAttendance = escapeHtml(attendance);
  const safeWish = escapeHtml(wish).replace(/\r?\n/g, "<br>");
  const safeSubjectName = guestName.replace(/[\r\n\0-\x1f\x7f]/g, " ").slice(0, 201);

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [RECIPIENT],
        subject: `RSVP e re: ${safeSubjectName}`,
        text: [
          `Emri: ${guestName}`,
          `Pjesëmarrja: ${attendance}`,
          wish ? `Urimi: ${wish}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
        html: [
          `<p><strong>Emri:</strong> ${safeName}</p>`,
          `<p><strong>Pjesëmarrja:</strong> ${safeAttendance}</p>`,
          wish ? `<p><strong>Urimi:</strong><br>${safeWish}</p>` : "",
        ]
          .filter(Boolean)
          .join(""),
      }),
    });

    if (!resendResponse.ok) {
      return jsonResponse(502, {
        error: "Përgjigjja nuk u dërgua. Ju lutemi provoni përsëri më vonë.",
      });
    }

    return jsonResponse(200, { ok: true });
  } catch {
    return jsonResponse(502, {
      error: "Përgjigjja nuk u dërgua. Ju lutemi provoni përsëri më vonë.",
    });
  }
}