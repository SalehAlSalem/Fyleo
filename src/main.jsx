import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import "@fontsource/comfortaa";
import "@fontsource/comfortaa/400.css";
import "@fontsource/comfortaa/500.css";
import "@fontsource/comfortaa/600.css";
import "@fontsource/comfortaa/700.css";
import './styles/globals.css';

// Simple Error Boundary to avoid a blank white screen on runtime errors.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You can also log to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h1>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global handlers to surface uncaught errors (useful on Vercel to see logs)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // Make sure errors appear in Vercel logs
    // eslint-disable-next-line no-console
    console.error('Global error', e.error || e.message || e);
  });
  window.addEventListener('unhandledrejection', (e) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection', e.reason || e);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
