"use client";

import { useState, useEffect } from "react";
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

const profileSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  phone: yup
    .string()
    .matches(/^[+]?[\d\s\-()]+$/, "Invalid phone number format")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
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
    transition: all 0.3s ease;

    &.completed {
      background: #10b981;
    }

    &.active {
      background: #667eea;
    }

    &.inactive {
      background: #f1f5f9;
    }
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

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
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

const UserTypeIndicator = styled.div`
  text-align: center;
  margin-bottom: 16px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;

  &.new-user {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #bfdbfe;
  }

  &.existing-user {
    background: #ecfdf5;
    color: #166534;
    border: 1px solid #bbf7d0;
  }
`;

export default function LoginPage() {
  const { sendOTP, verifyOTP, completeProfile, otpState, isAuthenticated } =
    useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Profile
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

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
  } = useForm({ resolver: yupResolver(otpSchema) });

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({ resolver: yupResolver(profileSchema) });

  // Handle email submission
  const onEmailSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await sendOTP(data.email);
      if (result.success) {
        setEmail(data.email);
        setIsNewUser(result.isNewUser);
        setStep(2);
        startResendTimer();
      }
    } catch (error) {
      // Error already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP submission
  const onOTPSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await verifyOTP(email, data.otp);
      if (result.success) {
        if (result.needsProfileCompletion) {
          setStep(3);
        } else {
          // Login successful, user will be redirected via useEffect
        }
      }
    } catch (error) {
      // Error already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Handle profile completion
  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await completeProfile({
        name: data.name,
        phone: data.phone,
      });
      if (result.success) {
        // Login successful, user will be redirected via useEffect
      }
    } catch (error) {
      // Error already handled by AuthContext
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
    } catch (error) {
      // Error already handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // Handle back to email step
  const handleBackToEmail = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(0);
    setEmail("");
    setIsNewUser(false);
  };

  // Handle back to OTP step (from profile step)
  const handleBackToOTP = () => {
    setStep(2);
    setOtp(["", "", "", "", "", ""]);
    setOTPValue("otp", "");
  };

  // Get step titles and descriptions
  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Sign in or create account",
          description: "Enter your email to receive a secure code",
        };
      case 2:
        return {
          title: "Verify Your Email",
          description: `We've sent a 6-digit code to ${email}`,
        };
      case 3:
        return {
          title: "Complete Your Profile",
          description: "Just a few more details to get started",
        };
      default:
        return { title: "", description: "" };
    }
  };

  const { title, description } = getStepContent();

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
            <h1>{title}</h1>
            <p>{description}</p>
          </Header>

          <StepIndicator step={step}>
            <div
              className={`step ${
                step >= 1 ? (step === 1 ? "active" : "completed") : "inactive"
              }`}
            >
              <i className="fal fa-envelope" />
            </div>
            <div
              className={`connector ${
                step >= 2 ? (step === 2 ? "active" : "completed") : "inactive"
              }`}
            />
            <div
              className={`step ${
                step >= 2 ? (step === 2 ? "active" : "completed") : "inactive"
              }`}
            >
              <i className="fal fa-shield-check" />
            </div>
            <div className={`connector ${step >= 3 ? "active" : "inactive"}`} />
            <div className={`step ${step >= 3 ? "active" : "inactive"}`}>
              <i className="fal fa-user" />
            </div>
          </StepIndicator>

          {/* Show user type indicator on OTP step */}
          {step === 2 && (
            <UserTypeIndicator
              className={isNewUser ? "new-user" : "existing-user"}
            >
              <i
                className={`fal ${
                  isNewUser ? "fa-user-plus" : "fa-user-check"
                }`}
              />
              {isNewUser
                ? "New account - profile setup required"
                : "Welcome back!"}
            </UserTypeIndicator>
          )}

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
          ) : step === 2 ? (
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
                  {loading ? "Verifying..." : "Verify & Continue"}
                  {!loading && <i className="fal fa-check" />}
                </SubmitButton>
              </Form>
            </>
          ) : (
            // Profile Completion Step
            <>
              <BackButton onClick={handleBackToOTP}>
                <i className="fal fa-arrow-left" />
                Back to Verification
              </BackButton>

              <Form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                <FormGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <InputWrapper>
                    <i className="fal fa-user input-icon" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      hasIcon
                      className={profileErrors.name ? "error" : ""}
                      {...registerProfile("name")}
                    />
                  </InputWrapper>
                  {profileErrors.name && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {profileErrors.name.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="phone">Phone Number</Label>
                  <InputWrapper>
                    <i className="fal fa-phone input-icon" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      hasIcon
                      className={profileErrors.phone ? "error" : ""}
                      {...registerProfile("phone")}
                    />
                  </InputWrapper>
                  {profileErrors.phone && (
                    <ErrorMessage>
                      <i className="fal fa-exclamation-circle" />
                      {profileErrors.phone.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <SubmitButton type="submit" disabled={loading}>
                  {loading && <div className="spinner" />}
                  {loading ? "Creating Account..." : "Complete Setup"}
                  {!loading && <i className="fal fa-check-circle" />}
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
