import { GoogleTagManager } from '@next/third-parties/google';
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar';
import poppins from '@/utils/fonts';
import { environments } from '@/utils/constants';
import { SiteProvider } from '@/contexts/SiteContext';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/main.css';

function App({ Component, pageProps }) {
  return (
    <SiteProvider initialSite={pageProps.siteKey}>
      <style jsx global>
        {`
          :root {
            --font-poppins: ${poppins.style.fontFamily};
          }
        `}
      </style>
      <Component {...pageProps} />
      {process.env.NEXT_PUBLIC_ENVIRONMENT_KEY === environments.production && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM} />
      )}
      <ProgressBar
        height="4px"
        color="#48B694"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </SiteProvider>
  );
}

export default App;
