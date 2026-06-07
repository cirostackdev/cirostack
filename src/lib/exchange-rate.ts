/**
 * Fetch the USD exchange rate for a given currency at a given date.
 * Tries frankfurter.app first (supports historical rates for major currencies).
 * Falls back to open.er-api.com (supports more currencies incl. NGN, no API key needed).
 */
export async function fetchUsdRate(currency: string, date?: Date): Promise<number> {
  if (currency === "USD") return 1;

  // Try frankfurter.app (historical rates for ~33 major currencies)
  try {
    const dateStr = date ? date.toISOString().split("T")[0] : "latest";
    const res = await fetch(`https://api.frankfurter.app/${dateStr}?from=${currency}&to=USD`);
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.USD) return data.rates.USD;
    }
  } catch {}

  // Fallback: open.er-api.com (broader currency support, current rates only)
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
    if (res.ok) {
      const data = await res.json();
      if (data.rates?.USD) return data.rates.USD;
    }
  } catch {}

  console.error(`[exchange-rate] Could not fetch rate for ${currency}, defaulting to 1`);
  return 1;
}
