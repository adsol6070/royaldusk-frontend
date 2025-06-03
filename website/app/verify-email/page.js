"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import { useAuth } from '@/common/context/AuthContext';
import ReveloLayout from '@/layout/ReveloLayout';
import { toast } from 'react-hot-toast';

const VerificationSection = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
`;

const VerificationContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const StatusIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: #ee8b50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #e56d1f;
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

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('invalid');
      return;
    }

    const verifyEmailToken = async () => {
      try {
        await verifyEmail(token);
        setVerificationStatus('success');
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast.error(error?.message || 'Email verification failed');
      }
    };

    verifyEmailToken();
  }, [searchParams, verifyEmail]);

  const getContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return {
          icon: '⏳',
          title: 'Verifying Your Email',
          message: 'Please wait while we verify your email address...',
        };
      case 'success':
        return {
          icon: '✅',
          title: 'Email Verified!',
          message: 'Your email has been successfully verified. You can now log in to your account.',
        };
      case 'error':
        return {
          icon: '❌',
          title: 'Verification Failed',
          message: 'We could not verify your email. The link may have expired or is invalid.',
        };
      case 'invalid':
        return {
          icon: '⚠️',
          title: 'Invalid Request',
          message: 'No verification token found. Please use the link from your verification email.',
        };
      default:
        return {
          icon: '❓',
          title: 'Something Went Wrong',
          message: 'An unexpected error occurred. Please try again later.',
        };
    }
  };

  const content = getContent();

  return (
    <ReveloLayout>
      <VerificationSection>
        <div className="container">
          <VerificationContainer>
            <StatusIcon>{content.icon}</StatusIcon>
            <Title>{content.title}</Title>
            <Message>{content.message}</Message>
            
            {verificationStatus === 'success' && (
              <Button onClick={() => router.push('/login')}>
                Go to Login
              </Button>
            )}
            
            {(verificationStatus === 'error' || verificationStatus === 'invalid') && (
              <BackToLogin>
                <Link href="/resend-verification">Resend verification email</Link>
              </BackToLogin>
            )}
            
            <BackToLogin>
              <Link href="/">Back to Home</Link>
            </BackToLogin>
          </VerificationContainer>
        </div>
      </VerificationSection>
    </ReveloLayout>
  );
} 