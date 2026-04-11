"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <Toaster
          toastOptions={{
            style: {
              textAlign: "center",
            },
          }}
        />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
