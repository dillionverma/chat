import { aifn } from "@/lib/aifn";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export const schema = z.object({
  title: z.string(),
  description: z.string(),
  index: z.string().describe("Sets the key to map the data to the axis."),
  data: z
    .array(z.object({}))
    .describe("The source data, in which each entry is a dictionary."),
  categories: z
    .array(z.string())
    .describe(
      "Select the categories from your data. Used to populate the legend and toolip."
    ),
});

const { schema: LineChartSchema } = aifn(
  "render_line_chart",
  "Render a line chart from data",
  schema
);
console.log("schema", JSON.stringify(LineChartSchema, null, 2));

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    stream: true,
    messages,
    functions: [LineChartSchema],
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
