import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCarBrands, useCarModels } from "@/hooks/use-encar";
import background from "@/assets/background.jpg";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: currentYear - 1960 + 1 }, (_, i) => (currentYear - i).toString());
const PRICE_OPTIONS = ["5000", "10000", "15000", "20000", "30000", "50000", "75000", "100000"];

const Hero = () => {
  const navigate = useNavigate();
  
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [priceFrom, setPriceFrom] = useState<string>("");

  const { data: brands, isLoading: brandsLoading } = useCarBrands();
  const { data: models, isLoading: modelsLoading } = useCarModels(selectedBrand || null);

  useEffect(() => { setSelectedModel(""); }, [selectedBrand]);

  const handleSearch = () => {
    if (selectedBrand) {
      const params = new URLSearchParams();
      params.set('brand', selectedBrand);
      if (selectedModel) params.set('model', selectedModel);
      if (yearFrom) params.set('yearFrom', yearFrom);
      if (priceFrom) params.set('priceFrom', priceFrom);
      
      navigate(`/cars?${params.toString()}`);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 w-full h-full z-0">
        <img 
          src={background} 
          alt="Background" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background/90" />
      </div>

      <div className="relative z-10 w-full px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground drop-shadow-lg">Gjej veturën ideale</h1>
          <p className="text-xl md:text-2xl text-muted-foreground drop-shadow-md">Shfleto mijëra vetura nga Korea e Jugut</p>
        </div>

        <div className="w-full max-w-5xl mx-auto bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="h-12">{brandsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue placeholder="Brendi" />}</SelectTrigger>
              <SelectContent>{brands?.map((brand) => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
              <SelectTrigger className="h-12">{modelsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SelectValue placeholder="Modeli" />}</SelectTrigger>
              <SelectContent>{models?.map((model) => <SelectItem key={model} value={model}>{model}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={yearFrom} onValueChange={setYearFrom}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Viti nga" /></SelectTrigger>
              <SelectContent>{YEAR_OPTIONS.map((y) => <SelectItem key={`yf-${y}`} value={y}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={priceFrom} onValueChange={setPriceFrom}>
              <SelectTrigger className="h-12"><SelectValue placeholder="Çmimi nga (€)" /></SelectTrigger>
              <SelectContent>{PRICE_OPTIONS.map((p) => <SelectItem key={`pf-${p}`} value={p}>€{parseInt(p).toLocaleString()}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <Button className="w-full h-12 text-lg" size="lg" onClick={handleSearch} disabled={!selectedBrand}>
            <Search className="mr-2 h-5 w-5" /> Kërko veturat
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;