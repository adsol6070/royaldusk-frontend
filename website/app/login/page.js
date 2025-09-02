"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { useAuth } from "@/common/context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import ReveloLayout from "@/layout/ReveloLayout";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import AppleLoginButton from "@/components/AppleSiginButton";

// Validation schemas
const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 30px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;

  .logo {
    margin-bottom: 24px;

    img {
      height: 48px;
      width: auto;
    }
  }

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  .step {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;

    &.active {
      background: #667eea;
      color: white;
    }

    &.completed {
      background: #10b981;
      color: white;
    }

    &.inactive {
      background: #f1f5f9;
      color: #94a3b8;
    }
  }

  .connector {
    width: 24px;
    height: 2px;
    background: ${(props) => (props.step >= 2 ? "#10b981" : "#f1f5f9")};
    transition: all 0.3s ease;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
    color: #94a3b8;
    font-size: 16px;
    pointer-events: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-left: ${(props) => (props.hasIcon ? "44px" : "16px")};
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const OTPInputContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 16px 0;
`;

const OTPInput = styled.input`
  width: 48px;
  height: 48px;
  text-align: center;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  background: #f9fafb;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }

  &.filled {
    border-color: #10b981;
    background: #f0fdf4;
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

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #bbf7d0;

  i {
    font-size: 12px;
  }
`;

const ResendSection = styled.div`
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #64748b;

  .resend-button {
    background: none;
    border: none;
    color: #667eea;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 0;
    margin-left: 4px;

    &:hover {
      color: #5a67d8;
    }

    &:disabled {
      color: #9ca3af;
      cursor: not-allowed;
      text-decoration: none;
    }
  }

  .countdown {
    color: #ef4444;
    font-weight: 500;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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

const BackButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 0;
  margin-bottom: 16px;

  &:hover {
    color: #5a67d8;
    text-decoration: underline;
  }

  i {
    font-size: 12px;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }

  span {
    padding: 0 16px;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
  }
`;

const GoogleButtonWrapper = styled.div`
  margin-bottom: 24px;

  button {
    width: 100% !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 8px !important;
    padding: 12px 16px !important;
    background: white !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: #f9fafb !important;
      border-color: #cbd5e1 !important;
      transform: translateY(-1px) !important;
    }
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
`;

const SignupPrompt = styled.div`
  text-align: center;
  font-size: 14px;
  color: #64748b;

  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;

    &:hover {
      color: #5a67d8;
      text-decoration: underline;
    }
  }
`;

const QuickLink = styled.div`
  text-align: center;

  a {
    color: #64748b;
    text-decoration: none;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      color: #667eea;
      background: #f8fafc;
      text-decoration: none;
    }

    i {
      font-size: 12px;
    }
  }
`;

export default function LoginPage() {
  const { sendOTP, verifyOTP } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm({ resolver: yupResolver(emailSchema) });

  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors },
    setValue: setOTPValue,
    watch: watchOTP,
  } = useForm({ resolver: yupResolver(otpSchema) });

  // Handle email submission
  const onEmailSubmit = async (data) => {
    setLoading(true);
    try {
      await sendOTP(data.email);
      setEmail(data.email);
      setStep(2);
      setOtpSent(true);
      startResendTimer();
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const onOTPSubmit = async (data) => {
    setLoading(true);
    try {
      await verifyOTP(email, data.otp);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP input
  const handleOTPChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Update form value
      setOTPValue("otp", newOtp.join(""));

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP input keydown
  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      await sendOTP(email);
      setOtp(["", "", "", "", "", ""]);
      setOTPValue("otp", "");
      startResendTimer();
      toast.success("New OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle back to email step
  const handleBackToEmail = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setOtpSent(false);
    setResendTimer(0);
  };

  return (
    <ReveloLayout>
      <PlatformContainer>
        <LoginCard>
          <Header>
            <div className="logo">
              <img
                src="/assets/images/logos/rdusk-logo.png"
                alt="Royal Dusk Tours"
              />
            </div>
            <h1>
              {step === 1 ? "Sigin or create account" : "Verify Your Email"}
            </h1>
            <p>
              {step === 1
                ? "Enter your email to receive a secure code"
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </Header>

          <StepIndicator step={step}>
            <div className={`step ${step >= 1 ? "active" : "inactive"}`}>
              <i className="fal fa-envelope" />
            </div>
            <div className="connector" />
            <div className={`step ${step >= 2 ? "active" : "inactive"}`}>
              <i className="fal fa-shield-check" />
            </div>
          </StepIndicator>

          {step === 1 ? (
            // Email Step
            <Form onSubmit={handleEmailSubmit(onEmailSubmit)}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <i className="fal fa-envelope input-icon" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    hasIcon
                    className={emailErrors.email ? "error" : ""}
                    {...registerEmail("email")}
                  />
                </InputWrapper>
                {emailErrors.email && (
                  <ErrorMessage>
                    <i className="fal fa-exclamation-circle" />
                    {emailErrors.email.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading && <div className="spinner" />}
                {loading ? "Sending..." : "Continue with email"}
                {!loading && <i className="fal fa-arrow-right" />}
              </SubmitButton>
            </Form>
          ) : (
            // OTP Step
            <>
              <BackButton onClick={handleBackToEmail}>
                <i className="fal fa-arrow-left" />
                Change Email Address
              </BackButton>

              <Form onSubmit={handleOTPSubmit(onOTPSubmit)}>
                <FormGroup>
                  <Label>Enter 6-Digit Code</Label>
                  <OTPInputContainer>
                    {otp.map((digit, index) => (
                      <OTPInput
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                        className={`
                          ${otpErrors.otp ? "error" : ""} 
                          ${digit ? "filled" : ""}
                        `}
                      />
                    ))}
                  </OTPInputContainer>
                  {otpErrors.otp && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {otpErrors.otp.message}
                    </ErrorMessage>
                  )}
                  {otpSent && !otpErrors.otp && (
                    <SuccessMessage>
                      <i className="fal fa-check-circle" />
                      Verification code sent successfully
                    </SuccessMessage>
                  )}
                </FormGroup>

                <ResendSection>
                  {resendTimer > 0 ? (
                    <span>
                      Didn't receive the code? Resend in{" "}
                      <span className="countdown">{resendTimer}s</span>
                    </span>
                  ) : (
                    <span>
                      Didn't receive the code?
                      <button
                        type="button"
                        className="resend-button"
                        onClick={handleResendOTP}
                        disabled={loading}
                      >
                        Resend Code
                      </button>
                    </span>
                  )}
                </ResendSection>

                <SubmitButton
                  type="submit"
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading && <div className="spinner" />}
                  {loading ? "Verifying..." : "Verify & Sign In"}
                  {!loading && <i className="fal fa-check" />}
                </SubmitButton>
              </Form>
            </>
          )}

          {step === 1 && (
            <>
              <Divider>
                <span>or</span>
              </Divider>

              <div className="mb-3">
                <GoogleLoginButton text="Continue with Google" />
              </div>
              <div className="mb-3">
                <AppleLoginButton text="Sign in with Apple" />
              </div>
            </>
          )}

          <FooterLinks>
            <QuickLink>
              <Link href="/booking-lookup">
                <i className="fal fa-search" />
                Look up existing booking
              </Link>
            </QuickLink>
          </FooterLinks>
        </LoginCard>
      </PlatformContainer>
    </ReveloLayout>
  );
}
