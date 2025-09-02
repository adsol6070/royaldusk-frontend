"use client";
import ReveloLayout from "@/layout/ReveloLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styled from "styled-components";

const ErrorContainer = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(248, 133, 61, 0.05) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(248, 133, 61, 0.03) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(248, 133, 61, 0.06);
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 480px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 32px 24px;
    border-radius: 12px;
  }
`;

const ErrorCode = styled.div`
  font-size: 4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f8853d, #e67428);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const ErrorHeader = styled.div`
  margin-bottom: 24px;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin: 0;
    max-width: 360px;
    margin: 0 auto;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 20px;
  background: #f8853d;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  &:hover {
    background: #e67428;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(248, 133, 61, 0.25);
    text-decoration: none;
    color: white;
  }

  i {
    font-size: 14px;
  }
`;

const SecondaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 20px;
  background: white;
  color: #64748b;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  cursor: pointer;

  &:hover {
    border-color: #f8853d;
    color: #f8853d;
    transform: translateY(-1px);
    box-shadow: 0 2px 12px rgba(248, 133, 61, 0.1);
  }

  i {
    font-size: 14px;
  }
`;

const IllustrationSection = styled.div`
  margin-bottom: 20px;

  .icon-container {
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #fef7f0, #fed7aa);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    border: 1px solid #fed7aa;

    i {
      font-size: 2rem;
      color: #f8853d;
    }
  }
`;

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <ReveloLayout>
      <ErrorContainer>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <ErrorCard>
                <IllustrationSection>
                  <div className="icon-container">
                    <i className="fal fa-map-marked-alt" />
                  </div>
                </IllustrationSection>

                <ErrorCode>404</ErrorCode>
                
                <ErrorHeader>
                  <h1>Page Not Found</h1>
                  <p>
                    The page you're looking for might have been moved, renamed, or doesn't exist.
                  </p>
                </ErrorHeader>

                <ActionButtons>
                  <PrimaryButton href="/">
                    <i className="fal fa-home" />
                    Go to Home
                  </PrimaryButton>
                  <SecondaryButton onClick={handleGoBack}>
                    <i className="fal fa-arrow-left" />
                    Go Back
                  </SecondaryButton>
                </ActionButtons>
              </ErrorCard>
            </div>
          </div>
        </div>
      </ErrorContainer>
    </ReveloLayout>
  );
};

export default NotFoundPage;