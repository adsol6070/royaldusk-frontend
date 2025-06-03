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

// --- Yup Validation Schema ---
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

export default function SignupPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const { confirmPassword, ...finalData } = data;
    setLoading(true);
    try {
      await registerUser(finalData);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReveloLayout>
      <SignupSection>
        <div className="container">
          <SignupContainer>
            <Title>Create Account</Title>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your full name"
                />
                {errors.name && <Error>{errors.name.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  {...register("email")}
                  placeholder="Enter your email"
                />
                {errors.email && <Error>{errors.email.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Create a password"
                />
                {errors.password && <Error>{errors.password.message}</Error>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <Error>{errors.confirmPassword.message}</Error>
                )}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </SubmitButton>
            </Form>
            {/* Divider */}
            <hr />
            <div className="text-center">OR</div>
            <hr />

            {/* Google Sign-Up Button */}
            <GoogleLoginButton text="Sign up with Google" />
            <LoginLink>
              Already have an account? <Link href="/login">Sign In</Link>
            </LoginLink>
          </SignupContainer>
        </div>
      </SignupSection>
    </ReveloLayout>
  );
}

// --- Styled Components (Keep your existing ones or paste from previous code if not here) ---

const SignupSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
`;

const SignupContainer = styled.div`
  max-width: 500px;
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

const SubmitButton = styled.button`
  background: #ee8b50;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #e56d1f;
  }

  &:disabled {
    background: #ffd5b8;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.p`
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

const Error = styled.small`
  color: #ef4444;
  font-size: 0.85rem;
`;
