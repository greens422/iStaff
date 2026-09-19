"use client";

import { useTransition } from "react";
import { decide } from "../../../actions";
import { buttonClass, outlineButtonClass } from "../../../ui";

export function DecisionButtons({ applicationId, eventId }: { applicationId: string; eventId: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      <button
        className={buttonClass}
        disabled={pending}
        onClick={() => start(() => decide(applicationId, eventId, "approved"))}
      >
        Approve
      </button>
      <button
        className={outlineButtonClass}
        disabled={pending}
        onClick={() => start(() => decide(applicationId, eventId, "rejected"))}
      >
        Reject
      </button>
    </div>
  );
}
