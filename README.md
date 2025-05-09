# DeFiVitals

A microservices-based DeFi analytics platform that provides real-time insights into various DeFi protocols and chains.

## Architecture

The platform consists of the following microservices:

- **Frontend Service** (Port 3000): Next.js web application
- **API Service** (Port 3001): DeFi data fetching and processing
- **Data Service** (Port 3002): Firebase/Firestore operations
- **Analytics Service** (Port 3003): Metrics collection and monitoring
- **Redis** (Port 6379): Shared caching layer

## Prerequisites

- Docker and Docker Compose
- Node.js 20.x or later
- npm 10.x or later

## Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:
```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# Other Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DATA_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_ANALYTICS_URL=http://localhost:3003
```

## Running the Application

### Development Mode

1. Start all services:
```bash
docker-compose up --build
```

2. Access the application:
- Frontend: http://localhost:3000
- API Service: http://localhost:3001
- Data Service: http://localhost:3002
- Analytics Service: http://localhost:3003

## Development

### Frontend Service
```bash
cd services/frontend
npm install
npm run dev
```

### API Service
```bash
cd services/api
npm install
npm run dev
```

### Data Service
```bash
cd services/data
npm install
npm run dev
```

### Analytics Service
```bash
cd services/analytics
npm install
npm run dev
```

## API Endpoints

### API Service (Port 3001)
- `GET /api/chains`: List all supported chains
- `GET /api/chains/:chainId`: Get chain details
- `GET /api/protocols`: List all protocols
- `GET /api/protocols/:protocolId`: Get protocol details

### Data Service (Port 3002)
- `GET /data/chains`: Get chain data from Firestore
- `GET /data/protocols`: Get protocol data from Firestore
- `POST /data/analytics`: Store analytics data

### Analytics Service (Port 3003)
- `GET /metrics`: Prometheus metrics
- `GET /health`: Health check endpoint
- `POST /analytics`: Store analytics data

## Monitoring

- Prometheus metrics available at: http://localhost:3003/metrics
- Redis monitoring available at: http://localhost:6379

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
## Key Contributors
- Charles Thomas (cthomas5@csus.edu) - Frontend Developer
- Alexander Fails (afails@csus.edu) - Network Architect
- Andrei Bayani (adbayani@csus.edu) - Deployment Tester
- Rhea Dsouza (rheabenedictadsouza@csus.edu) - Firebase Implementation
- Abubaker Sayyed (abubakersayyed@csus.edu) - Containerization
