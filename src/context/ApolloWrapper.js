// app/ApolloWrapper.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';
import { shopifyClient } from '@/lib/shopify';

export default function ApolloWrapper({ children }) {
    return <ApolloProvider client={shopifyClient}>{children}</ApolloProvider>;
}
