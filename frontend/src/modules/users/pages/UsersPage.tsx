import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LazyLoadingWrapper from '../../../common/LazyLoading';

// 1. Lazy-load the view/component
const RenderView = lazy(() => import('../components/UsersView'));

// 2. Memoize to prevent unnecessary re-renders when parent states mutate
const MemoizedView = memo(RenderView);

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title>Admin Console | TrackFlow</title>
      </Helmet>

      <LazyLoadingWrapper>
        <MemoizedView/>
      </LazyLoadingWrapper>
    </>
  );
}
