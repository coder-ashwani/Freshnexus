const GRADES = ["a", "b", "c", "d", "e"] as const;

interface NutriScoreBadgeProps {
  grade?: string;
  size?: "sm" | "lg";
}

export default function NutriScoreBadge({ grade, size = "sm" }: NutriScoreBadgeProps) {
  const g = grade?.toLowerCase();

  if (size === "lg") {
    return (
      <div className="nutriscore-detail" aria-label={`Nutri-Score: ${g?.toUpperCase() ?? "Unknown"}`}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, marginRight: "0.25rem" }}>
          Nutri
        </span>
        <div className="nutriscore-bar" role="img" aria-label={`Nutri-Score ${g?.toUpperCase() ?? "N/A"}`}>
          {GRADES.map((item) => (
            <div
              key={item}
              className={`nutriscore-bar__item nutriscore-bar__item--${item}${
                g === item ? " nutriscore-bar__item--active" : ""
              }`}
              aria-hidden="true"
            >
              {item.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <span
      className={`nutriscore nutriscore--${g && GRADES.includes(g as typeof GRADES[number]) ? g : "unknown"}`}
      title={`Nutri-Score ${g?.toUpperCase() ?? "N/A"}`}
      aria-label={`Nutri-Score ${g?.toUpperCase() ?? "unknown"}`}
    >
      {g?.toUpperCase() ?? "?"}
    </span>
  );
}
