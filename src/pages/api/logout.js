// pages/api/register.ts
import {shopifyAdminClient,shopifyClient} from "@/lib/shopify";
import {gql} from "@apollo/client";
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { cartId,userId } = req.body;

    const SET_CUSTOMER_CART_METAFIELD  = gql`
        mutation customerUpdate($input: CustomerUpdateInput!) {
            customerUpdate(input: $input) {
                customer {
                    id
                    metafields(first: 10) {
                        edges {
                            node {
                                id
                                key
                                value
                            }
                        }
                    }
                }
                userErrors {
                    field
                    message
                    code
                }
            }
        }
    `;

    const response = await shopifyClient.mutate({
        mutation:SET_CUSTOMER_CART_METAFIELD,
        variables:{
            input: {
                id: userId,
                metafields: [{
                    key: "current_cart",
                    value: cartId,
                    namespace: "cart",
                    valueType: "STRING"
                }]
            }
        }
    })


    console.log(response);
    const errors = response.data.customerAccessTokenCreate.customerUserErrors;
    console.log(errors)
    if (errors.length > 0) {
        return res.status(400).json({ error: errors[0].message });
    }
    const token = response.data.customerAccessTokenCreate.customerAccessToken.accessToken;
    return res.status(201).json({token:token});



}
