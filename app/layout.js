
export const metadata = {
  title: "Team 36 - Hypertension Monitor",
  description: "Supports pregnant patients monitoring blood pressure",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
