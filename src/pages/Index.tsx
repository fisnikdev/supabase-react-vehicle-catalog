import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CarCard from "@/components/CarCard";
import { useFeaturedCars } from "@/hooks/use-encar";
import { buildEncarImageUrl, translateKoreanToEnglish } from "@/lib/encar-utils";
import { Loader2 } from "lucide-react";

// Fallback images for cars without images
import car1 from "@/assets/logo.jpg";
import car2 from "@/assets/logo.jpg";
import car3 from "@/assets/logo.jpg";





const fallbackImages = [car1, car2, car3];

const Index = () => {
  const { data: featuredCars, isLoading, error } = useFeaturedCars(['BMW', 'Mercedes-Benz', 'Audi']);

  const formatMileage = (km: number) => {
    if (km >= 1000) {
      return `${Math.round(km / 1000)}K km`;
    }
    return `${km} km`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
     
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Makinat me të klikuara
            </h2>
            <p className="text-lg text-muted-foreground">
              Garanci, Verifikim dhe Përgjegjësi
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>Ndodhi një gabim gjatë ngarkimit të veturave.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars?.slice(0, 6).map((car, index) => {
                const imageUrl = buildEncarImageUrl(car.image);
                return (
                  <CarCard
  key={car.id}
  id={String(car.id)}
  image={imageUrl || fallbackImages[index % fallbackImages.length]}
  manufacturer={car.manufacturer}
  model={translateKoreanToEnglish(`${car.model} ${car.badge}`)}
  year={String(car.year).slice(0, 4)}
  price={`€${car.priceEur.toLocaleString('de-DE')}`}
  mileage={formatMileage(car.mileage)}
  
cc={car.displacement ? `${car.displacement}cc` : undefined}
  
  fuel={car.fuelType}
  transmission={car.transmission}
/>
                );
              })}
            </div>
          )}
        </div>
      </section>


      <footer className="bg-muted py-12 px-4 mt-20">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm">© 2026 Vetrix Auto. Të gjitha drejtat të rezervuara.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
