import { cn } from '@/lib/utils';

/** The Swee wordmark: coral script, as in the Swee 2.0 deck. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-script text-coral text-4xl leading-none select-none',
        className
      )}
    >
      Swee
    </span>
  );
}
