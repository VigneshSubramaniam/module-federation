import React, { Suspense } from 'react';
import { Spinner } from '@shopify/polaris';

const App2 = React.lazy(() => import('app2/app'));

const App2Page: React.FC = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <App2 />
    </Suspense>
  );
};

export default App2Page; 