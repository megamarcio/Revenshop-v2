
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginForm = () => {
  const { language, setLanguage, t } = useLanguage();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', email);
    setIsLoading(true);

    try {
      const success = await signIn(email, password);
      console.log('Login result:', success);
      
      if (success) {
        console.log('Login successful, user should be redirected');
      } else {
        toast({
          title: t('error'),
          description: "Credenciais inválidas. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('error'),
        description: "Erro ao fazer login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-revenshop-light to-revenshop-accent/20 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Selector */}
        <div className="flex justify-center">
          <Select value={language} onValueChange={(value: 'pt' | 'es' | 'en') => setLanguage(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">🇧🇷 Português</SelectItem>
              <SelectItem value="es">🇪🇸 Español</SelectItem>
              <SelectItem value="en">🇺🇸 English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logo */}
        <div className="text-center">
          <div className="bg-revenshop-primary p-4 rounded-xl inline-block mb-4">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-revenshop-primary">REVENSHOP</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t('loginTitle')}</CardTitle>
            <p className="text-center text-gray-600">{t('loginSubtitle')}</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-revenshop-primary hover:bg-revenshop-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? t('loading') : t('login')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer com informações de contato */}
        <div className="text-center text-xs text-gray-500 space-y-2 mt-8">
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center space-x-4">
              <span>Email: r3cava@gmail.com</span>
              <span>Suporte: +1 407-457-8250</span>
            </div>
            <div>
              <a 
                href="http://wa.me/14074578250" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <p>© REVENSHOP® - Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
