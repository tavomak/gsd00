import { IBM_Plex_Mono } from 'next/font/google';

const primaryFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

export default primaryFont;
