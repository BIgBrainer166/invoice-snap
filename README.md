# InvoiceSnap

A modern, minimalist invoicing application built with Next.js and Supabase. Create professional invoices in seconds with a clean, Capital.xyz-inspired design.

![InvoiceSnap Logo](./public/logo.png)

## Features

- 🎨 **Beautiful Design** - Clean, minimalist interface with serif typography and soft shadows
- ⚡ **Lightning Fast** - Create invoices in under 90 seconds
- 🖼️ **Custom Branding** - Upload your company logo and choose its position (left, center, right)
- 📊 **Smart Calculations** - Automatic subtotal, tax, and total calculations
- 💼 **Client Management** - Save and reuse client details
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🔒 **Secure** - Built with Supabase authentication and Row Level Security
- 📄 **Multiple Invoice States** - Draft, Sent, Paid, Overdue, Cancelled

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Prisma](https://prisma.io/) - Type-safe database access
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Date Handling:** date-fns
- **Runtime:** Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Supabase](https://supabase.com/) account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BIgBrainer166/invoice-snap.git
cd invoice-snap
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (from Supabase Settings > Database > Connection String)
POSTGRES_URL_NON_POOLING=your_postgres_connection_string
```

4. Generate Prisma Client:
```bash
bun run db:generate
```

5. Set up the database:
**Option A: Using Existing Database**
If you already have the tables in Supabase, pull the schema:
```bash
bun run db:pull
```

**Option B: Using Prisma Migrations**
```bash
bun run db:push
```

**Option C: Using SQL Scripts (Legacy)**
Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   - `001_create_invoices_table.sql`
   - `002_create_profiles_table.sql`
   - `003_add_logo_columns.sql`

6. Run the development server:
```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Prisma Commands

- `bun run db:generate` - Generate Prisma Client
- `bun run db:push` - Push schema changes to database
- `bun run db:pull` - Pull schema from existing database
- `bun run db:studio` - Open Prisma Studio GUI
- `bun run db:migrate` - Create and apply a migration
- `bun run db:migrate:deploy` - Apply migrations in production

See [PRISMA.md](./PRISMA.md) for detailed Prisma documentation.

## Design System

InvoiceSnap uses a Capital.xyz-inspired design language featuring:

- **Colors:** Warm cream background (#FAFAF8), soft black primary (#171717)
- **Typography:** Source Serif 4 for headings, Inter for body text
- **Spacing:** Generous whitespace with a focus on readability
- **Shadows:** Soft, diffused shadows for depth
- **Borders:** Large rounded corners (1.5rem radius)
- **Layout:** Bento grid system for feature sections

## Project Structure

```
invoice-snap/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── create/            # Create invoice page
│   └── invoices/          # Invoice details pages
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── invoice-*.tsx     # Invoice-specific components
├── lib/                   # Utilities and configurations
│   └── supabase/         # Supabase client setup
├── scripts/               # Database migration scripts
└── public/                # Static assets
```

## Key Features Explained

### Custom Logo Upload
Users can upload their company logo directly in the invoice creation form. The logo is stored as a base64 data URL and can be positioned at the top-left, center, or right of the invoice.

### Multi-Step Invoice Creation
1. **Step 1:** Add client details and branding
2. **Step 2:** Add line items with automatic calculations
3. **Step 3:** Review and create the invoice

### Invoice Management
- View all invoices in a clean dashboard
- Update invoice status (Draft → Sent → Paid)
- Track total revenue and pending payments

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

## Database Schema

### Invoices Table
- User authentication via Supabase Auth
- Invoice metadata (number, dates, status)
- Client information
- Line items (stored as JSONB)
- Financial calculations (subtotal, tax, total)
- Custom branding (logo_url, logo_position)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspiration from [Capital.xyz](https://capital.xyz)
- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
