import '../styles/globals.css'; // Importing the global styles
import '../styles/style.css'; 

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;