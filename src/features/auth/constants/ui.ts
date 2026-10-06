import { fieldClassName, neonButtonClassName } from '@/features/landing/constants/ui';
import { cn } from '@/lib/utils';

export const authFieldClassName = cn(fieldClassName, 'w-full rounded-xl px-4');

export const authSubmitClassName = cn(
  neonButtonClassName,
  'w-full disabled:cursor-not-allowed disabled:opacity-50',
);

export const authErrorClassName =
  'rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm leading-relaxed text-red-300';

export const authLinkClassName =
  'font-semibold text-primary-400 transition-colors duration-500 ease-linear hover:text-primary-300';
