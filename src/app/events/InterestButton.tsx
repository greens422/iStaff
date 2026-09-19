"use client";

import { useState, useTransition } from "react";
import { showInterest } from "../actions";
import { buttonClass } from "../ui";

export function InterestButton({ eventId, applied }: { eventId: string; applied: boolean }) {
  const [message, setMessage] = useState<string>();
  const [pending, start] = useTransition();

  function onClick() {
    start(async () => {
      const result = await showInterest(eventId);
      setMessage(result.ok ? undefined : result.message);
    });
  }

  return (
    <div>
      <button className={buttonClass} disabled={applied || pending} onClick={onClick}>
        {applied ? "Interested" : "I'm interested"}
      </button>
      {message && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {message}
        </p>
      )}
    </div>
  );
}
