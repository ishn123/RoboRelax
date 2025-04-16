// pages/api/register.ts
import {shopifyAdminClient,shopifyClient} from "@/lib/shopify";
import {gql} from "@apollo/client";
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { email, password, name:firstName, lastName } = req.body;

    const query = gql`mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            customer {
                firstName
                lastName
                email
            }
            customerUserErrors {
                field
                message
                code
            }
        }
    }`

    const response = await shopifyClient.mutate({
        mutation:query,
        variables:{input:{firstName, lastName,email,password}}
    })


    const errors = response.data.customerCreate.customerUserErrors;
    console.log(response.data.customerCreate.customer);
    if (errors.length > 0) {
        return res.status(400).json({ error: errors[0].message });
    }

    // Auto-login after registration

    const tokenQuery = gql`
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
            customerAccessTokenCreate(input: $input) {
                customerUserErrors {
                    code
                    field
                    message
                }
                customerAccessToken {
                    accessToken
                    expiresAt
                }
            }
        }
    `

    const loginAfterRegister = await shopifyClient.mutate({
        mutation:tokenQuery,
        variables:{input:{email,password}}
    })

    const token = loginAfterRegister.data.customerAccessTokenCreate.customerAccessToken;

    if (token) {
        res.status(200).json({ token:token,email:email,firstName:firstName,lastName:lastName });
    } else {
        res.status(401).json({ error: 'Login failed after registration' });
    }
}
