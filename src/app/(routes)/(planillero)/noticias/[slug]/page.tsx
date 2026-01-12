import { Suspense } from 'react';
import NoticiaPageContent from './NoticiaPageContent';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { NoticiaCardSkeleton2 } from '@/app/components/skeletons/NoticiaCardSkeleton';

interface NoticiaPageProps {
    params: Promise<{ slug: string }>;
}

export default function NoticiaPage({ params }: NoticiaPageProps) {
  return (
    <Suspense fallback={
      <UserPageWrapper>
        <div className="w-full space-y-6">
          <NoticiaCardSkeleton2 />
        </div>
      </UserPageWrapper>
    }>
      <NoticiaPageContent params={params} />
    </Suspense>
  );
}
