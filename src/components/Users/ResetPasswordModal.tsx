
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ open, onOpenChange, defaultEmail }) => {
  const [email, setEmail] = useState(defaultEmail || "");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    const redirectTo = `${window.location.origin}/`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao enviar e-mail",
        description: error.message || "Não foi possível iniciar o reset de senha.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "E-mail enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px]">
        <DialogHeader>
          <DialogTitle>Resetar Senha</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-2">
          <Input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            disabled={!!defaultEmail}
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="button" onClick={handleResetPassword} disabled={!email || loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
            Enviar e-mail de reset
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordModal;

