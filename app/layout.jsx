import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import 'nextra-theme-docs/style.css';
import './globals.css';

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
          footer={
            <Footer>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%'
                }}
              >
                <span>MIT {new Date().getFullYear()} © Saad Aouad</span>
                <a
                  href="https://github.com/saadaouad/backend-system-design"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  style={{ display: 'inline-flex' }}
                >
                  <img
                    src="/assets/github.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="github-footer-icon"
                  />
                </a>
              </div>
            </Footer>
          }
          pageMap={await getPageMap()}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
