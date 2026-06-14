import { createApp, runStartupTasks } from "../src/index";

const { app } = createApp();

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await runStartupTasks();
    initialized = true;
  }
}

export default async function handler(request: Request): Promise<Response> {
  await ensureInitialized();
  return app.fetch(request);
}
