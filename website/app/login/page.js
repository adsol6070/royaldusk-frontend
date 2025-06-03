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

// --- Yup Validation Schema ---
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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
      router.push("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReveloLayout>
      <LoginSection>
        <div className="container">
          <LoginContainer>
            <Title>Login</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && <ErrorMsg>{errors.email.message}</ErrorMsg>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <ErrorMsg>{errors.password.message}</ErrorMsg>
                )}
                <HelpLinks>
                  <Link href="/forgot-password">Forgot Password?</Link>
                  <Link href="/resend-verification">
                    Resend Verification Email
                  </Link>
                </HelpLinks>
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </SubmitButton>
            </Form>
            {/* Divider */}
            <hr />
            <div className="text-center">OR</div>
            <hr />

            {/* Google Sign-In Button */}
            <GoogleLoginButton text="Sign in with Google" />
            <SignupLink>
              Don't have an account? <Link href="/signup">Sign Up</Link>
            </SignupLink>

            <BookingLookupLink>
              <Link href="/booking-lookup">
                Look up your booking without signing in
              </Link>
            </BookingLookupLink>
          </LoginContainer>
        </div>
      </LoginSection>
    </ReveloLayout>
  );
}

// --- Styled Components ---

const LoginSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
`;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #ee8b50;
  }
`;

const HelpLinks = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.9rem;

  a {
    color: #ee8b50;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SubmitButton = styled.button`
  background: #ee8b50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e56d1f;
  }

  &:disabled {
    background: #ffd5b8;
    cursor: not-allowed;
  }
`;

const SignupLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
  font-size: 0.9rem;

  a {
    color: #ee8b50;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const BookingLookupLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #ee8b50;
      text-decoration: underline;
    }
  }
`;

const ErrorMsg = styled.small`
  color: #ef4444;
  font-size: 0.85rem;
`;
