import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; 
import { Calendar, Gauge, Fuel, Heart, ExternalLink, Maximize2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getHighResImage } from "@/lib/utils";
import "swiper/css";
import "swiper/css/navigation";

interface CarCardProps {
  id: string;
  image: string;
  manufacturer: string;
  model: string;
  year: string | number;
  price: string | number;
  mileage: string;
  fuel: string;
  transmission: string;
  photos?: string[];
}

const CarCard = ({ 
  id, 
  image, 
  manufacturer, 
  model, 
  year, 
  price, 
  mileage, 
  fuel, 
  photos, 
  transmission 
}: CarCardProps) => {
  const [showReservation, setShowReservation] = useState(false);
  const navigate = useNavigate();

  const carId = id || `${manufacturer}-${model}-${year}`;

  const handleCardClick = () => {
    navigate(`/car/${carId}`); 
  };

  const handleReservation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReservation(true);
  };

  const images = photos && photos.length > 0 ? photos : [image];
  const uniqueId = `swiper-${carId}`; 

  return (
    <Card
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border cursor-pointer relative"
      onClick={handleCardClick}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: `.${uniqueId}-prev`,
            nextEl: `.${uniqueId}-next`,
          }}
          loop={images.length > 1}
          className="relative h-56"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
             
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-56 cursor-zoom-in group/image">
                    <img
                      src={getHighResImage(img)}
                      alt={`${manufacturer} ${model}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105"
                      loading="lazy"
                    />
                  
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/20">
                      <Maximize2 className="text-white w-8 h-8 drop-shadow-md" />
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black/90 border-none flex items-center justify-center">
                  <img
                    src={getHighResImage(img)}
                    alt="Zoomed Car"
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
    
            </SwiperSlide>
          ))}

          {images.length > 1 && (
            <>
              <div
                className={`${uniqueId}-prev swiper-button-prev absolute left-2 top-1/2 z-20 cursor-pointer`}
                onClick={(e) => e.stopPropagation()}
              />
              <div
                className={`${uniqueId}-next swiper-button-next absolute right-2 top-1/2 z-20 cursor-pointer`}
                onClick={(e) => e.stopPropagation()}
              />
            </>
          )}
        </Swiper>

        <style>{`
          .swiper-button-prev, .swiper-button-next {
            color: white !important;
            background: rgba(0,0,0,0.5);
            width: 32px; height: 32px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
          }
          .swiper-button-prev::after, .swiper-button-next::after {
            font-size: 14px !important; font-weight: bold;
          }
        `}</style>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {manufacturer} {model}
          </h3>
          <p className="text-3xl font-bold text-primary">
            {typeof price === 'number' ? `€${price.toLocaleString()}` : price}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Gauge className="h-4 w-4" />
            <span>{mileage}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Fuel className="h-4 w-4" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 border-2 border-muted-foreground rounded-sm flex items-center justify-center text-[8px] font-bold">M</div>
            <span>{transmission}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" variant="outline" onClick={handleCardClick}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Detajet
          </Button>
          <Button className="flex-1" variant="default" onClick={handleReservation}>
            Rezervo tani
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarCard;