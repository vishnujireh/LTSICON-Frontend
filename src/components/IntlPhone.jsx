import { useEffect, useRef } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

// Reusable phone input with an in-field country/dial-code selector.
// onChange receives { number, dialCode, iso2 } whenever the value changes.
export default function IntlPhone({ value = "", onChange, className = "", placeholder = "XXXXX XXXXX", initialCountry = "in" }) {
  const ref = useRef(null);
  const itiRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const iti = intlTelInput(ref.current, {
      initialCountry,
      separateDialCode: true,
      preferredCountries: ["in", "us", "gb", "ae", "sg"],
    });
    itiRef.current = iti;
    if (value) ref.current.value = value;

    const sync = () => {
      const data = iti.getSelectedCountryData();
      onChange?.({ number: ref.current.value, dialCode: data.dialCode || "", iso2: data.iso2 || "" });
    };
    ref.current.addEventListener("input", sync);
    ref.current.addEventListener("countrychange", sync);
    return () => { try { iti.destroy(); } catch { /* noop */ } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <input ref={ref} type="tel" placeholder={placeholder} className={`!pl-[92px] ${className}`} />;
}
