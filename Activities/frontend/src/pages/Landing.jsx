import React from "react";
import Header from "../components/Header.jsx";
import Hero from "../components/Hero.jsx";
import MainContent from "../components/MainContent.jsx";
import Footer from "../components/Footer.jsx";

export default function Landing() {
  return (
    <div>
      <Header />
      <Hero
        title="Welcome to My App"
        description="Your one-stop destination for managing your inventory efficiently."
        buttonText="Get Started"
      />
      <MainContent />
      <Footer />
    </div>
  );
}
