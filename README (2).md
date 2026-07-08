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