# Splitora - Shared Subscription Management

## Overview
Splitora is a modern web application designed to simplify the management and cost-sharing of subscription services among groups of friends, roommates, or coworkers. The platform provides an intuitive interface for tracking, splitting, and managing shared subscription costs while ensuring transparency and accountability among group members. Our design philosophy emphasizes positive reinforcement through green aesthetics and clear savings visualization to encourage long-term user engagement.

## Core User Flow

1. **Authentication**
   - Users sign up/sign in via email
   - Secure authentication handled through Supabase
   - Referral system for inviting new users

2. **Dashboard**
   - Overview of active subscriptions
   - Quick access to subscription management
   - Personal savings tracker with visual progress indicators
   - Referral status and rewards

3. **Subscription Marketplace**
   - Browse popular subscription services (Netflix, Spotify, NordVPN, etc.)
   - View detailed pricing information for each service
   - See available vacancies in existing plans
   - Option to host a new plan or join existing ones
   - Filter and search functionality

4. **Subscription Management**
   - Create new subscriptions with preset options
   - Invite users via email or shareable links
   - View payment responsibilities and group members
   - Track payment history and upcoming dues

5. **Payment Processing**
   - Stripe integration for secure payments
   - Support for auto-pay options
   - Automated payment reminders
   - Billing history tracking

6. **User Management**
   - Role-based access control:
     - Admin: Full access to subscription management
     - Member: Limited access to group features
     - Invited User: View-only access until joined
   - User settings for profile and payment method management

## Technical Stack

- **Frontend**: Next.js 15 with App Router
- **Styling**: TailwindCSS
- **Database**: Prisma + PostgreSQL
- **Payment Processing**: Stripe
- **Authentication**: Supabase
- **Hosting**: Vercel

## Future Features

1. **Communication**
   - In-app group chat for subscription-related discussions
   - Push notifications for important updates

2. **Organization**
   - Subscription tagging system (e.g., "Home", "Work")
   - Custom categories for better organization

3. **Payment Management**
   - Late payment tracking and reporting
   - Automated late fee calculations
   - Payment dispute resolution system

4. **Analytics**
   - Spending insights and reports
   - Cost distribution analysis
   - Usage tracking for shared services
   - Savings visualization and comparison tools

5. **Referral System**
   - Multi-tier referral rewards
   - Referral tracking dashboard
   - Automated reward distribution

## Design Philosophy

- **Positive Reinforcement**
  - Green color scheme for success indicators
  - Visual savings progress tracking
  - Achievement badges for milestones
  - Gamification elements for engagement

- **User Experience**
  - Clean, intuitive interface
  - Clear value proposition
  - Emphasis on savings visualization
  - Seamless onboarding process

## Development Guidelines

- Follow Next.js 15 best practices and conventions
- Maintain consistent code style using ESLint and Prettier
- Write comprehensive tests for critical functionality
- Document API endpoints and database schema
- Follow security best practices for payment processing
- Implement proper error handling and logging
- Ensure accessibility compliance
- Optimize for performance and user engagement

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Access the application at `http://localhost:3000`

For detailed setup instructions, please refer to the project's README.md file. 