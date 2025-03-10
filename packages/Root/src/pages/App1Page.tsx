import React, { Suspense } from 'react';
import { Spinner } from '@shopify/polaris';

const App1 = React.lazy(() => import('app1/App'));

const App1Page: React.FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <App1 />
    </Suspense>
  );
};

export default App1Page; 