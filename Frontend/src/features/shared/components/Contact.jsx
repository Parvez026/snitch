
import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  MessageCircle,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, subject, message } = formData;

    const mailtoLink = `mailto:support@snitch.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    window.location.href = mailtoLink;
  };

  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      value: "support@snitch.com",
      description: "For general enquiries and support.",
      link: "mailto:support@snitch.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 XXXXX XXXXX",
      description: "We're happy to help with your queries.",
      link: "tel:+91XXXXXXXXXX",
    },
    {
      icon: Clock,
      title: "Working Hours",
      value: "Mon – Sat",
      description: "10:00 AM – 6:00 PM",
      link: null,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#302820]">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-5 pt-7 sm:px-8 lg:px-12">
        <p className="text-xs text-[#8A765F]">
          <Link to="/" className="transition hover:text-[#302820]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#302820]">Contact Us</span>
        </p>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 sm:px-8 md:pb-20 md:pt-20 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#927B5F]">
              Get In Touch
            </p>

            <h1 className="max-w-xl font-serif text-5xl leading-[1.12] sm:text-6xl lg:text-7xl">
              Let's start a{" "}
              <span className="italic text-[#927B5F]">conversation.</span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-8 text-[#756B60] sm:text-base">
              Have a question about your order, our products, or simply
              want to say hello? We're here to help. Reach out to us
              and we'll get back to you.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#49372F] transition hover:text-[#927B5F]"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Contact Visual */}
          <div className="relative overflow-hidden bg-[#EAE2D6] px-8 py-14 sm:px-12 sm:py-16">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#D4C4AF]" />
            <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full border border-[#D4C4AF]" />

            <div className="relative z-10">
              <p className="text-[10px] tracking-[0.35em] text-[#927B5F]">
                SNITCH CUSTOMER CARE
              </p>

              <h2 className="mt-8 font-serif text-4xl leading-tight sm:text-5xl">
                We're just a message away.
              </h2>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#756B60]">
                Great style deserves great service. Let us make your
                shopping experience better.
              </p>

              <div className="mt-12 border-t border-[#D4C4AF] pt-6">
                <p className="font-serif text-3xl tracking-[0.15em]">
                  SNITCH
                </p>
                <p className="mt-2 text-[9px] tracking-[0.3em] text-[#927B5F]">
                  EST. FOR THE BOLD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="border-y border-[#E7E0D6] bg-[#F1EDE5]">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-12">
          <div className="grid gap-4 md:grid-cols-3">

            {contactDetails.map((item, index) => {
              const Icon = item.icon;

              const content = (
                <div className="flex h-full gap-5 border border-[#E5DDD1] bg-[#FAF9F6] p-6 transition duration-300 hover:border-[#C9B69B] hover:shadow-sm sm:p-7">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#EFE8DD] text-[#806A52]">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>

                  <div>
                    <h3 className="font-serif text-xl">{item.title}</h3>
                    <p className="mt-2 text-sm font-medium text-[#49372F]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[#82776B]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );

              return item.link ? (
                <a
                  href={item.link}
                  key={index}
                  className="block"
                >
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}

          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto grid max-w-[1400px] gap-14 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-12">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#927B5F]">
            Contact Us
          </p>

          <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
            We'd love to hear from you.
          </h2>

          <p className="mt-6 text-sm leading-8 text-[#756B60]">
            Whether you need help with an order, have a product question,
            or want to share feedback, send us a message.
          </p>

          <div className="mt-10 space-y-5">
            <a
              href="mailto:support@snitch.com"
              className="flex items-center gap-3 text-sm text-[#49372F] transition hover:text-[#927B5F]"
            >
              <Mail size={18} />
              support@snitch.com
            </a>

            <div className="flex items-center gap-3 text-sm text-[#49372F]">
              <MapPin size={18} />
              India
            </div>
          </div>

          <div className="mt-12 flex gap-3">
           <a
           href="https://www.instagram.com/your_username/"
           target="_blank"
           rel="noreferrer"
           aria-label="Instagram"
           className="flex h-11 w-11 items-center justify-center border border-[#D8CDBE] text-[#665143] transition hover:bg-[#49372F] hover:text-white"
            >
             <FaInstagram size={18} />
             </a>

            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-11 w-11 items-center justify-center border border-[#D8CDBE] text-[#665143] transition hover:bg-[#49372F] hover:text-white"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#E7E0D6] bg-[#FBFAF7] p-6 sm:p-9 md:p-10"
        >
          <h3 className="font-serif text-2xl sm:text-3xl">
            Send us a message
          </h3>

          <p className="mt-2 text-xs text-[#82776B]">
            Fill in the details below and we'll be happy to help.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-xs font-medium text-[#49372F]">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                className="w-full border border-[#E4DDD2] bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-[#AAA095] focus:border-[#927B5F]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-[#49372F]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-[#E4DDD2] bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-[#AAA095] focus:border-[#927B5F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-medium text-[#49372F]">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
                className="w-full border border-[#E4DDD2] bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-[#AAA095] focus:border-[#927B5F]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs font-medium text-[#49372F]">
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={5}
                required
                className="w-full resize-none border border-[#E4DDD2] bg-transparent px-4 py-3 text-sm outline-none transition placeholder:text-[#AAA095] focus:border-[#927B5F]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 inline-flex w-full items-center justify-center gap-3 bg-[#49372F] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#665143] sm:w-auto"
          >
            Send Message
            <Send size={15} />
          </button>
        </form>
      </section>

    </main>
  );
};

export default Contact;
