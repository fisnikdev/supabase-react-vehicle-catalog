import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, RotateCcw, LayoutGrid, ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCarBrands, useCarModels, useCarList, EncarCar } from "@/hooks/use-encar";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 40;

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => (currentYear - i).toString());
const PRICE_OPTIONS = ["5000", "10000", "15000", "20000", "30000", "50000", "75000", "100000"];
const MILEAGE_OPTIONS = ["10000", "30000", "50000", "80000", "100000", "150000", "200000"];

const EXTERIOR_COLORS = [
  "White", "Black", "Grey", "Silver", "Blue", "Red", 
  "Brown", "Beige", "Green", "Yellow", "Orange", "Purple", 
  "Gold", "Champagne", "Ivory", "Pearl White"
];

const Cars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recent");
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [selectedModel, setSelectedModel] = useState(searchParams.get("model") || "");
  const [yearFrom, setYearFrom] = useState(searchParams.get("yearFrom") || "");
  const [yearTo, setYearTo] = useState(searchParams.get("yearTo") || "");
  const [priceFrom, setPriceFrom] = useState(searchParams.get("priceFrom") || "");
  const [priceTo, setPriceTo] = useState(searchParams.get("priceTo") || "");
  const [mileageFrom, setMileageFrom] = useState(searchParams.get("mileageFrom") || "");
  const [mileageTo, setMileageTo] = useState(searchParams.get("mileageTo") || "");
  const [fuelType, setFuelType] = useState(searchParams.get("fuelType") || "");
  const [transmission, setTransmission] = useState(searchParams.get("transmission") || "");
  const [exteriorColor, setExteriorColor] = useState(searchParams.get("exteriorColor") || "");
  const [noAccident, setNoAccident] = useState(searchParams.get("noAccident") || "");

  const { data: brands, isLoading: brandsLoading } = useCarBrands();
  const { data: models, isLoading: modelsLoading } = useCarModels(selectedBrand || null);

  const { data: carsData, isLoading: carsLoading, error } = useCarList(
    selectedBrand || null,
    selectedModel || null,
    ITEMS_PER_PAGE,
    page,
    yearFrom ? parseInt(yearFrom) : undefined,
    priceFrom ? Math.round(parseInt(priceFrom) * 0.15) : undefined,
    yearTo ? parseInt(yearTo) : undefined,
    priceTo ? Math.round(parseInt(priceTo) * 0.15) : undefined,
    mileageFrom ? parseInt(mileageFrom) : undefined, 
    mileageTo ? parseInt(mileageTo) : undefined,     
    fuelType || undefined,
    transmission || undefined,
    exteriorColor || undefined,
    noAccident === "true" ? true : noAccident === "false" ? false : undefined,
    keyword,
    sortBy
  );

  useEffect(() => {
    const params: Record<string, string> = { brand: selectedBrand };
    if (selectedModel) params.model = selectedModel;
    if (yearFrom) params.yearFrom = yearFrom;
    if (yearTo) params.yearTo = yearTo;
    if (priceFrom) params.priceFrom = priceFrom;
    if (priceTo) params.priceTo = priceTo;
    if (mileageFrom) params.mileageFrom = mileageFrom;
    if (mileageTo) params.mileageTo = mileageTo;
    if (fuelType) params.fuelType = fuelType;
    if (transmission) params.transmission = transmission;
    if (exteriorColor) params.exteriorColor = exteriorColor;
    if (noAccident) params.noAccident = noAccident;
    if (keyword) params.keyword = keyword;
    if (sortBy) params.sort = sortBy;
    setSearchParams(params);
  }, [selectedBrand, selectedModel, yearFrom, yearTo, priceFrom, priceTo, mileageFrom, mileageTo, fuelType, transmission, exteriorColor, noAccident, keyword, sortBy, setSearchParams]);

  const sortedCars = carsData?.cars || [];

  const resetFilters = () => {
    setSelectedBrand(""); setSelectedModel(""); setYearFrom(""); setYearTo(""); 
    setPriceFrom(""); setPriceTo(""); setMileageFrom(""); setMileageTo("");
    setExteriorColor(""); setFuelType(""); setTransmission(""); setKeyword("");
    setNoAccident(""); setPage(0); setSortBy("recent");
  };

  const formatYear = (rawYear: number | string) => {
    const str = String(rawYear);
    if (str.length === 6) return `${str.slice(4)}/${str.slice(0, 4)}`;
    return str;
  };

  const formatMileage = (km: number) => {
  if (!km) return '0 km';
  return `${km.toLocaleString('de-DE')} km`; 
};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 px-4 bg-card border-b shadow-sm z-10 relative">
        <div className="container mx-auto space-y-4">
          <h1 className="text-3xl font-bold">Kërko Veturat</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select value={selectedBrand} onValueChange={(v) => { setSelectedBrand(v); setSelectedModel(""); setPage(0); }}>
              <SelectTrigger className="h-12">{brandsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue placeholder="Brendi" />}</SelectTrigger>
              <SelectContent>{brands?.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>

            <Select value={selectedModel} onValueChange={(v) => { setSelectedModel(v); setPage(0); }} disabled={!selectedBrand}>
              <SelectTrigger className="h-12">{modelsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue placeholder="Modeli" />}</SelectTrigger>
              <SelectContent>{models?.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>

            <Select value={yearFrom} onValueChange={(v) => { setYearFrom(v); setPage(0); }}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Viti nga" /></SelectTrigger>
              <SelectContent>{YEAR_OPTIONS.map(y => <SelectItem key={`yf-${y}`} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>

            <Select value={priceTo} onValueChange={(v) => { setPriceTo(v); setPage(0); }}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Çmimi deri (€)" /></SelectTrigger>
              <SelectContent>{PRICE_OPTIONS.map(p => <SelectItem key={`pt-${p}`} value={p}>€{parseInt(p).toLocaleString()}</SelectItem>)}</SelectContent>
            </Select>

            <Select value={exteriorColor} onValueChange={(v) => { setExteriorColor(v); setPage(0); }}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Ngjyra jashtme" /></SelectTrigger>
              <SelectContent>{EXTERIOR_COLORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3">
             <div className="relative h-10">
              <Input 
                placeholder="Fjalë kyçe (AMG, S-Line)" 
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value); setPage(0); }}
                className="h-10 text-xs"
              />
            </div>

            <Select value={fuelType} onValueChange={(v) => { setFuelType(v); setPage(0); }}>
              <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Karburanti" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Gasoline">Benzinë</SelectItem>
                <SelectItem value="Diesel">Naftë</SelectItem>
                <SelectItem value="Hybrid">Hibrid</SelectItem>
                <SelectItem value="Electric">Elektrik</SelectItem>
              </SelectContent>
            </Select>

            <Select value={transmission} onValueChange={(v) => { setTransmission(v); setPage(0); }}>
              <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Transmisioni" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatik</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={yearTo} onValueChange={(v) => { setYearTo(v); setPage(0); }}>
              <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Viti deri" /></SelectTrigger>
              <SelectContent>{YEAR_OPTIONS.map(y => <SelectItem key={`yt-${y}`} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>

            <Select value={mileageTo} onValueChange={(v) => { setMileageTo(v); setPage(0); }}>
              <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Km deri" /></SelectTrigger>
              <SelectContent>{MILEAGE_OPTIONS.map(m => <SelectItem key={`mt-${m}`} value={m}>{parseInt(m).toLocaleString()} km</SelectItem>)}</SelectContent>
            </Select>

            <Select value={noAccident} onValueChange={(v) => { setNoAccident(v); setPage(0); }}>
              <SelectTrigger className="h-10 text-xs"><SelectValue placeholder="Aksidentet" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Pa aksidente</SelectItem>
                <SelectItem value="false">Me aksidente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" className="h-10 text-xs text-red-500 hover:text-red-700" onClick={resetFilters}>
              <RotateCcw className="mr-1 h-3 w-3" /> Pastro
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-muted/30 p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {carsLoading ? "..." : carsData?.total || 0} vetura u gjetën
            </span>
            {selectedBrand && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {selectedBrand} {selectedModel}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-sm font-medium whitespace-nowrap text-muted-foreground">
              <ListFilter className="h-4 w-4 inline mr-1" />
              Rendit:
            </span>
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(0); }}>
              <SelectTrigger className="w-full md:w-[220px] h-11 border-primary/50 bg-background shadow-sm hover:border-primary transition-colors">
                <SelectValue placeholder="Zgjedh renditjen" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recent">🕰️ Më të fundit</SelectItem>
                <SelectItem value="price-asc">💰 Çmimi (Ulët - Lart)</SelectItem>
                <SelectItem value="price-desc">💎 Çmimi (Lart - Ulët)</SelectItem>
                <SelectItem value="year-desc">📅 Viti (Më të reja)</SelectItem>
                <SelectItem value="year-asc">🕰️ Viti (Më të vjetra)</SelectItem>
                <SelectItem value="mileage-asc">🏎️ Kilometrazhi (Ulët)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {carsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Duke kërkuar veturat...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-destructive font-medium text-lg">Gabim gjatë ngarkimit të veturave.</p>
            <Button variant="link" onClick={() => window.location.reload()}>Provo përsëri</Button>
          </div>
        ) : sortedCars.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-xl border-2 border-dashed">
            <p className="text-muted-foreground text-xl font-medium">Nuk u gjet asnjë veturë me këto filtra.</p>
            <p className="text-muted-foreground mt-2">Provo të heqësh filtrin e ngjyrës ose çmimit.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Added explicit type (car: EncarCar) here */}
              {sortedCars.map((car: EncarCar) => {
                const formattedMileage = formatMileage(car.mileage);
                return (
                  <CarCard 
                    key={car.id} 
                    {...car} 
                    id={String(car.id)}
                    year={formatYear(car.year)}
                    fuel={car.fuelType}
                    mileage={formattedMileage} 
                    price={`€${car.priceEur.toLocaleString('de-DE')}`} 
                  />
                );
              })}
            </div>
            
            <div className="flex justify-center items-center gap-6 mt-12 mb-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || carsLoading}
                className="w-32"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Prapa
              </Button>
              <span className="text-sm font-medium">Faqja {page + 1}</span>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setPage(p => p + 1)}
                disabled={sortedCars.length < ITEMS_PER_PAGE || carsLoading}
                className="w-32"
              >
                Para <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cars;