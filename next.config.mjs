/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig = {
    images:{
        domains:[
            "cdn.shopify.com",
            "roborelax.de"
        ]
    }
};

export default withNextIntl(nextConfig);
