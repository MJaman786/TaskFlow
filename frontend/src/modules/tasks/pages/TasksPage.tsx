import { Helmet } from 'react-helmet-async';
import { lazy, memo } from 'react';
import LazyLoadingWrapper from '../../../common/LazyLoading';

// 1. Lazy-load the view/component
const RenderView = lazy(() => import('../components/TasksView'));

// 2. Memoize to prevent unnecessary re-renders when parent states mutate
const MemoizedView = memo(RenderView);

export default function TasksPage() {
  return (
    <>
      <Helmet>
        <title>Tasks | TrackFlow</title>
      </Helmet>

      <LazyLoadingWrapper>
        <MemoizedView/>
      </LazyLoadingWrapper>
    </>
  );
}
