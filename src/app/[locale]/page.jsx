import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import AboutUs from "@/components/AboutUs";


export default function Home() {
    return (
        <div>
                <HeroSection />
                <FeaturedProducts />
                <AboutUs/>
        </div>
    );
}