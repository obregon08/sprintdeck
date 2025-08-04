import { useForm } from "react-hook-form";
import { useState } from "react";
import type { ContactFormData } from "@/types";

export function useContactForm() {
  const [showSuccess, setShowSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    // TODO: Simulate form submission delay. In a real app, you'd send the data to the backend.
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowSuccess(true);
    reset();
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    showSuccess,
  };
} 