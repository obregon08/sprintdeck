"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle, AlertIcon } from "@/components/ui/alert";
import { useContactForm } from "@/hooks";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    showSuccess,
  } = useContactForm();

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Send us a message
      </h3>
      
      {showSuccess && (
        <Alert variant="success" className="mb-6">
          <AlertIcon.success className="h-4 w-4" />
          <AlertTitle>Message sent successfully!</AlertTitle>
          <AlertDescription>
            Thank you for your message. We&apos;ll get back to you as soon as possible.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Name cannot exceed 50 characters",
              },
            })}
            placeholder="Your name"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            })}
            placeholder="your@email.com"
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
              maxLength: {
                value: 1000,
                message: "Message cannot exceed 1000 characters",
              },
            })}
            placeholder="How can we help you?"
            rows={4}
            className={errors.message ? "border-destructive" : ""}
          />
          {errors.message && (
            <p className="text-sm text-destructive">{errors.message.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
} 