"use client";

import { useTransition } from "react";
import { reviewCert } from "../actions";
import { buttonClass, outlineButtonClass } from "../ui";

export function CertButtons({ certId }: { certId: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-2">
      <button className={buttonClass} disabled={pending} onClick={() => start(() => reviewCert(certId, "verified"))}>
        Approve
      </button>
      <button
        className={outlineButtonClass}
        disabled={pending}
        onClick={() => start(() => reviewCert(certId, "rejected"))}
      >
        Reject
      </button>
    </div>
  );
}
