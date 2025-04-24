# Splitora

A modern web application for managing and splitting shared subscription costs between friends, roommates, or coworkers.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/splitora.git
cd splitora
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add the following:
```env
# Add your environment variables here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
splitora/
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # Reusable UI components
│   ├── lib/          # Utility functions and configurations
│   └── styles/       # Global styles
├── public/           # Static assets
└── prisma/          # Database schema and migrations
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
