# 📚 KidsCode Arena — Platform Guide

A complete walkthrough of every feature and page in the KidsCode Arena platform.

---

## Table of Contents

1. [Landing Page](#1-landing-page)
2. [Login & Registration](#2-login--registration)
3. [Student Dashboard](#3-student-dashboard)
4. [Problems](#4-problems)
5. [Hackathons](#5-hackathons)
6. [Mentors](#6-mentors)
7. [Leaderboard](#7-leaderboard)
8. [Profile Page](#8-profile-page)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Developer Dashboard](#10-developer-dashboard)
11. [Theme System](#11-theme-system)
12. [Gamification System](#12-gamification-system)

---

## 1. Landing Page

![Landing Page](screenshots/01_landing.png)

The public-facing marketing page that introduces KidsCode Arena to new visitors.

**Sections:**
- **Hero** — Bold headline, CTA buttons ("Get Started" / "Sign In")
- **Feature highlights** — Key platform benefits with icons
- **For students, parents, teachers** — Audience-specific value props
- **Stats** — Platform metrics (total users, problems solved, etc.)
- **Footer** — Links to key pages

**Navigation:** Unauthenticated users see "Sign In" and "Get Started" buttons.

---

## 2. Login & Registration

![Login Page](screenshots/02_login.png)

### Login Page (`/login`)
- Email + password form with JWT authentication
- **Quick Demo Access** — Three one-click buttons for instant access:
  - 🎓 **Student** — Pre-seeded account with XP, streak, badges
  - 🛡️ **Admin** — Full admin panel access
  - ⚙️ **Developer** — Full dev panel access
- Link to Register for new users

### Register Page (`/register`)
- Username, email, password, grade-level selector
- Avatar emoji picker
- Auto-login after successful registration

---

## 3. Student Dashboard

![Student Dashboard](screenshots/03_student_dashboard.png)

The main hub for student activity. Accessible at `/dashboard`.

### Sections:

#### Welcome Banner
- Personalized greeting with username and avatar emoji
- Streak status message (e.g., "You're on a 7-day streak — keep going!")
- **Start Solving** shortcut button

#### Stat Cards (4-up grid)
| Card | What it shows |
|------|--------------|
| ⚡ Total XP | Cumulative XP earned + current level and rank |
| </> Problems Solved | Count out of total available |
| 🔥 Current Streak | Days in a row with at least one submission |
| 🏅 Badges Earned | Count of badges collected |

#### Profile Summary Card
- Avatar, username, grade, rank badge
- XP progress bar (current XP in level / 200 XP to next level)
- Streak (current and personal best)
- Pro Member badge (if subscribed)
- **View Full Profile** button

#### Weekly Activity Chart
- Area/line chart powered by Recharts
- Dual-line: XP earned and Problems solved per day
- Hover tooltip with exact values
- Covers the past 7 days

#### Activity Heatmap
- 26-week GitHub-style activity grid
- **Day labels**: Sun, Mon, Wed, Fri
- **Month labels**: Auto-detected (Dec, Jan, Feb, etc.)
- Cell color intensity = submission count (0 → 4+)
- Hover tooltip: date + submission count
- Fills full card width responsively

#### Daily Challenge
- Featured problem with difficulty badge and bonus XP reward
- **Solve Challenge** CTA button

#### Problem Breakdown (Pie chart)
- Donut chart showing Easy / Medium / Hard solved counts
- Color coded: green / amber / red

#### Badges
- Grid of earned badge icons with names
- Trophy placeholder if no badges yet

#### Weekend Hackathon Banner
- Full-width gradient banner for live/upcoming hackathons
- **Join Now** CTA

#### Quick Access Cards (4-up)
| Card | Links to |
|------|---------|
| 📚 Practice | `/problems` |
| 🏆 Compete | `/hackathons` |
| 👩‍🏫 Learn | `/mentors` |
| 🥇 Rankings | `/leaderboard` |

---

## 4. Problems

![Problems](screenshots/04_problems.png)

Browse and solve the problem library at `/problems`.

**Features:**
- Search bar to filter by title or tag
- Difficulty filter: All / Easy / Medium / Hard
- Language filter badges
- Problem list with: title, difficulty badge, tags, acceptance rate, and "Solve" button
- Clicking a problem opens the **Problem Solve** page (`/problems/:id`)

### Problem Solve Page (`/problems/:id`)
- Problem title, difficulty, and description
- Code editor with language selector (Python, JavaScript, C++, Java)
- Run / Submit buttons
- Test case results panel
- Submission history

---

## 5. Hackathons

![Hackathons](screenshots/05_hackathons.png)

Competitive coding events at `/hackathons`.

**Features:**
- Live, Upcoming, and Past tabs
- Each hackathon card shows:
  - Name, description, and theme
  - Prize pool and participant count
  - Start / end date + countdown timer
  - Difficulty level
  - **Join Now** / **View Results** button
- Registered events show confirmation state

---

## 6. Mentors

![Mentors](screenshots/06_mentors.png)

1:1 mentorship booking at `/mentors`.

**Features:**
- Mentor cards with:
  - Name, avatar, bio
  - Expertise tags (e.g., Python, Algorithms, Web Dev)
  - Rating and number of sessions completed
  - Available time slots
- **Book Session** button opens a time-slot modal
- Upcoming bookings list at the top

---

## 7. Leaderboard

![Leaderboard](screenshots/07_leaderboard.png)

Global rankings at `/leaderboard`.

**Features:**
- Ranked table with: position, avatar, username, level/rank, XP, streak, problems solved
- Top 3 highlighted with gold/silver/bronze styling
- Current user row highlighted
- Filter by: All Time / This Week / This Month (planned)

---

## 8. Profile Page

![Profile](screenshots/08_profile.png)

Detailed user profile at `/profile`.

**Sections:**

#### Hero Card
- Full-width gradient cover image with dot pattern
- Avatar overlapping cover at bottom-left
- Rank badge + level + subscription badge (top-right)
- Username, email, grade, member since
- XP Progress bar with "X XP remaining" label

#### Stats Grid (6 cards)
| Stat | Description |
|------|-------------|
| </> Problems Solved | Total accepted submissions |
| 🔥 Current Streak | Active day streak |
| ⚡ Total XP | All-time XP earned |
| 🏅 Badges Earned | Badge count |
| 🎯 Best Streak | Longest streak ever |
| 🏆 Rank | Bronze / Silver / Gold / Platinum / Diamond |

#### My Badges
- Grid of all earned badges with emoji icons and names
- Empty state with CTA: "Start Solving →"

#### Upgrade to Pro (Free users only)
- Gradient banner CTA for Pro subscription
- Benefits: hard problems, 2× XP, hackathon early access, ad-free

---

## 9. Admin Dashboard

![Admin Dashboard](screenshots/09_admin_dashboard.png)

Platform management panel at `/admin`. Only accessible to users with `admin` role.

**Sections:**

#### Overview Stats (4 cards)
| Card | Value |
|------|-------|
| 👥 Total Users | All registered accounts |
| ✅ Active Today | Users with activity today |
| ⭐ Pro Subscribers | Paid plan users |
| ⚡ Total XP Given | Platform-wide XP distributed |

#### Grade Distribution Chart
- Bar chart showing user count per school grade (Grade 3–12)

#### User Management Table
- Columns: Avatar, Username, Email, Grade, Role badge, XP, Streak, Subscription badge, Member Since
- Scrollable table with striped rows
- Role badges: Student (blue) / Admin (purple) / Dev (green)
- Subscription badges: Pro (green) / Free (gray)

#### Email Campaign Tool
- Subject + rich-text body composer
- Recipient targeting: All Users / Pro Users / Free Users / Admins
- **Send Campaign** button with confirmation toast

---

## 10. Developer Dashboard

![Developer Dashboard](screenshots/10_dev_dashboard.png)

System monitoring and content management at `/dev`. Only accessible to `dev` role.

**Sections:**

#### Metrics Bar (6 cards)
| Metric | Description |
|--------|-------------|
| 🕐 Uptime | System uptime (days, hours, minutes) |
| ⚡ Latency | Average API response time (ms) |
| 📊 Req/min | Requests per minute |
| 💻 CPU | CPU usage percentage |
| 🧠 Memory | RAM usage percentage |
| 💾 Disk | Storage usage percentage |

#### System Health Panel
- CPU / Memory / Disk usage bars with % labels + color coding (green → yellow → red)
- Service status list:
  - Judge0 API
  - PostgreSQL DB
  - Redis Cache
  - Stripe API
  - Email (SES)
- Each shows: ✅ Healthy or ❌ Down badge

#### Live Log Viewer
- Terminal-style dark panel with monospace font
- Log entries with: timestamp, badge (INFO/WARN/ERROR), icon, message
- Filter buttons: **ALL / INFO / WARN / ERROR**
- Color coded badges and icons per level

#### Bug Tracker Table
- Columns: ID, Title, Reporter, Priority (Critical/High/Medium/Low), Status, Date
- Priority color badges (red → orange → yellow → gray)
- Status chips: Open / In Progress / Resolved

#### Add Problem Form
- Fields: Title, Difficulty, Language, Tags, Description, Constraints, Examples, Test Cases
- Submit adds to the problem library

---

## 11. Theme System

KidsCode Arena supports **Dark Mode** and **Light Mode** globally.

- Toggle via the ☀️/🌙 icon in the top navbar
- Preference saved in Zustand store (persisted via localStorage)
- All components respond to `isDark` toggle:
  - Dark: `bg-slate-950` base, `bg-slate-800/80` cards, `border-slate-700`
  - Light: `bg-slate-50` base, `bg-white` cards, `border-gray-200`

---

## 12. Gamification System

### XP (Experience Points)
- Earned by: solving problems, maintaining streaks, winning hackathons
- Each level requires 200 XP (level = `Math.floor(xp / 200) + 1`)
- Displayed in navbar, dashboard, and profile

### Rank Tiers
| Rank | Requirement |
|------|------------|
| 🥉 Bronze | Level 1–10 |
| 🥈 Silver | Level 11–25 |
| 🥇 Gold | Level 26–50 |
| 💎 Platinum | Level 51–80 |
| 👑 Diamond | Level 81+ |

### Streak System
- Increments daily if at least one problem is submitted
- Resets to 0 if a day is missed
- Personal best streak tracked separately
- 🔥 Fire emoji shown in navbar for active streaks

### Badges
Awarded automatically for milestones:
- **First Steps** — Solve your first problem
- **On Fire!** — Reach a 7-day streak
- **Python Tamer** — Solve 10 problems in Python
- **Hackathon Hero** — Participate in a hackathon
- *(More badges unlock as the platform grows)*

### Daily Challenge
- One special problem refreshed every 24 hours
- Solving it grants +50 bonus XP
- Shown prominently on the student dashboard

---

*Last updated: February 2026 · KidsCode Arena v1.0*
