import React from "react";

export default function Contact() {
  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-3">Contact Us</h2>

      <form className="mt-4">
        <div className="mb-3">
          <label className="form-label">Your Name</label>
          <input type="text" className="form-control" placeholder="Enter name" />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" placeholder="Enter email" />
        </div>

        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea className="form-control" rows="4"></textarea>
        </div>

        <button className="btn btn-primary px-4" type="submit">
          Submit
        </button>
      </form>
    </section>
  );
}
