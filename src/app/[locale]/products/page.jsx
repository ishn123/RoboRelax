import { gql } from '@apollo/client';
import { shopifyClient } from '@/lib/shopify';
import ProductGrid from '@/components/ProductGrid';

const ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          featuredImage {
            url
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                  availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export default async function ProductsPage() {
    const { data } = await shopifyClient.query({
        query: ALL_PRODUCTS_QUERY,
        variables: { first: 12 }
    });

    console.log(data.products)

    return (
        <main className="min-h-screen py-20">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-16">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Our Collection
          </span>
                </h1>
                <ProductGrid products={data.products.edges.map(edge => edge.node)} />
            </div>
        </main>
    );
}