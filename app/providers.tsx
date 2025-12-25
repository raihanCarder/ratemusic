"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Nav from "@/components/Nav";
import PageFooter from "@/components/PageFooter";

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
        <Nav />
        {children}
        <PageFooter />
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
