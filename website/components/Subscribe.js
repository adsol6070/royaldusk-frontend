"use client";
import { useState } from "react";
import { newsletterApi } from "@/common/api";
import toast from "react-hot-toast";

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Try again later.");
      console.error("Newsletter Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: "80px 0", background: "#fef7f0" }}>
      <div className="container">
        <div className="row align-items-center">
          {/* Left Section */}
          <div className="col-lg-6">
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "16px",
              }}
            >
              Stay Updated with Latest Offers
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1.1rem",
                marginBottom: "32px",
              }}
            >
              Subscribe to our newsletter and be the first to know about
              exclusive deals, new destinations, and special packages.
            </p>
            <form
              style={{ display: "flex", gap: "12px", maxWidth: "400px" }}
              onSubmit={handleSubscribe}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "2px solid #fed7aa",
                  borderRadius: "8px",
                  fontSize: "14px",
                  background: "white",
                }}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "12px 24px",
                  background: "#f8853d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.3s ease",
                }}
                disabled={loading}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#e67428")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#f8853d")
                }
              >
                {loading ? "Submitting..." : "Subscribe"}
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="col-lg-6 text-center">
            <div
              style={{
                width: "300px",
                height: "300px",
                background: "linear-gradient(135deg, #f8853d, #e67428)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                color: "white",
              }}
            >
              <div>
                <i
                  className="fal fa-envelope"
                  style={{ fontSize: "4rem", marginBottom: "16px" }}
                />
                <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  Join Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
