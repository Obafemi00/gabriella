# Gabriella: IELTS vocabulary practice

A simple IELTS practice site built with Next.js. No database or environment variables needed.

## Pages
- `/` Home with progress overview
- `/words` Word list by topic; mark each word Know, Unsure or Don't know (keys 1, 2, 3)
- `/flashcards` Flashcards filtered by topic and status
- `/quiz` 10-question quizzes (definitions and gap-fill)
- `/speaking` Speaking Part 2 cue cards with 1-minute prep and 2-minute talk timers (hidden for now, see `lib/features.ts`)
- `/writing` Writing Task 2 questions with a 40-minute timer, word count and saved drafts (hidden for now, see `lib/features.ts`)

Progress and drafts are stored in the visitor's browser (localStorage).

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
Option A (dashboard):
1. Push this folder to a GitHub repository.
2. In Vercel, click Add New > Project and import the repository.
3. Leave the defaults (Vercel detects Next.js). Click Deploy.

Option B (command line):
```bash
npm i -g vercel
vercel        # preview deployment
vercel --prod # production
```

## Editing content
- Words: `lib/words.ts` (add rows to a group, or add a new group)
- Cue cards and essay questions: `lib/prompts.ts`
- Colours and fonts: the variables at the top of `app/globals.css` (change `--pink` to re-brand)
