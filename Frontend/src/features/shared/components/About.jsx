
import React from "react";
import {
  ArrowRight,
  Gem,
  Shirt,
  Truck,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Link } from "react-router";

const About = () => {
  const features = [
    {
      icon: Gem,
      title: "Premium Quality",
      description:
        "Carefully selected materials and attention to every detail.",
    },
    {
      icon: Shirt,
      title: "Modern Fashion",
      description:
        "Contemporary styles designed for your everyday lifestyle.",
    },
    {
      icon: Truck,
      title: "Pan-India Delivery",
      description:
        "Your favourite styles delivered right to your doorstep.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Shopping",
      description:
        "A smooth and secure shopping experience every time.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#171717]">

      <div className="mx-auto max-w-[1500px] px-5 py-10 sm:px-10 sm:py-14">

        {/* Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-xs text-[#82776d]">
          <Link to="/" className="hover:text-[#171717]">
            Home
          </Link>
          <ArrowRight size={13} />
          <span className="text-[#171717]">About Us</span>
        </div>

        {/* Hero Section */}
        <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Left Content */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a69a8e]">
              WHO WE ARE
            </p>

            <h1 className="font-syne text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Fashion is
              <br />
              more than
              <br />
              <span className="text-[#a69a8e]">just clothes.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#82776d] sm:text-lg">
              Welcome to SNITCH — a destination for people who
              love expressing themselves through fashion.
              We believe great style is not about following
              everyone else. It is about creating your own identity.
            </p>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#82776d]">
              From everyday essentials to statement pieces,
              we bring together modern designs, quality and
              comfort to help you look and feel your best.
            </p>

            <Link
              to="/"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#171717] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#82776d]"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="absolute -right-3 -top-3 h-full w-full rounded-2xl border border-[#e5ddd3]" />

            <div className="relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl bg-[#eae5de] p-8 sm:min-h-[520px] sm:p-12">

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.3em] text-[#82776d]">
                  SNITCH
                </span>
                <span className="text-xs text-[#82776d]">
                  EST. FOR THE BOLD
                </span>
              </div>

              <div className="py-12 text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-[#82776d]">
                  OWN YOUR STYLE
                </p>

                <h2 className="mt-5 text-6xl font-black tracking-tighter text-[#171717] sm:text-8xl">
                  SNITCH
                </h2>

                <div className="mx-auto mt-6 h-px w-20 bg-[#a69a8e]" />

                <p className="mt-6 text-sm tracking-[0.2em] text-[#82776d]">
                  WEAR WHAT DEFINES YOU
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#82776d]">
                <span>MODERN FASHION</span>
                <span>NEW GENERATION</span>
              </div>

            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="mt-24 border-y border-[#e5ddd3] py-16 sm:py-20">

          <div className="grid gap-8 md:grid-cols-2 md:gap-16">

            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a69a8e]">
                OUR STORY
              </p>

              <h2 className="font-syne text-4xl font-extrabold leading-tight sm:text-5xl">
                Made for those
                <br />
                who stand out.
              </h2>
            </div>

            <div className="flex flex-col justify-center gap-5 text-sm leading-8 text-[#82776d] sm:text-base">
              <p>
                SNITCH is built around the idea that fashion
                should feel personal. Your clothes are an
                extension of your personality and your confidence.
              </p>

              <p>
                Our goal is to make modern fashion accessible,
                comfortable and exciting. Every style is an
                opportunity to express who you are.
              </p>
            </div>

          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">

          <div className="mb-12 text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a69a8e]">
              THE SNITCH EXPERIENCE
            </p>

            <h2 className="font-syne text-3xl font-extrabold sm:text-4xl">
              Why Shop With Us?
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#82776d]">
              Everything we do is focused on making your
              fashion experience better.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#e5ddd3] bg-[#fbf9f6] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#eee9e2]">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>

                  <h3 className="mb-3 text-base font-bold">
                    {feature.title}
                  </h3>

                  <p className="text-sm leading-7 text-[#82776d]">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-2xl bg-[#eee9e2] px-6 py-14 text-center sm:py-20">

          <Heart
            size={28}
            strokeWidth={1.4}
            className="mx-auto mb-5 text-[#82776d]"
          />

          <h2 className="font-syne text-3xl font-extrabold sm:text-5xl">
            Your Style. Your Rules.
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#82776d]">
            Discover styles that match your personality.
            Find your look and make it yours.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#171717] px-8 py-4 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#82776d]"
          >
            Start Shopping
            <ArrowRight size={16} />
          </Link>

        </section>

      </div>
    </div>
  );
};

export default About;
