import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00BFFF', // Adjust color as needed
    },
    secondary: {
      main: '#FF8C00', // Adjust color as needed
    },
  },
  typography: {
    fontFamily: [
      'Roboto', // Specify your preferred font-family
      'Mono',
    ].join(','),
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e0e0e0', // Adjust table cell border
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f5f5f5', // Alternate row background color
          },
        },
      },
    },
  },
});

export default theme;
