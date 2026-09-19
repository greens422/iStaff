import type { EventRow } from "./types";

const TOPICS: { keywords: string[]; answer: (e: EventRow) => string }[] = [
  { keywords: ["bring", "wear", "need"], answer: (e) => `Bring: ${e.askDetails.whatToBring}` },
  {
    keywords: ["transport", "travel", "parking", "ride", "compensat"],
    answer: (e) => `Transportation: ${e.askDetails.transportationComp}`,
  },
  {
    keywords: ["indoor", "outdoor", "outside", "inside", "weather"],
    answer: (e) => `This is ${e.askDetails.indoorOutdoor}.`,
  },
  {
    keywords: ["contact", "who", "call", "phone", "email", "pick"],
    answer: (e) => `Contact: ${e.askDetails.contactInfo}`,
  },
  { keywords: ["where", "address", "location"], answer: (e) => `Location: ${e.location}` },
];

export const SUGGESTED_QUESTIONS = [
  "What do I need to bring?",
  "Is transportation compensated?",
  "Is it indoor or outdoor?",
  "Who do I contact?",
];

export function answerQuestion(event: EventRow, question: string): string {
  const q = question.toLowerCase();
  const topic = TOPICS.find((t) => t.keywords.some((k) => q.includes(k)));
  return topic
    ? topic.answer(event)
    : "I only have details on what to bring, transportation, indoor or outdoor, the contact and the location. Message the coordinator for anything else.";
}
