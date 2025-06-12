
import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { BHPHProvider } from "../contexts/BHPHContext";
import ThemeProvider from "../components/Providers/ThemeProvider";
import AuthWrapper from "../components/Auth/AuthWrapper";
import App from "../App";

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <BHPHProvider>
            <AuthWrapper>
              <App />
            </AuthWrapper>
          </BHPHProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
