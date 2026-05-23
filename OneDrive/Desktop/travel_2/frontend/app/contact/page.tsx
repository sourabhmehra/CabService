"use client";

import { useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";
import { api } from "@/lib/api";
import { AGENCY } from "@/lib/config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.contact({
        name,
        email: email || undefined,
        phone: phone || undefined,
        subject: subject || undefined,
        message,
      });
      setDone(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Could not send message.");
    } finally {
      setSubmitting(false);
    }
  };

  const wa = AGENCY.whatsapp.replace(/\D/g, "");

  return (
    <>
      <section className="hero-bg text-white py-14">
        <div className="container-px max-w-3xl">
          <span className="pill bg-white/10 text-brand-200 ring-brand-400/30">
            Contact Us
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold mt-3">
            We&apos;re here, 24×7
          </h1>
          <p className="mt-3 text-ink-100/85">
            Call, WhatsApp or send us a message — we usually respond within
            minutes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px grid lg:grid-cols-3 gap-8">
          <div className="space-y-5 lg:col-span-1">
            {[
              {
                icon: <FaPhoneAlt />,
                t: "Phone",
                v: (
                  <>
                    <a href={`tel:${AGENCY.phonePrimary.replace(/\s/g, "")}`}>
                      {AGENCY.phonePrimary}
                    </a>
                    <br />
                    <a href={`tel:${AGENCY.phoneSecondary.replace(/\s/g, "")}`}>
                      {AGENCY.phoneSecondary}
                    </a>
                  </>
                ),
              },
              {
                icon: <FaWhatsapp />,
                t: "WhatsApp",
                v: (
                  <a
                    href={`https://wa.me/${wa}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {AGENCY.whatsapp}
                  </a>
                ),
              },
              {
                icon: <FaEnvelope />,
                t: "Email",
                v: <a href={`mailto:${AGENCY.email}`}>{AGENCY.email}</a>,
              },
              {
                icon: <FaMapMarkerAlt />,
                t: "Office",
                v: AGENCY.address,
              },
              {
                icon: <FaClock />,
                t: "Hours",
                v: AGENCY.hours,
              },
            ].map((c) => (
              <div key={c.t} className="card flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 grid place-items-center text-lg shrink-0">
                  {c.icon}
                </div>
                <div>
                  <div className="font-semibold">{c.t}</div>
                  <div className="text-ink-500 text-sm">{c.v}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 card md:p-8">
            <h2 className="font-display font-bold text-2xl">
              Send us a message
            </h2>
            <p className="text-ink-500 mt-1">
              Fill the form and we&apos;ll get back to you shortly.
            </p>

            {done && (
              <div className="mt-5 flex gap-2 items-center text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <FaCheckCircle /> Thanks! We&apos;ve received your message.
              </div>
            )}
            {error && (
              <div className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Subject</label>
                  <input
                    className="input"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea
                  rows={5}
                  className="input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="btn-primary"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>Send Message</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
