"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { useAuth } from "@/common/context/AuthContext";
import ReveloLayout from "@/layout/ReveloLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const schema = yup.object().shape({
  name: yup.string().required("Full name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/\d/, "Must include a number")
    .matches(/[!@#$%^&*]/, "Must include a special character (!@#$%^&*)")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const PlatformContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media (max-width: 540px) {
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

  &.success {
    border-color: #10b981;
    background: #f0fdf4;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;

  .password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 16px;
    padding: 4px;

    &:hover {
      color: #64748b;
    }
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

  i {
    font-size: 12px;
  }
`;

const PasswordStrength = styled.div`
  margin-top: 8px;

  .strength-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 6px;
  }

  .strength-bar {
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 2px;

      &.weak {
        width: 25%;
        background: #ef4444;
      }

      &.fair {
        width: 50%;
        background: #f59e0b;
      }

      &.good {
        width: 75%;
        background: #3b82f6;
      }

      &.strong {
        width: 100%;
        background: #10b981;
      }
    }
  }

  .strength-text {
    font-size: 11px;
    margin-top: 4px;
    font-weight: 500;

    &.weak {
      color: #ef4444;
    }
    &.fair {
      color: #f59e0b;
    }
    &.good {
      color: #3b82f6;
    }
    &.strong {
      color: #10b981;
    }
  }
`;

const PasswordRequirements = styled.div`
  margin-top: 8px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;

  .requirements-title {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
  }

  .requirements-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    font-size: 11px;

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
    }

    .requirement {
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        font-size: 10px;
        width: 10px;

        &.fa-check {
          color: #10b981;
        }

        &.fa-times {
          color: #ef4444;
        }
      }

      &.met {
        color: #10b981;
      }

      &.unmet {
        color: #64748b;
      }
    }
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

const LoginPrompt = styled.div`
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

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const watchedPassword = watch("password", "");

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score < 2) return "weak";
    if (score < 3) return "fair";
    if (score < 4) return "good";
    return "strong";
  };

  const getPasswordRequirements = (password) => [
    { text: "8+ characters", met: password.length >= 8 },
    { text: "Uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Lowercase letter", met: /[a-z]/.test(password) },
    { text: "Number", met: /\d/.test(password) },
    { text: "Special character", met: /[!@#$%^&*]/.test(password) },
  ];

  const onSubmit = async (data) => {
    const { confirmPassword, ...finalData } = data;
    setLoading(true);
    try {
      await registerUser(finalData);
      toast.success("Account created successfully! Please verify your email.");
      router.push("/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = calculatePasswordStrength(watchedPassword);
  const passwordRequirements = getPasswordRequirements(watchedPassword);

  return (
    <ReveloLayout>
      <PlatformContainer>
        <RegisterCard>
          <Header>
            <div className="logo">
              <img
                src="/assets/images/logos/rdusk-logo.png"
                alt="Royal Dusk Tours"
              />
            </div>
            <h1>Create Account</h1>
            <p>Join us to start your travel journey</p>
          </Header>

          <Form onSubmit={handleSubmit(onSubmit)}>
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

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <PasswordWrapper>
                <InputWrapper>
                  <i className="fal fa-lock input-icon" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    hasIcon
                    className={errors.password ? "error" : ""}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={`fal fa-${showPassword ? "eye-slash" : "eye"}`}
                    />
                  </button>
                </InputWrapper>
              </PasswordWrapper>

              {watchedPassword && (
                <PasswordStrength>
                  <div className="strength-label">Password Strength</div>
                  <div className="strength-bar">
                    <div className={`strength-fill ${passwordStrength}`} />
                  </div>
                  <div className={`strength-text ${passwordStrength}`}>
                    {passwordStrength.charAt(0).toUpperCase() +
                      passwordStrength.slice(1)}
                  </div>
                </PasswordStrength>
              )}

              {errors.password && (
                <ErrorMessage>
                  <i className="fal fa-exclamation-circle" />
                  {errors.password.message}
                </ErrorMessage>
              )}

              {watchedPassword && (
                <PasswordRequirements>
                  <div className="requirements-title">
                    Password Requirements
                  </div>
                  <div className="requirements-list">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`requirement ${req.met ? "met" : "unmet"}`}
                      >
                        <i
                          className={`fas fa-${req.met ? "check" : "times"}`}
                        />
                        {req.text}
                      </div>
                    ))}
                  </div>
                </PasswordRequirements>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordWrapper>
                <InputWrapper>
                  <i className="fal fa-lock input-icon" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    hasIcon
                    className={
                      errors.confirmPassword
                        ? "error"
                        : !errors.confirmPassword &&
                          watch("confirmPassword") &&
                          watch("confirmPassword") === watch("password")
                        ? "success"
                        : ""
                    }
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i
                      className={`fal fa-${
                        showConfirmPassword ? "eye-slash" : "eye"
                      }`}
                    />
                  </button>
                </InputWrapper>
              </PasswordWrapper>

              {!errors.confirmPassword &&
                watch("confirmPassword") &&
                watch("confirmPassword") === watch("password") && (
                  <SuccessMessage>
                    <i className="fas fa-check" />
                    Passwords match
                  </SuccessMessage>
                )}

              {errors.confirmPassword && (
                <ErrorMessage>
                  <i className="fal fa-exclamation-circle" />
                  {errors.confirmPassword.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading && <div className="spinner" />}
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <i className="fal fa-arrow-right" />}
            </SubmitButton>
          </Form>

          <Divider>
            <span>or</span>
          </Divider>

          <GoogleButtonWrapper>
            <GoogleLoginButton text="Continue with Google" />
          </GoogleButtonWrapper>

          <FooterLinks>
            <LoginPrompt>
              Already have an account?
              <Link href="/login">Sign In</Link>
            </LoginPrompt>
          </FooterLinks>
        </RegisterCard>
      </PlatformContainer>
    </ReveloLayout>
  );
}
