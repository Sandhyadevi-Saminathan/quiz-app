import '../styles/globals.css'; // Importing the global styles
import '../styles/style.css'; 

function MyApp({ Component, pageProps }) {
  const [apiError, setApiError] = useState(null);

  return (
    <div>
      {apiError && <p style={{ color: 'red' }}>{apiError}</p>}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;