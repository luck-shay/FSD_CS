import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { DecisionProvider } from './context/DecisionContext';
import DecisionArena from './components/Arena/DecisionArena';
import Controls from './components/Controls/Controls';
import InsightPanel from './components/InsightPanel/InsightPanel';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2ecc71', // YES
    },
    secondary: {
      main: '#e74c3c', // NO
    },
    background: {
      default: '#1a1a2e',
      paper: '#16213e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <DecisionProvider>
        <div className="decision-arena-container">
          <DecisionArena />
          <InsightPanel />
          <Controls />
        </div>
      </DecisionProvider>
    </ThemeProvider>
  );
}

export default App;
