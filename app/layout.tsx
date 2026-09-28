import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ORVIA Brand Control',
  description: 'Internal ORVIA brand, social, media, voice and publishing control workspace',
  applicationName: 'ORVIA Brand Control',
  robots: { index:false, follow:false, noarchive:true, nosnippet:true }
};

export const viewport: Viewport = { themeColor:'#0B2450', colorScheme:'light' };

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}
