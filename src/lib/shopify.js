import {ApolloClient, InMemoryCache, createHttpLink, gql} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
    uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
});

const adminHttpLink = createHttpLink({
    uri:`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/graphql.json`
})

const adminAuthLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        'X-Shopify-Storefront-Access-Token': process.env.ADMIN_SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
    }
}));


const authLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    }
}));

export const shopifyClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});


export const shopifyAdminClient = new ApolloClient({
    link: adminHttpLink.concat(adminAuthLink),
    cache: new InMemoryCache(),
})

export const CREATE_CHECKOUT = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const CHECKOUT_LINE_ITEMS_ADD = gql`
  mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;