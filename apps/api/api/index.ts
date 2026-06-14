import type { IncomingMessage, ServerResponse } from "node:http";
import { createApp, runStartupTasks } from "../src/index";

const { app } = createApp();

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await runStartupTasks();
    initialized = true;
  }
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await ensureInitialized();

  const url = `https://${req.headers.host ?? "localhost"}${req.url ?? "/"}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      const v = Array.isArray(value) ? value.join(", ") : value;
      headers.set(key, v);
    }
  }

  const body =
    req.method !== "GET" && req.method !== "HEAD"
      ? await new Promise<Buffer>((resolve) => {
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => resolve(Buffer.concat(chunks)));
        })
      : undefined;

  const request = new Request(url, {
    method: req.method ?? "GET",
    headers,
    body: body && body.length > 0 ? body : undefined,
  });

  const response = await app.fetch(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const responseBody = await response.arrayBuffer();
  res.end(Buffer.from(responseBody));
}
