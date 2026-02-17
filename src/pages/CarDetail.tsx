import {
  ArrowLeft,
  Calendar,
  Gauge,
  Fuel,
  Palette,
  Settings,
  MapPin,
  Shield,
  CheckCircle2,
  Sun,
  Key,
  Lightbulb,
  Radar,
  Armchair,
  Camera,
  Disc,
  Bluetooth,
  Wind,
  Music,
  Zap,
  Loader2,
  Maximize2
} from "lucide-react";

import ReservationDialog from "@/components/ReservationDialog";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarDetail } from "@/hooks/use-encar";
// We use the util we just fixed to guarantee high quality
import { getHighResImage } from "@/lib/utils"; 
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ENCAR_OPTIONS } from "@/lib/encar-options";

// Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const translateToAlbanian = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes("sunroof") || t.includes("썬루프")) return "Tavan Xhami";
  if (t.includes("navigat") || t.includes("내비")) return "Navigacion";
  if (t.includes("smart key") || t.includes("스마트키")) return "Çelës i Mençur";
  if (t.includes("leather") || t.includes("가죽")) return "Ulëse Lëkure";
  if (t.includes("heated") || t.includes("열선")) return "Ulëse me Ngrohje";
  if (t.includes("ventil") || t.includes("통풍")) return "Ulëse me Ftohje";
  if (t.includes("camera") || t.includes("카메라")) return "Kamerë";
  if (t.includes("sensor") || t.includes("감지")) return "Sensorë Parkimi";
  if (t.includes("wheel") || t.includes("휠")) return "Timon me Ngrohje";
  if (t.includes("trunk") || t.includes("트렁크")) return "Bagazh Elektrik";
  if (t.includes("cruise") || t.includes("크루즈")) return "Cruise Control";
  if (t.includes("led") || t.includes("headlamp")) return "Drita LED";
  if (t.includes("memory") || t.includes("메모리")) return "Ulëse me Memorie";
  if (t.includes("bluetooth")) return "Bluetooth";
  if (t.includes("hud")) return "Head-Up Display";
  if (t.includes("abs")) return "ABS";
  return text;
};

const getIconForOption = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("tavan")) return Sun;
  if (n.includes("navigacion")) return MapPin;
  if (n.includes("çelës")) return Key;
  if (n.includes("drita") || n.includes("led")) return Lightbulb;
  if (n.includes("sensor") || n.includes("parkim")) return Radar;
  if (n.includes("ulëse") || n.includes("ngrohje")) return Armchair;
  if (n.includes("kamerë")) return Camera;
  if (n.includes("timon")) return Disc;
  if (n.includes("bluetooth")) return Bluetooth;
  if (n.includes("ajër") || n.includes("klim")) return Wind;
  if (n.includes("audio")) return Music;
  if (n.includes("elektrik")) return Zap;
  if (n.includes("siguri") || n.includes("abs")) return Shield;
  return CheckCircle2;
};

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: car, isLoading, error } = useCarDetail(id);
  const [showReservation, setShowReservation] = useState(false);

  const allFlattenedOptions = useMemo(() => {
    return ENCAR_OPTIONS.options.reduce((acc: any[], opt: any) => {
      if (opt.subOptions) return [...acc, ...opt.subOptions];
      return [...acc, opt];
    }, []);
  }, []);

  const formatMileage = (km: number) => {
    if (km >= 1000) return `${Math.round(km / 1000)}K km`;
    return `${km} km`;
  };

  const images = useMemo(() => {
    if (!car) return [];
    let imgs: string[] = [];
    if (car.photos?.length) imgs = car.photos.map((img: any) => getHighResImage(img));
    else if (car.images?.length) imgs = car.images.map((img: string) => getHighResImage(img));
    else if (car.image) imgs = [getHighResImage(car.image)];
    return Array.from(new Set(imgs.filter(Boolean)));
  }, [car]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Vetura nuk u gjet</h1>
          <Button onClick={() => navigate('/cars')}>Kthehu te Veturat</Button>
        </div>
      </div>
    );
  }

  const carName = `${car.manufacturer} ${car.model} ${car.badge || ''}`;
  const formattedPrice = car.priceEur ? `€${car.priceEur.toLocaleString('de-DE')}` : "Çmimi me marrëveshje";
  const year = String(car.year).slice(0, 4);

  const optionList: string[] = Array.isArray(car.options) ? car.options : [];
  
  const resolvedOptions = optionList.map((opt) => {
    if (!isNaN(Number(opt))) {
       const found = allFlattenedOptions.find((o: any) => o.optionCd === String(opt));
       if (found) return translateToAlbanian(found.optionName || found.name || "");
    }
    return translateToAlbanian(String(opt));
  }).filter(name => name && name.trim() !== "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kthehu
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT SIDE: CAROUSEL WITH ZOOM */}
          <div className="space-y-6">
             <div className="relative rounded-xl overflow-hidden shadow-lg border bg-black/5 group">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  loop={images.length > 1}
                  className="w-full h-[350px] sm:h-[450px]"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="relative w-full h-full cursor-zoom-in group/image">
                            <img
                              src={img}
                              alt={`${carName} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Zoom Hint Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/20">
                              <Maximize2 className="text-white w-12 h-12 drop-shadow-md" />
                            </div>
                          </div>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-black/90 border-none flex items-center justify-center">
                          <img
                            src={img}
                            alt="Zoomed Car"
                            className="max-w-full max-h-[90vh] object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                    </SwiperSlide>
                  ))}
                </Swiper>
             </div>

             {/* Thumbnail Strip (Optional - kept simple for now) */}
             <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, idx) => (
                   <div key={idx} className="aspect-[4/3] rounded-md overflow-hidden opacity-70 hover:opacity-100 cursor-pointer border">
                      <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                   </div>
                ))}
             </div>
          </div>

          {/* RIGHT SIDE: DETAILS */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-foreground mb-2">{carName}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-lg px-3 py-1">{year}</Badge>
                    <Badge variant="outline" className="text-lg px-3 py-1">{car.fuelType}</Badge>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <p className="text-4xl font-bold text-primary">{formattedPrice}</p>
                  </div>
                  <Button className="w-full text-lg h-12" size="lg" onClick={() => setShowReservation(true)}>
                    Rezervo këtë veturë
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Specifikime</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Viti</p><p className="font-semibold">{year}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Km</p><p className="font-semibold">{formatMileage(car.mileage)}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Fuel className="h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Karburanti</p><p className="font-semibold">{car.fuelType}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Settings className="h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Transmisioni</p><p className="font-semibold">{car.transmission}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Palette className="h-5 w-5 text-primary" />
                    <div><p className="text-xs text-muted-foreground">Ngjyra</p><p className="font-semibold">{car.color}</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Zap className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Kubikazha</p>
                      <p className="font-semibold">{car.displacement ? `${car.displacement}cc` : "N/A"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {resolvedOptions.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Pajisjet</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {resolvedOptions.map((optionName, idx) => {
                      const Icon = getIconForOption(optionName);
                      return (
                        <div key={idx} className="flex items-center gap-3 p-2 border-b last:border-b-0 md:border-b-0">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                            <Icon size={16} />
                          </span>
                          <span className="font-medium text-sm">{optionName}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {car.description && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Përshkrimi</h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-sm">
                    {car.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-muted py-12 px-4 mt-20 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="text-sm">© 2026 Vetrix Auto. Të gjitha drejtat të rezervuara.</p>
        </div>
      </footer>

      <ReservationDialog
        open={showReservation}
        onOpenChange={setShowReservation}
        car={{
          id: String(car.id),
          name: carName,
          image: images[0] || '',
          price: formattedPrice,
        }}
      />
    </div>
  );
};

export default CarDetail;