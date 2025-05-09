"use client";

import Link from "next/link";
import { ExternalLink, Twitter, MessagesSquare, Github } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-zinc-900 border-t border-zinc-800 py-6 px-4 ${className}`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DeFiVitals</h3>
            <p className="text-zinc-400 text-sm">
              DeFiVitals is the largest TVL aggregator for DeFi (Decentralized Finance).
              Our data is fully open-source and maintained by a team of passionate individuals and contributors from hundreds of protocols.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  Methodology
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  Contribute
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  List your protocol
                  <ExternalLink size={12} />
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  API Documentation
                  <ExternalLink size={12} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Developers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  <Github size={14} className="mr-1" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  Open source
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  Bug bounty
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  API
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  <Twitter size={14} className="mr-1" />
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  <MessagesSquare size={14} className="mr-1" />
                  Discord
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  Press inquiries
                </Link>
              </li>
              <li>
                <Link href="#" className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
                  Terms of service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-800 text-center text-zinc-400 text-sm">
          <p>© {new Date().getFullYear()} DeFiVitals. All rights reserved. This is a clone for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
