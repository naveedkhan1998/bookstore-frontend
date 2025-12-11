import { useState, useCallback, type ChangeEvent } from "react";

export interface CheckoutFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface UseCheckoutFormReturn {
  formData: CheckoutFormData;
  errors: Partial<CheckoutFormData>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  validateForm: () => boolean;
  resetForm: () => void;
}

const initialFormData: CheckoutFormData = {
  cardNumber: "",
  expiryDate: "",
  cvv: "",
};

export function useCheckoutForm(): UseCheckoutFormReturn {
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number - only digits, max 16
    if (name === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16);
    }

    // Format expiry date - MM/YYYY
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 6)
        .replace(/(\d{2})(\d)/, "$1/$2");
    }

    // Format CVV - only digits, max 4
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<CheckoutFormData> = {};

    // Validate card number - 16 digits
    if (!/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    // Validate expiry date - MM/YYYY format
    if (!/^(0[1-9]|1[0-2])\/\d{4}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YYYY)";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const expiryDate = new Date(parseInt(year), parseInt(month) - 1);
      if (expiryDate < new Date()) {
        newErrors.expiryDate = "This card has expired";
      }
    }

    // Validate CVV - 3 or 4 digits
    if (!/^[0-9]{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    resetForm,
  };
}

export default useCheckoutForm;
