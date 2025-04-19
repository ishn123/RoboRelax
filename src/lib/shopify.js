import {ApolloClient, InMemoryCache, createHttpLink, gql} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = createHttpLink({
    uri: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
});

const adminHttpLink = createHttpLink({
    uri:`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/shop.json`
})

const adminAuthLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        'X-Shopify-Access-Token': process.env.ADMIN_SHOPIFY_ACCESS_TOKEN,
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
    mutation CreateCart($input: CartInput) {
        cartCreate(input: $input) {
            cart {
                id
                checkoutUrl
                lines(first: 10) {
                    edges {
                        node {
                            id
                            quantity
                            merchandise {
                                ... on ProductVariant {
                                    id
                                    title
                                    product {
                                        title
                                        tags
                                    }
                                }
                            }
                        }
                    }
                }
            }
            userErrors {
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


export const GET_CUSTOMER_ORDERS = gql`
    query GetCustomerOrders($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
            orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
                edges {
                    node {
                        id
                        name
                        orderNumber
                        statusUrl
                        totalPrice {
                            amount
                            currencyCode
                        }
                        processedAt
                    }
                }
            }
        }
    }
`