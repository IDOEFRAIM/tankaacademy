export const formatPrice = (price: number, currency: string = "EUR") => {
  if (price === 0) {
    return "Gratuit";
  }

  // Handle FCFA specifically as it often doesn't have decimals and uses XOF/XAF
  if (currency === "XOF" || currency === "XAF") {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(price);
}
