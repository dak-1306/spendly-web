import { systemPrompt } from "./system.prompt.js";

export const buildPrompt = (userPrompt) => {
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
};
