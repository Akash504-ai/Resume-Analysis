import Groq from "groq-sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

/* ---------------- SCHEMA ---------------- */

const interviewReportSchema = z.object({
  matchScore: z.number(),
  title: z.string(),

  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

/* ---------------- INTERVIEW REPORT ---------------- */

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
  apiKey,
}) {
  const ai = new Groq({ apiKey });

  const prompt = `
You are an expert AI interview coach.

Return ONLY valid JSON.

Rules:
- Do NOT include markdown
- Do NOT include explanations
- ALWAYS include ALL fields
- technicalQuestions: minimum 5
- behavioralQuestions: minimum 5
- preparationPlan: 5 days

JSON Schema:
${JSON.stringify(zodToJsonSchema(interviewReportSchema))}

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const text = response.choices[0].message.content;

  /* ---------- SAFE JSON EXTRACTION ---------- */

  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("AI did not return valid JSON");
  }

  let parsed;

  try {
    parsed = JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON parse error:", err);
    throw new Error("Invalid JSON returned by AI");
  }

  /* ---------- VALIDATE WITH ZOD ---------- */

  const validated = interviewReportSchema.safeParse(parsed);

  if (!validated.success) {
    console.error("Schema validation error:", validated.error);

    return {
      matchScore: parsed.matchScore ?? 0,
      title: parsed.title ?? "",

      technicalQuestions: parsed.technicalQuestions ?? [],
      behavioralQuestions: parsed.behavioralQuestions ?? [],
      skillGaps: parsed.skillGaps ?? [],
      preparationPlan: parsed.preparationPlan ?? [],
    };
  }

  return validated.data;
}

/* ---------------- PDF GENERATION ---------------- */

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

/* ---------------- RESUME PDF ---------------- */

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
  apiKey,
}) {
  const ai = new Groq({ apiKey });

  const resumePdfSchema = z.object({
    html: z.string(),
  });

  const prompt = `
You are a professional resume writer.

Return ONLY valid JSON.

Rules:
- Do NOT include markdown
- Do NOT include explanation
- Only return JSON

Schema:
${JSON.stringify(zodToJsonSchema(resumePdfSchema))}

Generate an ATS-friendly professional resume.

Candidate Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

The resume should fit 1–2 pages when converted to PDF.
`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const text = response.choices[0].message.content;

  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("AI did not return valid JSON");
  }

  const jsonContent = JSON.parse(match[0]);

  const validated = resumePdfSchema.safeParse(jsonContent);

  if (!validated.success) {
    throw new Error("Invalid resume JSON format");
  }

  const pdfBuffer = await generatePdfFromHtml(validated.data.html);

  return pdfBuffer;
}

export { generateInterviewReport, generateResumePdf };