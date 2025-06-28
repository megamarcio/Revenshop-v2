import React from 'react';
import { Instagram } from 'lucide-react';
import { DEVELOPER_INFO } from '../../config/version';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Informações do Desenvolvedor */}
          <div className="flex flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
            <span>Desenvolvido por</span>
            <div className="flex items-center gap-2 font-medium text-foreground">
              <span>{DEVELOPER_INFO.name}</span>
              <a 
                href={DEVELOPER_INFO.instagramUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                aria-label="Instagram do desenvolvedor"
              >
                <Instagram className="h-4 w-4" />
                <span>{DEVELOPER_INFO.instagram}</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            {DEVELOPER_INFO.copyright}
          </div>
        </div>

        {/* Linha adicional com informações técnicas */}
        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Sistema de Gestão Automotiva • Desenvolvido com React, TypeScript e Supabase
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 