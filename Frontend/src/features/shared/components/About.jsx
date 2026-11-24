
import React from "react";
import {
  ArrowRight,
  Gem,
  Shirt,
  Truck,
  ShieldCheck,
  Heart,
  MoveRight,
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
        "Contemporary styles designed to match your everyday identity.",
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
        "A smooth and secure shopping experience from start to finish.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#302820]">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1400px] px-5 pt-7 sm:px-8 lg:px-12">
        <p className="text-xs tracking-wide text-[#8A765F]">
          <Link to="/" className="transition hover:text-[#302820]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-[#302820]">About Us</span>
        </p>
      </div>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-12">

        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#927B5F]">
            Who We Are
          </p>

          <h1 className="max-w-xl font-serif text-5xl leading-[1.12] tracking-tight text-[#302820] sm:text-6xl lg:text-7xl">
            Fashion is more than just{" "}
            <span className="italic text-[#927B5F]">clothes.</span>
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-8 text-[#756B60] sm:text-base">
            At SNITCH, we believe style is a way of expressing who you are.
            We bring together modern designs, everyday comfort, and
            effortless confidence to help you define your own identity.
          </p>

          <Link
            to="/shop"
            className="mt-9 inline-flex items-center gap-4 bg-[#49372F] px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#665143]"
          >
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <div className="absolute -right-3 -top-3 h-full w-full border border-[#D8C4A5] sm:-right-5 sm:-top-5" />

          <div className="relative aspect-[4/4.5] overflow-hidden bg-[#E8DDCE]">
            <img
              src="/unplash.jpg"
              alt="SNITCH premium menswear collection"
              className="h-full w-full object-cover object-center transition duration-700 hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#302820]/35 via-transparent to-transparent" />

            <div className="absolute bottom-7 left-7 text-white">
              <p className="text-[10px] tracking-[0.35em]">
                THE SNITCH EXPERIENCE
              </p>
              <h2 className="mt-2 font-serif text-3xl italic">
                Own Your Style.
              </h2>
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden bg-[#F8F6F1] px-6 py-4 shadow-sm sm:block">
            <p className="font-serif text-2xl tracking-widest">SNITCH</p>
            <p className="mt-1 text-[9px] tracking-[0.25em] text-[#927B5F]">
              EST. FOR THE BOLD
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-y border-[#E7E0D6] bg-[#F1EDE5]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-2 lg:gap-20 lg:px-12">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#927B5F]">
              Our Story
            </p>

            <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight sm:text-5xl">
              Designed for those who dare to be different.
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-5 text-sm leading-8 text-[#756B60] sm:text-base">
            <p>
              SNITCH is built around the idea that fashion should feel
              personal. Your clothes are not just something you wear;
              they represent your attitude, personality, and confidence.
            </p>

            <p>
              We focus on bringing modern menswear styles that combine
              comfort, versatility, and individuality. From everyday
              essentials to statement pieces, every look should feel
              uniquely yours.
            </p>

            <p className="font-serif text-xl italic text-[#49372F]">
              Don't follow the style. Define it.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-24 lg:px-12">

        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#927B5F]">
            The SNITCH Difference
          </p>

          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            Why Shop With Us?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#756B60]">
            More than just fashion. An experience designed around your
            comfort, confidence, and individuality.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="group border border-[#E7E0D6] bg-[#FBFAF7] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#C9B69B] hover:shadow-[0_12px_35px_rgba(73,55,47,0.06)]"
              >
                <div className="mb-7 flex h-11 w-11 items-center justify-center bg-[#EFE8DD] text-[#806A52] transition duration-300 group-hover:bg-[#49372F] group-hover:text-white">
                  <Icon size={20} strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-xl text-[#49372F]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#82776B]">
                  {feature.description}
                </p>

                <div className="mt-6 h-px w-8 bg-[#C9B69B] transition-all duration-300 group-hover:w-14" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-20 sm:px-8 md:pb-24 lg:px-12">
        <div className="relative mx-auto max-w-[1400px] overflow-hidden bg-[#EAE2D6] px-6 py-16 text-center sm:px-12 md:py-20">

          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-[#D4C4AF]" />
          <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-[#D4C4AF]" />

          <Heart
            size={25}
            strokeWidth={1.3}
            className="mx-auto text-[#927B5F]"
          />

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#927B5F]">
            Make It Yours
          </p>

          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
            Your Style. Your Rules.
          </h2>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#756B60]">
            Discover pieces that speak your language. Find your look
            and make every outfit count.
          </p>

          <Link
            to="/shop"
            className="relative mt-8 inline-flex items-center gap-4 bg-[#49372F] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-[#665143]"
          >
            Start Shopping
            <MoveRight size={16} />
          </Link>
        </div>
      </section>

    </main>
  );
};

export default About;
