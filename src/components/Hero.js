import React from "react";

export default function Hero() {
  return (
    <section className="bg-light py-5 text-center">
      <div className="container">
        <h1 className="fw-bold display-5">Welcome to Carrier Lens</h1>
        <p className="lead mt-3">
          Empowering professionals with smart job insights and career tools.
        </p>

        <a href="/contact" className="btn btn-primary btn-lg mt-3">
          Contact Us
        </a>
      </div>
    </section>
  );
}
