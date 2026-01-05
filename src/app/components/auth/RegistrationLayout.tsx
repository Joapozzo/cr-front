'use client';

import { RegistrationStepper } from './RegistrationStepper';
import { FormSection } from './FormSection';
import { InfoSection } from './InfoSection';
import { useAuthLayout } from '@/app/hooks/auth/useAuthLayout';

interface RegistrationLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  infoTitle?: string;
  infoDescription?: string;
  infoPosition?: 'left' | 'right';
}

export const RegistrationLayout = ({
  children,
  title,
  subtitle,
  infoTitle,
  infoDescription,
  infoPosition = 'left',
  showBackButton = false,
}: RegistrationLayoutProps & { showBackButton?: boolean }) => {
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
            hideTitle={false}
            backLabel={backLabel}
            handleBackClick={handleBackClick}
          >
            <div className="w-full flex flex-col">
              <RegistrationStepper />
              {children}
            </div>
          </FormSection>
        </>
      ) : (
        <>
          <FormSection
            title={title}
            subtitle={subtitle}
            showBackButton={showBackButton}
            hideTitle={false}
            backLabel={backLabel}
            handleBackClick={handleBackClick}
          >
            <div className="w-full flex flex-col">
              <RegistrationStepper />
              {children}
            </div>
          </FormSection>
          <InfoSection infoTitle={infoTitle} infoDescription={infoDescription} />
        </>
      )}
    </div>
  );
};

