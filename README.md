# DeFiVitals

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---
## Architecture

For the purpose of a class assignment, we implemented an edge computing architecture using a Distributed Virtualized Infrastructure with a Secure Networking Overlay. This project demonstrates how edge devices in different physical locations can securely operate as a cohesive unit by leveraging virtualization, container orchestration, and VPN-based communication.

We built the infrastructure using:

- Proxmox VE 8.x to host virtual machines across two physically separated locations

- Tailscale to establish a zero-trust, encrypted mesh VPN between all nodes (Proxmox and VMs)

- Corosync for Proxmox cluster communication over Tailscale IPs

- Kubernetes (via kubeadm) to orchestrate container workloads across both nodes

Two Ubuntu virtual machines (one Kubernetes control-plane and one worker node) were deployed, each running inside a Proxmox VM at different sites. These VMs were connected to the same Tailscale Tailnet, allowing secure, private communication without any public IPs or port forwarding. Additionally, we connected an AWS cloud instance as an additional Kubernetes node to demonstrate the hybrid, cloud-edge capability of this system.

This architecture demonstrates:

- Low-latency cluster communication over Tailscale

- Secure, scalable, and remotely manageable infrastructure

- Hybrid cloud-edge Kubernetes deployments

You can view the detailed infrastructure setup and step-by-step instructions [Proxmox & Kubernetes Cluster over Tailscale VPN](https://github.com/Zanderskier/Proxmox-Kubernetes-Cluster-over-Tailscale-VPN/blob/main/README.md) 
 
<!-- Test commit to verify GitHub attribution -->
