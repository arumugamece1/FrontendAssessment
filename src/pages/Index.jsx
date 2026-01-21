import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import { HierarchicalTable } from "@/components/HierarchicalTable";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          py: 4,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <HierarchicalTable />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Index;
