// pages/api/register.ts
import {shopifyAdminClient,shopifyClient} from "@/lib/shopify";
import {gql} from "@apollo/client";
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { email, password, name:firstName, lastName,street, city, state, zipCode } = req.body;

    const query = gql`mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            customer {
                id
                firstName
                lastName
                email
                addresses(first: 2){
                    nodes{
                        address1
                        city
                        
                    }
                }
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

    console.log(response)
    const errors = response.data.customerCreate.customerUserErrors;
    console.log(response.data.customerCreate.customer);
    if (errors.length > 0) {
        return res.status(400).json({ error: errors[0].message });
    }

    // Auto-login after registration
    const cId = response.data.customerCreate.customer.id;
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
        const input=
            {
                address1:street,
                city,
                province:state,
                zip:zipCode,
                country:'DE'
            }


        const ADDRESS_MUTATE=gql`
            mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
                customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        await shopifyClient.mutate({
            mutation:ADDRESS_MUTATE,
            variables:{input,customerAccessToken:token}
        });
        res.status(200).json({ token:token,email:email,firstName:firstName,lastName:lastName });
    } else {
        res.status(401).json({ error: 'Login failed after registration' });
    }
}
