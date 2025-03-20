import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a6da7', // Blue - representing trust and confidence
      light: '#7b9bd9',
      dark: '#1a4377',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f9a826', // Warm orange - representing energy and enthusiasm
      light: '#ffc95c',
      dark: '#c27900',
      contrastText: '#000000',
    },
    success: {
      main: '#66bb6a', // Green for achievements and progress
      light: '#98ee99',
      dark: '#338a3e',
    },
    info: {
      main: '#29b6f6', // Light blue for information
      light: '#73e8ff',
      dark: '#0086c3',
    },
    warning: {
      main: '#ffa726', // Orange for warnings
      light: '#ffd95b',
      dark: '#c77800',
    },
    error: {
      main: '#ef5350', // Red for errors
      light: '#ff867c',
      dark: '#b61827',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#718096',
    },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.07)',
    '0px 6px 8px rgba(0, 0, 0, 0.08)',
    '0px 8px 12px rgba(0, 0, 0, 0.1)',
    '0px 10px 14px rgba(0, 0, 0, 0.12)',
    '0px 12px 16px rgba(0, 0, 0, 0.14)',
    '0px 14px 18px rgba(0, 0, 0, 0.16)',
    '0px 16px 20px rgba(0, 0, 0, 0.18)',
    '0px 18px 22px rgba(0, 0, 0, 0.2)',
    '0px 20px 24px rgba(0, 0, 0, 0.22)',
    '0px 22px 26px rgba(0, 0, 0, 0.24)',
    '0px 24px 28px rgba(0, 0, 0, 0.26)',
    '0px 26px 30px rgba(0, 0, 0, 0.28)',
    '0px 28px 32px rgba(0, 0, 0, 0.3)',
    '0px 30px 34px rgba(0, 0, 0, 0.32)',
    '0px 32px 36px rgba(0, 0, 0, 0.34)',
    '0px 34px 38px rgba(0, 0, 0, 0.36)',
    '0px 36px 40px rgba(0, 0, 0, 0.38)',
    '0px 38px 42px rgba(0, 0, 0, 0.4)',
    '0px 40px 44px rgba(0, 0, 0, 0.42)',
    '0px 42px 46px rgba(0, 0, 0, 0.44)',
    '0px 44px 48px rgba(0, 0, 0, 0.46)',
    '0px 46px 50px rgba(0, 0, 0, 0.48)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07)',
          '&:hover': {
            boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.09)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          overflow: 'visible',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 24,
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: 'none',
          minWidth: 100,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
});

export default theme;
