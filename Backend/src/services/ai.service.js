import Groq from "groq-sdk";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import puppeteer from "puppeteer";

const ai = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Technical questions that can be asked in the interview along with their intention and how to answer them",
    ),
  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The technical question can be asked in the interview"),
        intention: z
          .string()
          .describe("The intention of interviewer behind asking this question"),
        answer: z
          .string()
          .describe(
            "How to answer this question, what points to cover, what approach to take etc.",
          ),
      }),
    )
    .describe(
      "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
    ),
  skillGaps: z
    .array(
      z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z
          .enum(["low", "medium", "high"])
          .describe("The severity of this skill gap"),
      }),
    )
    .describe("List of skill gaps in the candidate's profile"),
  preparationPlan: z
    .array(
      z.object({
        day: z.number().describe("The day number in the preparation plan"),
        focus: z.string().describe("The main focus of this day"),
        tasks: z.array(z.string()).describe("Tasks for this day"),
      }),
    )
    .describe("Preparation plan"),
  title: z.string().describe("The title of the job"),
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Return ONLY valid JSON matching this schema:

${JSON.stringify(zodToJsonSchema(interviewReportSchema))}

Generate an interview report for the candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let text = response.choices[0].message.content;

  // extract JSON safely
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No valid JSON found in AI response");
  }

  const json = JSON.parse(match[0]);

  return json;
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
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

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = z.object({
    html: z.string().describe("HTML content of the resume"),
  });

  const prompt = `
Return ONLY valid JSON matching this schema:

${JSON.stringify(zodToJsonSchema(resumePdfSchema))}

Generate resume for the candidate.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

The resume should be professional, ATS friendly and 1-2 pages when converted to PDF.
`;

  const response = await ai.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let text = response.choices[0].message.content;

  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No valid JSON found in AI response");
  }

  const jsonContent = JSON.parse(match[0]);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

export { generateInterviewReport, generateResumePdf };
