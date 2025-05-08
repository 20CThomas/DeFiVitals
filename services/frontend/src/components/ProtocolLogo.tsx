import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProtocolLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
}

export function ProtocolLogo({ src, alt, className, ...props }: ProtocolLogoProps) {
  return (
    <div className={cn('relative rounded-full overflow-hidden', className)} {...props}>
      <Image
        src={src}
        alt={alt}
        width={24}
        height={24}
        className="object-cover"
      />
    </div>
  );
} 