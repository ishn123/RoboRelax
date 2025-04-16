// pages/api/register.ts
import {shopifyAdminClient,shopifyClient} from "@/lib/shopify";
import {gql} from "@apollo/client";
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { email, password, firstName, lastName } = req.body;

    const query = gql`mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
            customerAccessToken {
                accessToken
            }
            customerUserErrors {
                message
            }
        }
    }`

    const response = await shopifyClient.mutate({
        mutation:query,
        variables:{input:{email,password}}
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
