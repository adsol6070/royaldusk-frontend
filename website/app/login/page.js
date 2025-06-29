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

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
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

const HelpLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  gap: 16px;

  @media (max-width: 380px) {
    flex-direction: column;
    gap: 8px;
  }

  a {
    color: #667eea;
    text-decoration: none;
    font-size: 13px;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #5a67d8;
      text-decoration: underline;
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

  /* Override default Google button styles to match platform */
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
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
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
            <h1>Welcome Back</h1>
            <p>Sign in to your account to continue</p>
          </Header>

          <Form onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Enter your password"
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
              {errors.password && (
                <ErrorMessage>
                  <i className="fal fa-exclamation-circle" />
                  {errors.password.message}
                </ErrorMessage>
              )}
              <HelpLinks>
                <Link href="/forgot-password">Forgot Password?</Link>
                <Link href="/resend-verification">Resend Verification</Link>
              </HelpLinks>
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading && <div className="spinner" />}
              {loading ? "Signing in..." : "Sign In"}
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
            <SignupPrompt>
              Don't have an account?
              <Link href="/register">Create Account</Link>
            </SignupPrompt>

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
