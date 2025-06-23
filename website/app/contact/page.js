"use client";

import { useState } from "react";
import ReveloLayout from "@/layout/ReveloLayout";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  subject: yup.string().required("Subject is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const HeaderSection = styled.div`
  background: white;
  border-bottom: 1px solid #fed7aa;
  padding: 40px 0;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 16px;
    color: #64748b;
    margin: 0;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ContactForm = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #fed7aa;
  padding: 32px;
  height: fit-content;

  .form-header {
    margin-bottom: 24px;

    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    p {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const InputWrapper = styled.div`
  position: relative;

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #f8853d;
    font-size: 16px;
    pointer-events: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: ${(props) => (props.hasIcon ? "44px" : "16px")};
  border: 1px solid #fed7aa;
  border-radius: 8px;
  font-size: 14px;
  background: #fef7f0;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f8853d;
    background: white;
    box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  padding-left: ${(props) => (props.hasIcon ? "44px" : "16px")};
  border: 1px solid #fed7aa;
  border-radius: 8px;
  font-size: 14px;
  background: #fef7f0;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #f8853d;
    background: white;
    box-shadow: 0 0 0 3px rgba(248, 133, 61, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;

  i {
    font-size: 12px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
  color: white;
  border: none;
  padding: 14px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #e67428 0%, #d65e1f 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(248, 133, 61, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ContactInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ContactCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #f8853d;
    box-shadow: 0 4px 12px rgba(248, 133, 61, 0.15);
  }

  .icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #f8853d 0%, #e67428 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;

    i {
      font-size: 20px;
      color: white;
    }
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #64748b;
    margin-bottom: 6px;

    &:last-child {
      margin-bottom: 0;
    }

    i {
      color: #f8853d;
      font-size: 13px;
      width: 14px;
    }

    a {
      color: #f8853d;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        color: #e67428;
        text-decoration: underline;
      }
    }
  }
`;

const MapSection = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  overflow: hidden;
  height: 300px;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const BusinessHours = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #f8853d;
    }
  }

  .hours-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .hours-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #64748b;

      .day {
        font-weight: 500;
        color: #374151;
      }

      .time {
        font-weight: 500;

        &.open {
          color: #10b981;
        }

        &.closed {
          color: #ef4444;
        }
      }
    }
  }
`;

const SupportOptions = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #fed7aa;
  padding: 24px;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #f8853d;
    }
  }

  .support-list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .support-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #fed7aa;
      border-radius: 8px;
      text-decoration: none;
      color: #374151;
      transition: all 0.2s ease;

      &:hover {
        background: #fef7f0;
        border-color: #f8853d;
        text-decoration: none;
        color: #374151;
      }

      .support-icon {
        width: 32px;
        height: 32px;
        background: #fef7f0;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          font-size: 14px;
          color: #f8853d;
        }
      }

      .support-content {
        .support-title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .support-desc {
          font-size: 12px;
          color: #64748b;
        }
      }
    }
  }
`;

const Page = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Contact form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReveloLayout>
      <PlatformContainer>
        <HeaderSection>
          <HeaderContent>
            <h1>Contact Us</h1>
            <p>
              Get in touch with our team for any questions about bookings,
              travel plans, or general inquiries. We're here to help make your
              travel dreams come true.
            </p>
          </HeaderContent>
        </HeaderSection>

        <MainContent>
          <ContactForm>
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <InputWrapper>
                    <i className="fal fa-user input-icon" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      hasIcon
                      className={errors.name ? "error" : ""}
                      {...register("name")}
                    />
                  </InputWrapper>
                  {errors.name && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {errors.name.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email Address</Label>
                  <InputWrapper>
                    <i className="fal fa-envelope input-icon" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      hasIcon
                      className={errors.email ? "error" : ""}
                      {...register("email")}
                    />
                  </InputWrapper>
                  {errors.email && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {errors.email.message}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <InputWrapper>
                    <i className="fal fa-phone input-icon" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      hasIcon
                      className={errors.phone ? "error" : ""}
                      {...register("phone")}
                    />
                  </InputWrapper>
                  {errors.phone && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {errors.phone.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="subject">Subject</Label>
                  <InputWrapper>
                    <i className="fal fa-tag input-icon" />
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is this about?"
                      hasIcon
                      className={errors.subject ? "error" : ""}
                      {...register("subject")}
                    />
                  </InputWrapper>
                  {errors.subject && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {errors.subject.message}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="message">Message</Label>
                <InputWrapper>
                  <i
                    className="fal fa-comment-alt input-icon"
                    style={{ top: "20px" }}
                  />
                  <TextArea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    hasIcon
                    className={errors.message ? "error" : ""}
                    {...register("message")}
                  />
                </InputWrapper>
                {errors.message && (
                  <ErrorMessage>
                    <i className="fal fa-exclamation-circle" />
                    {errors.message.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading && <div className="spinner" />}
                {loading ? "Sending..." : "Send Message"}
                {!loading && <i className="fal fa-paper-plane" />}
              </SubmitButton>
            </Form>
          </ContactForm>

          <ContactInfoSection>
            <ContactCard>
              <div className="icon">
                <i className="fas fa-envelope" />
              </div>
              <div className="title">Email Support</div>
              <div className="contact-item">
                <i className="fal fa-envelope" />
                <a href="mailto:go@royaldusk.com">go@royaldusk.com</a>
              </div>
              <div className="contact-item">
                <i className="fal fa-clock" />
                <span>Response within 24 hours</span>
              </div>
            </ContactCard>

            <ContactCard>
              <div className="icon">
                <i className="fas fa-phone" />
              </div>
              <div className="title">Phone Support</div>
              <div className="contact-item">
                <i className="fal fa-phone" />
                <a href="tel:+919876349140">+91 98763-49140</a>
              </div>
              <div className="contact-item">
                <i className="fal fa-clock" />
                <span>Mon-Fri, 9 AM - 6 PM GST</span>
              </div>
            </ContactCard>

            <ContactCard>
              <div className="icon">
                <i className="fas fa-map-marker-alt" />
              </div>
              <div className="title">Office Location</div>
              <div className="contact-item">
                <i className="fal fa-map-marker-alt" />
                <span>IFZA Business Park, Dubai, UAE</span>
              </div>
              <div className="contact-item">
                <i className="fal fa-building" />
                <span>DDP, 56942 - 001, A1</span>
              </div>
            </ContactCard>

            <BusinessHours>
              <div className="title">
                <i className="fal fa-clock" />
                Business Hours
              </div>
              <div className="hours-list">
                <div className="hours-item">
                  <span className="day">Monday - Friday</span>
                  <span className="time open">9:00 AM - 6:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Saturday</span>
                  <span className="time open">10:00 AM - 4:00 PM</span>
                </div>
                <div className="hours-item">
                  <span className="day">Sunday</span>
                  <span className="time closed">Closed</span>
                </div>
              </div>
            </BusinessHours>

            <SupportOptions>
              <div className="title">
                <i className="fal fa-question-circle" />
                Quick Help
              </div>
              <div className="support-list">
                <a href="/booking-lookup" className="support-item">
                  <div className="support-icon">
                    <i className="fal fa-search" />
                  </div>
                  <div className="support-content">
                    <div className="support-title">Booking Lookup</div>
                    <div className="support-desc">
                      Find your existing booking
                    </div>
                  </div>
                </a>
                <a href="/faqs" className="support-item">
                  <div className="support-icon">
                    <i className="fal fa-question" />
                  </div>
                  <div className="support-content">
                    <div className="support-title">FAQs</div>
                    <div className="support-desc">
                      Common questions & answers
                    </div>
                  </div>
                </a>
                <a href="/support" className="support-item">
                  <div className="support-icon">
                    <i className="fal fa-headset" />
                  </div>
                  <div className="support-content">
                    <div className="support-title">Help Center</div>
                    <div className="support-desc">Browse support articles</div>
                  </div>
                </a>
              </div>
            </SupportOptions>

            <MapSection>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1518.8717896147505!2d55.37710464224426!3d25.11856904046068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f6f9f1fbfb607%3A0x4db0a2f5f59532d9!2sIFZA%20Business%20Park!5e0!3m2!1sen!2sin!4v1740376682396!5m2!1sen!2sin"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </MapSection>
          </ContactInfoSection>
        </MainContent>
      </PlatformContainer>
    </ReveloLayout>
  );
};

export default Page;
