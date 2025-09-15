import ScrollToTop from "@/components/common/ScrollTop";
import ClientLayout from "@/components/common/ClientLayout";
import { DM_Sans, Poppins } from "next/font/google";
import "../../public/scss/main.scss";
import "rc-slider/assets/index.css";

// DM_Sans font
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--body-font-family",
});

// Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--title-font-family",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`body ${poppins.variable} ${dmSans.variable}`}
        cz-shortcut-listen="false"
      >
        <div className="wrapper ovh">
          <ClientLayout>{children}</ClientLayout>
        </div>
        <ScrollToTop />
      </body>
    </html>
  );
}
