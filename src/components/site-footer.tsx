import { Logo } from '@/components/logo';

export function SiteFooter() {
  return (
    <footer className="bg-blush mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row">
        <Logo className="text-3xl" />
        <p>Building trust, one beauty experience at a time.</p>
      </div>
    </footer>
  );
}
