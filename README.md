# 📰 Samagra News Portal

A dynamic news portal built using an AI-assisted development workflow with Lovable, powered by a Supabase database backend.

---

## 🧠 Core Project Logic & Architecture

Here is the breakdown of how this application executes its core logic:

1. **Frontend UI/UX (Lovable):** The user interface dynamically fetches and displays news articles, categories, and user layouts using a highly responsive components architecture.
2. **Database & Authentication (Supabase):** * Stores articles, author data, and user roles securely.
   * Utilizes Row Level Security (RLS) to ensure users can read articles, but only authorized admins can publish or modify them.
3. **Data Flows:**
   [User Browses App] ──> [Lovable Frontend] ──(Queries)──> [Supabase Database]
                                                                  │
   [Live News Update] <── [Make.com AI Agent] ────────────────────┘

---

## 🛠️ How It Was Developed (Step-by-Step)

### Phase 1: Database Setup (Supabase)
* Created the core tables for `articles`, `categories`, and `users`.
* Configured real-time triggers so new news updates instantly appear on the frontend.

### Phase 2: Frontend Engineering & Logic
* Designed state management to handle loading states while news content is being fetched.
* Implemented filtering logic allowing users to sort news by category, date, or popularity.

### Phase 3: AI Automation Integration
* Leveraged automated agents via Make.com to handle content generation, background processing, or data updates seamlessly.


## 📦 Project Blueprints & Assets

To help you recreate or understand this build step-by-step, explore the implementation files inside the `/docs` directory:

* [🤖 Lovable AI Prompts](https://github.com/k-shashank10/samagra-news-portal/blob/06309ce7f0c5a9d806c54b5fab42ce070b93bc6f/NEWS%20Portal/docs/lovable-prompts.md) - The exact prompts used to generate the frontend layout and logic.
* [🗄️ Supabase Database Schema](https://github.com/k-shashank10/samagra-news-portal/blob/820031096a1addb59e67b1d7944e394157bb1649/NEWS%20Portal/docs/Supabase%20newsflash.csv) - The table structures and data relations layout.
* [🔀 Make.com Automation Blueprint](https://github.com/k-shashank10/samagra-news-portal/blob/06309ce7f0c5a9d806c54b5fab42ce070b93bc6f/NEWS%20Portal/docs/make-blueprint.json) - Import this JSON file directly into Make.com to instantly clone the backend workflow automation.
