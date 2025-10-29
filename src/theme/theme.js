
import { createTheme } from '@mui/material/styles';

// Create a theme instance for the TheatreBudget application.
const theme = createTheme({
  palette: {
    primary: {
      main: '#0277bd', // A deep, professional blue
    },
    secondary: {
      main: '#0097a7', // A complementary vibrant teal
    },
    background: {
      default: '#f4f6f8', // A very light grey for the main background
      paper: '#ffffff',   // White for cards and surfaces
    },
    text: {
      primary: '#263238',   // Dark grey for primary text
      secondary: '#546e7a', // Lighter grey for secondary text
    },
    success: {
      main: '#2e7d32',
    },
    error: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.8rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
        fontSize: '1.2rem',
        fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none', // Buttons with normal capitalization
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // A softer, more modern shadow
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                boxShadow: 'none',
                borderBottom: '1px solid #e0e0e0'
            }
        }
    }
  },
});

export default theme;
