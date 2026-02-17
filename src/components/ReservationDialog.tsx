import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Loader2, CheckCircle2 } from "lucide-react";

interface ReservationDialogProps {
  car: {
    id: string;
    name: string;
    image: string;
    price: string | number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({ car, open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  React.useEffect(() => {
    if (open) {
      setIsSuccess(false);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reservationData = {
        car_id: car.id,
        car_name: car.name,
        car_price: String(car.price),
        car_image: car.image,
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        message: formData.message,
        status: 'pending'
      };

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/encar?action=send-reservation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ reservation: reservationData })
      });

      if (!response.ok) throw new Error("Failed to send email");

      setIsSuccess(true);
      toast.success("Kërkesa u dërgua me sukses!");
      

      setTimeout(() => {
        onOpenChange(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsSuccess(false); 
      }, 2500);

    } catch (error: any) {
      console.error("Reservation error:", error);
      toast.error("Ndodhi një gabim. Ju lutem provoni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-lg relative animate-in fade-in zoom-in duration-200 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 hover:bg-muted"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold">Faleminderit!</h3>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Kërkesa juaj për <strong>{car.name}</strong> u dërgua. Agjenti ynë do t'ju kontaktojë së shpejti.
            </p>
          </div>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Rezervo {car.name}</CardTitle>
              <CardDescription>
                Plotëso të dhënat për të rezervuar këtë veturë.
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Emri dhe Mbiemri <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Emri juaj"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+383 44 XXX XXX"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mesazh (opsionale)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Pyetje shtesë..."
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting}
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 bg-muted/20 pt-4 rounded-b-lg">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                  Anulo
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Dërgohet...
                    </>
                  ) : (
                    "Dërgo Kërkesën"
                  )}
                </Button>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default ReservationDialog;