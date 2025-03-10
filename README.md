# Tweet Tone Customizer

A Next.js application for customizing tweet tones, changing voices, brain dumping, and composing ideas with audience persona targeting.

## Features

- **Tweet Tone Customizer**: Customize your tweet's tone (witty, sarcastic, professional, chaotic)
- **Voice Changer**: Transform text into someone's voice
- **Brain Dump**: Turn your thoughts into tweets
- **Compose Idea**: Convert a simple idea into a full tweet
- **Audience Persona Simulator**: Target specific audiences with your tweets
- **Tweet Analysis**: Analyze your tweets for engagement potential
- **Saved Ideas**: Save your tweets to folders for later use

## Supabase Setup

This application uses Supabase for database and authentication. Follow these steps to set up Supabase:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. In the SQL Editor, run the following SQL to create the necessary tables:

```sql
-- Create tables
CREATE TABLE public.folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.tweets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    input_text TEXT NOT NULL,
    generated_tweet TEXT NOT NULL,
    folder_id UUID REFERENCES public.folders(id),
    tone TEXT NOT NULL,
    persona TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tweets ENABLE ROW LEVEL SECURITY;

-- Create policies for folders
CREATE POLICY "Users can view their own folders" 
ON public.folders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own folders" 
ON public.folders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" 
ON public.folders FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" 
ON public.folders FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for tweets
CREATE POLICY "Users can view their own tweets" 
ON public.tweets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tweets" 
ON public.tweets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tweets" 
ON public.tweets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tweets" 
ON public.tweets FOR DELETE 
USING (auth.uid() = user_id);
```

4. In your Supabase project settings, go to API and copy the URL and anon key
5. Create a `.env.local` file in the root of your project (copy from `.env.local.example`)
6. Add your Supabase URL and anon key to the `.env.local` file

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your Supabase and OpenAI API credentials
5. Run the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

The application uses Supabase authentication. Users can sign up and sign in with email and password.

## Database Schema

### Folders Table

- `id` (UUID): Primary key
- `user_id` (UUID): User ID
- `name` (Text): Folder name
- `created_at` (Timestamp): Creation timestamp

### Tweets Table

- `id` (UUID): Primary key
- `user_id` (UUID): User ID
- `input_text` (Text): Original input text
- `generated_tweet` (Text): Generated tweet
- `folder_id` (UUID, nullable): Folder ID (foreign key)
- `tone` (Text): Tweet tone
- `persona` (Text, nullable): Target audience persona
- `created_at` (Timestamp): Creation timestamp

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- OpenAI API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
