import { Inngest } from "inngest";

export const inngest = new Inngest({
    id: 'signalist',
    eventKey: process.env.INNGEST_EVENT_KEY,
    ...(process.env.GEMINI_API_KEY && {
        ai: { gemini: { apiKey: process.env.GEMINI_API_KEY } }
    })
});
