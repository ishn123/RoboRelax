import { gql } from '@apollo/client';
import { shopifyClient } from '@/lib/shopify';
import ProductDetails from '@/components/ProductDetails';

const PRODUCT_QUERY = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      featuredImage {
        url
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export default async function ProductPage({ params}) {
    const { data } = await shopifyClient.query({
        query: PRODUCT_QUERY,
        variables: { handle: params.handle }
    });

    if (!data.productByHandle) {
        return <div>Product not found</div>;
    }

    return (
        <main className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
                <ProductDetails product={data.productByHandle} />
            </div>
        </main>
    );
}