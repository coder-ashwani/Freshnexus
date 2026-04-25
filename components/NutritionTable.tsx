import type { Nutriments } from "@/types";

const ROWS: { key: keyof Nutriments; label: string; unit: string }[] = [
  { key: "energy_kcal_100g", label: "Energy", unit: "kcal" },
  { key: "fat_100g", label: "Fat", unit: "g" },
  { key: "saturated_fat_100g", label: "  of which saturates", unit: "g" },
  { key: "carbohydrates_100g", label: "Carbohydrates", unit: "g" },
  { key: "sugars_100g", label: "  of which sugars", unit: "g" },
  { key: "fiber_100g", label: "Fibre", unit: "g" },
  { key: "proteins_100g", label: "Protein", unit: "g" },
  { key: "salt_100g", label: "Salt", unit: "g" },
];

export default function NutritionTable({ nutriments }: { nutriments?: Nutriments }) {
  if (!nutriments) {
    return <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Nutrition data not available.</p>;
  }

  const hasAny = ROWS.some(({ key }) => nutriments[key] != null);
  if (!hasAny) {
    return <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Nutrition data not available.</p>;
  }

  return (
    <table className="nutrition-table" aria-label="Nutritional values per 100g">
      <thead>
        <tr>
          <th scope="col">Nutrient</th>
          <th scope="col">Per 100g</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map(({ key, label, unit }) => {
          const val = nutriments[key];
          if (val == null) return null;
          return (
            <tr key={key}>
              <td style={{ color: "var(--text-secondary)" }}>{label}</td>
              <td>
                {Number(val).toFixed(1)} {unit}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
