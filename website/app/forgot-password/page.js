"use client";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '@/common/context/AuthContext';
import ReveloLayout from '@/layout/ReveloLayout';
import { toast } from 'react-hot-toast';

const ForgotPasswordSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
`;

const ForgotPasswordContainer = styled.div`
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
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
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

const ErrorText = styled.small`
  color: #e63946;
  font-size: 0.85rem;
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

const BackToLogin = styled.p`
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

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
});

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const router = useRouter();
  const { forgotPassword } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      setSubmittedEmail(data.email);
      reset();
    } catch (error) {
      toast.error(error?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <ReveloLayout>
        <ForgotPasswordSection>
          <div className="container">
            <ForgotPasswordContainer>
              <Title>Check Your Email</Title>
              <Subtitle>
                We've sent password reset instructions to {submittedEmail}. Please check your inbox.
              </Subtitle>
              <BackToLogin>
                <Link href="/login">Back to Login</Link>
              </BackToLogin>
            </ForgotPasswordContainer>
          </div>
        </ForgotPasswordSection>
      </ReveloLayout>
    );
  }

  return (
    <ReveloLayout>
      <ForgotPasswordSection>
        <div className="container">
          <ForgotPasswordContainer>
            <Title>Reset Password</Title>
            <Subtitle>
              Enter your email address and we'll send you instructions to reset your password.
            </Subtitle>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </SubmitButton>
            </Form>

            <BackToLogin>
              Remember your password? <Link href="/login">Back to Login</Link>
            </BackToLogin>
          </ForgotPasswordContainer>
        </div>
      </ForgotPasswordSection>
    </ReveloLayout>
  );
}
