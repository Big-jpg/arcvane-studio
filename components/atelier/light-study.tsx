import type { AtelierStudy, AtelierTreatment } from "@/lib/atelier-story";
import { cn } from "@/lib/utils";

const treatmentText: Record<AtelierTreatment, string> = {
  dawn: "text-deep-brown/65",
  limestone: "text-deep-brown/65",
  study: "text-deep-brown/65",
  workshop: "text-deep-brown/65",
  system: "text-shell/68",
  collection: "text-deep-brown/65",
  interior: "text-deep-brown/65",
  quiet: "text-deep-brown/65",
};

export function LightStudy({
  studies,
  treatment,
}: {
  studies: AtelierStudy[];
  treatment: AtelierTreatment;
}) {
  if (studies.length === 0) return null;

  const isDark = treatment === "system";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {studies.map((study) => (
        <article
          key={`${study.title}-${study.measure ?? ""}`}
          className={cn("border-t pt-5", isDark ? "border-shell/18" : "border-limestone/55")}
        >
          {study.measure && (
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.22em]",
                isDark ? "text-sand" : "text-weathered-post",
              )}
            >
              {study.measure}
            </p>
          )}
          <h3
            className={cn("mt-3 text-base font-semibold", isDark ? "text-shell" : "text-charcoal")}
          >
            {study.title}
          </h3>
          <p className={cn("mt-3 text-sm leading-7", treatmentText[treatment])}>
            {study.description}
          </p>
        </article>
      ))}
    </div>
  );
}
