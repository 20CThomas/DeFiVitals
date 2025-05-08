import Image from 'next/image';

interface ProtocolLogoProps {
  protocol: string;
  size?: number;
}

export function ProtocolLogo({ protocol, size = 24 }: ProtocolLogoProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={`/protocols/${protocol.toLowerCase()}.png`}
        alt={`${protocol} logo`}
        fill
        className="object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/protocols/default.png';
        }}
      />
    </div>
  );
} 