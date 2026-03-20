export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex min-h-screen flex-col items-center justify-center  overflow-x-hidden">
      {children}
    </div>
  );
}
