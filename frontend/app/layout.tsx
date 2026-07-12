import "./globals.css";
import { UploadProvider } from "@/context/uploadContext";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <UploadProvider>
          {children}

          <Toaster
            position="top-right"
            reverseOrder={false}
          />
        </UploadProvider>
      </body>
    </html>
  );
}