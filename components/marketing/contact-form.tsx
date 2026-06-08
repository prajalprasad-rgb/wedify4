"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { siteConfig } from "@/lib/constants";
import { whatsappLink } from "@/lib/utils";

const leadSchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(8, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  eventType: z.string().min(2, "Select an event type"),
  eventDate: z.string().min(1, "Choose an event date"),
  message: z.string().min(10, "Tell us a little more"),
});

type LeadForm = z.infer<typeof leadSchema>;

export function ContactForm() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadForm>({
    resolver: zodResolver(leadSchema),
    defaultValues: { eventType: "Wedding Website" },
  });

  const onSubmit = async (values: LeadForm) => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSuccess(true);
    reset();
    window.setTimeout(() => {
      window.open(whatsappLink(siteConfig.whatsappMessage), "_blank", "noopener,noreferrer");
    }, 650);
  };

  const inputClass =
    "h-12 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF37]/70";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field error={errors.name?.message}>
          <input className={inputClass} placeholder="Name" {...register("name")} />
        </Field>
        <Field error={errors.phone?.message}>
          <input className={inputClass} placeholder="Phone Number" {...register("phone")} />
        </Field>
      </div>
      <Field error={errors.email?.message}>
        <input className={inputClass} placeholder="Email" type="email" {...register("email")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field error={errors.eventType?.message}>
          <select className={inputClass} {...register("eventType")}>
            {["Wedding Website", "Save The Date", "Engagement", "Reception", "Birthday", "Anniversary", "Baby Shower", "Corporate Event"].map((type) => (
              <option key={type} value={type} className="bg-[#111111]">
                {type}
              </option>
            ))}
          </select>
        </Field>
        <Field error={errors.eventDate?.message}>
          <input className={inputClass} type="date" {...register("eventDate")} />
        </Field>
      </div>
      <Field error={errors.message?.message}>
        <textarea
          className="min-h-32 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#D4AF37]/70"
          placeholder="Message"
          {...register("message")}
        />
      </Field>
      {success && <p className="text-sm text-[#E8C76A]">Thank you. Your enquiry has been saved and WhatsApp will open now.</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#E8C76A] disabled:opacity-60"
      >
        <Send size={17} />
        {isSubmitting ? "Sending" : "Submit & WhatsApp"}
      </button>
    </form>
  );
}

function Field({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <label className="grid gap-2">
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}
