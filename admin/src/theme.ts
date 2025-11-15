import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#1B3B9C' },
    secondary: { main: '#29ABE2' },
    error: { main: '#DC2626' },
    warning: { main: '#F59E0B' },
    success: { main: '#16A34A' },
    background: { default: '#F8FAFC', paper: '#FFFFFF' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    h6: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(90deg, #1B3B9C 0%, #29ABE2 100%)',
          boxShadow: '0 6px 20px rgba(27,59,156,0.2)',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { backgroundColor: '#F1F5F9' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 10 },
      },
    },
  },
})

export default theme
