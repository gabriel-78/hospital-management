import type { Formatter } from "./types";

type CurrencyFormatterOptions = {
  decimalPlaces?: number;
  decimalSeparator?: "," | ".";
  thousandSeparator?: "." | ",";
  currencySymbol?: string;
  symbolPosition?: "before" | "after";
};

export function currencyFormatter(
  options: CurrencyFormatterOptions = {},
): Formatter<string, string | number> {
  const {
    decimalPlaces = 2,
    decimalSeparator = ",",
    thousandSeparator = ".",
    currencySymbol = "R$",
    symbolPosition = "before",
  } = options;

  return {
    format(value: string | number) {
      const adjustedValue = this.parse(value).replace(/[^\d]/g, "");

      if (!adjustedValue) return "";

      const number = parseFloat(
        (parseInt(adjustedValue) / Math.pow(10, decimalPlaces)).toFixed(
          decimalPlaces,
        ),
      );
      if (isNaN(number)) return "";

      const parts = number.toFixed(decimalPlaces).split(".");

      let integerPart = parts[0];
      const decimalPart = parts[1];

      integerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        thousandSeparator,
      );

      const formatted = integerPart + decimalSeparator + decimalPart;

      return symbolPosition === "before"
        ? `${currencySymbol} ${formatted}`
        : `${formatted} ${currencySymbol}`;
    },

    parse(value: string | number) {
      if (typeof value !== "string")
        return typeof value === "number" ? value.toFixed(decimalPlaces) : "";

      const adjustedValue = value.replace(/[^\d]/g, "");

      const number = parseFloat(
        (parseInt(adjustedValue) / Math.pow(10, decimalPlaces)).toFixed(
          decimalPlaces,
        ),
      );
      if (isNaN(number)) return "";

      const parts = number.toFixed(decimalPlaces).split(".");

      const integerPart = parts[0];
      const decimalPart = parts[1];

      const formatted = integerPart + "." + decimalPart;

      return formatted.slice(0, 15);
    },
  };
}
