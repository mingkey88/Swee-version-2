export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-blush flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
