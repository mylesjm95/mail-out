# GitHub Actions Setup for Daily Emails

This repository includes a GitHub Action that automatically sends daily email notifications at 10:00 AM UTC every day.

## Required GitHub Secrets

To make the GitHub Action work, you need to add the following secrets to your GitHub repository:

### How to Add Secrets:
1. Go to your GitHub repository: `https://github.com/mylesjm95/mail-out`
2. Click on **Settings** tab
3. In the left sidebar, click on **Secrets and variables** → **Actions**
4. Click **New repository secret** for each secret below

### Required Secrets:

#### Database
- `DATABASE_URL` - Your Supabase database connection string
  - Example: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

#### Supabase
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
  - Example: `https://[project-ref].supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

#### External APIs
- `AMPRE_TOKEN` - Your AMPRE API token for fetching listings
- `RESEND_API_KEY` - Your Resend API key for sending emails

#### Next.js (if needed)
- `NEXTAUTH_SECRET` - A random secret for NextAuth
- `NEXTAUTH_URL` - Your application URL (e.g., `https://yourdomain.com`)

## Workflow Details

- **Schedule**: Runs every day at 10:00 AM UTC
- **Manual Trigger**: Can be triggered manually from the Actions tab
- **Environment**: Uses Ubuntu latest with Node.js 18
- **Steps**:
  1. Checks out the code
  2. Sets up Node.js and installs dependencies
  3. Generates Prisma client
  4. Runs database migrations
  5. Executes the daily email script
  6. Logs completion

## Testing the Workflow

1. Go to the **Actions** tab in your GitHub repository
2. Click on **Daily Email Notifications** workflow
3. Click **Run workflow** to test it manually
4. Check the logs to ensure it runs successfully

## Timezone Considerations

The workflow runs at 10:00 AM UTC. If you need it to run at 10:00 AM in a different timezone:

- **EST (UTC-5)**: Change cron to `'0 15 * * *'` (3:00 PM UTC)
- **PST (UTC-8)**: Change cron to `'0 18 * * *'` (6:00 PM UTC)
- **CST (UTC-6)**: Change cron to `'0 16 * * *'` (4:00 PM UTC)

## Monitoring

- Check the **Actions** tab to see workflow runs
- Failed runs will show error logs
- Successful runs will show completion logs
- You can set up email notifications for failed runs in GitHub settings

## Troubleshooting

If the workflow fails:
1. Check that all secrets are properly set
2. Verify your database connection
3. Ensure your API keys are valid
4. Check the logs in the Actions tab for specific error messages
