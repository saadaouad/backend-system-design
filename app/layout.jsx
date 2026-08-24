import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';

export const metadata = {
  title: 'Backend System Design',
  description: 'A practical system design workshop for scalable, reliable backend systems.'
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Layout
          navbar={<Navbar logo={<b>Backend System Design</b>} />}
          footer={<Footer>MIT {new Date().getFullYear()} © Saad Aouad</Footer>}
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
