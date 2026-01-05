'use client';
import { useAuthLayout } from '@/app/hooks/auth/useAuthLayout';
import { InfoSection } from './InfoSection';
import { FormSection } from './FormSection';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  infoTitle?: string;
  infoDescription?: string;
  showBackButton?: boolean;
  infoPosition?: 'left' | 'right';
  hideTitle?: boolean;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  infoTitle,
  infoDescription,
  showBackButton = true,
  infoPosition = 'left',
  hideTitle = false,
}: AuthLayoutProps) => {
  const { backLabel, handleBackClick } = useAuthLayout();

  return (
    <div className="flex w-full h-screen lg:h-screen lg:overflow-hidden">
      {infoPosition === 'left' ? (
        <>
          <InfoSection infoTitle={infoTitle} infoDescription={infoDescription} />
          <FormSection
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
            hideTitle={hideTitle}
            backLabel={backLabel}
            handleBackClick={handleBackClick}
          >
            {children}
          </FormSection>
        </>
      ) : (
        <>
          <FormSection
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
            hideTitle={hideTitle}
            backLabel={backLabel}
            handleBackClick={handleBackClick}
          >
            {children}
          </FormSection>
          <InfoSection infoTitle={infoTitle} infoDescription={infoDescription} />
        </>
      )}
    </div>
  );
};