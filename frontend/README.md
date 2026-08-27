# Forge Guard

Build the frontend for a project called "RedForge".

RedForge is an LLM security testing platform that automatically red-teams language models using adversarial prompts, adaptive attack strategies, and an LLM-as-a-Judge evaluator.

The goal of the UI is to let a user configure a security scan, start it, watch the scan progress, and inspect the resulting vulnerabilities — all from ONE single-page dashboard.

IMPORTANT:

- Build only the frontend.

- Do not create multiple pages.

- Do not implement authentication.

- Do not create a database.

- Do not implement the security engine.

- Do not create fake backend logic.

- Use the API contract provided below.

- The backend already exists as a FastAPI application.

- The UI should be structured cleanly so it can connect directly to the backend.

- Use realistic mock data only for the initial visual state before a real scan is run.

- Once connected, all scan data must come from the API.

==================================================

PRODUCT

==================================================

Name:

REDFORGE

Tagline:

LLM SECURITY TESTING

Purpose:

Automated adversarial testing for LLM security boundaries.

Core capabilities:

- Adversarial testing

- Adaptive attack generation

- System prompt extraction testing

- Prompt injection testing

- Jailbreak testing

- LLM-as-a-Judge evaluation

- Security finding generation

- Security reporting

Current target provider:

Groq

Current target model:

openai/gpt-oss-120b

IMPORTANT:

For the current MVP, only support Groq.

Do NOT create OpenAI, Anthropic, Gemini, or other provider selectors yet.

The architecture should make it easy to add providers later, but the current UI should clearly represent Groq as the target.

==================================================

VISUAL DIRECTION

==================================================

Use the attached visual reference image as the primary design inspiration.

The visual identity should communicate the name "RedForge".

Think:

dark forge

security laboratory

controlled adversarial testing

industrial

technical

precise

serious

Use a DARK GREY / CHARCOAL base.

Do NOT use pure black as the primary background.

Suggested visual palette:

Background:

#0B0F12

Primary surface:

#11171C

Secondary surface:

#151C22

Borders:

#273038

Primary text:

#F5F7F8

Secondary text:

#8D98A3

Accent:

RED

Use red selectively for:

- RedForge branding

- primary CTA

- active controls

- critical findings

- important status indicators

- progress indicators

- selected attack categories

- icons that represent attacks/security

Do NOT make the entire interface red.

Use green only for:

- completed scans

- successful safe states

- healthy backend status

Use amber/orange for:

- partial findings

- medium severity

The overall UI should feel sophisticated and restrained.

Avoid:

- excessive neon

- cyberpunk aesthetics

- hacker imagery

- Matrix-style effects

- excessive gradients

- excessive glowing effects

- giant charts

- unnecessary animations

==================================================

LAYOUT

==================================================

Create ONE responsive dashboard page.

Desktop-first design.

Structure:

--------------------------------------------------

HEADER

--------------------------------------------------

Left:

RedForge flame/forge icon

REDFORGE

Small subtitle:

LLM SECURITY TESTING

Right:

Target Provider

[ Groq ]

Target status:

● Ready

Small tagline:

FIND WEAKNESSES. BUILD STRONGER AI.

--------------------------------------------------

MAIN CONTENT

--------------------------------------------------

Use a two-column desktop layout.

Main content:

approximately 75%

Right sidebar:

approximately 25%

On mobile, stack everything vertically.

==================================================

SECTION 1 — CONFIGURE SCAN

==================================================

Large card:

Title:

Configure Scan

Subtitle:

Select attack categories and settings to test your model against adversarial attacks.

Attack Categories:

Create three selectable cards.

1.

System Prompt Extraction

Description:

Test whether the model reveals hidden system instructions.

2.

Prompt Injection

Description:

Test whether untrusted instructions can override intended behavior.

3.

Jailbreak

Description:

Test whether the model can be induced to bypass its safety behavior.

Each card should have:

- checkbox

- icon

- title

- short description

- selected/unselected state

Selected state:

subtle red border and red accent.

Attempts per Strategy:

Number input.

Default:

2

Label:

Number of attempts for each attack strategy.

Primary CTA:

START RED TEAM SCAN

Use a red button with a play icon.

While a scan is running:

SCAN RUNNING...

Disable the button.

After completion:

RUN NEW SCAN

==================================================

SECTION 2 — SCAN STATUS

==================================================

This section should dynamically appear when a scan is running.

Title:

Scan Running

Subtitle:

RedForge is testing the target...

Show:

Progress bar

Example:

50%

Completed Attempts:

12 / 24

Current Category:

Prompt Injection

Current Strategy:

Authority Impersonation

Also show a small elapsed time indicator if practical.

When the scan is completed:

Title:

Scan Completed

Show a green completed indicator.

When idle:

Show a subtle empty state:

Ready to scan

Configure your attack categories and start a security assessment.

==================================================

SECTION 3 — SUMMARY

==================================================

Card title:

Summary

Subtitle:

Overall results from the security assessment.

Create five metric cards:

Total Attempts

24

Blocked

20

Partial

2

Successful

2

Attack Success Rate

8.33%

These values are examples only.

They must come from:

report.summary

when a real scan has completed.

Use visual hierarchy rather than huge numbers.

==================================================

SECTION 4 — ATTACK CATEGORY ANALYSIS

==================================================

Title:

Attack Categories

Show:

System Prompt Extraction

Attempts

Successful

Partial

Blocked

Success Rate

Prompt Injection

Attempts

Successful

Partial

Blocked

Success Rate

Jailbreak

Attempts

Successful

Partial

Blocked

Success Rate

Use clean horizontal progress bars or compact visual indicators.

Do not create complicated charts.

The data must come from:

report.categories

Do not hardcode category statistics.

==================================================

SECTION 5 — SECURITY FINDINGS

==================================================

Title:

Security Findings

Subtitle:

Potential vulnerabilities discovered during the security assessment.

Display findings as clean horizontal cards.

Each finding should show:

Severity

Title

Category

Strategy

Short description

Example:

HIGH

System Prompt Disclosure via Role Play

system_prompt_extraction • role_play

The model disclosed protected system instructions.

Another example:

MEDIUM

Instruction Override via Context Manipulation

prompt_injection • context_manipulation

The model partially followed modified instructions.

Severity styling:

CRITICAL = red

HIGH = red/orange

MEDIUM = amber

LOW = muted blue/neutral

When there are no findings:

Show:

No Security Findings

RedForge completed the assessment without identifying successful or partial security boundary violations.

Use a subtle shield/check icon.

==================================================

FINDING DETAILS

==================================================

Clicking/expanding a finding should reveal:

Description

Evidence

Recommendation

Technical Details

Inside Technical Details show:

Attack Prompt

Target Response

Judge Evidence

Judge Reason

Keep Attack Prompt and Target Response collapsed by default.

Do not create a new page.

Use expandable sections or dialogs while keeping the user on the same dashboard.

==================================================

RIGHT SIDEBAR

==================================================

Create:

RECENT SCANS

Show previous scans.

Each row:

Date

Status

Attempts

Example:

Aug 27, 2026

Completed

24 / 24 attempts

Aug 26, 2026

Failed

12 / 12 attempts

Use green for completed.

Use red for failed.

Clicking a completed scan should load its detailed report using:

GET /api/scans/{scan_id}

Do not navigate to another page.

Below Recent Scans, create:

ABOUT REDFORGE

Text:

"An open-source LLM security testing framework for building safer AI systems."

Features:

✓ Adversarial Testing

✓ Adaptive Attacks

✓ LLM-as-a-Judge

✓ Security Findings

✓ Detailed Reporting

At the bottom:

STRONGER AI

THROUGH ADVERSITY

This should be a subtle RedForge branding element.

==================================================

API INTEGRATION

==================================================

Backend:

FastAPI

Base URL during development:

http://127.0.0.1:8000

Centralize this URL in one configuration file.

Do not scatter the URL throughout components.

API endpoints:

--------------------------------------------------

HEALTH

--------------------------------------------------

GET

/api/health

Response:

{

  "status": "healthy"

}

--------------------------------------------------

START SCAN

--------------------------------------------------

POST

/api/scans

Request:

{

  "categories": [

    "system_prompt_extraction",

    "prompt_injection",

    "jailbreak"

  ],

  "max_attempts_per_strategy": 2

}

Response:

{

  "scan_id": "uuid",

  "status": "queued"

}

--------------------------------------------------

GET SCAN

--------------------------------------------------

GET

/api/scans/{scan_id}

Running response:

{

  "id": "uuid",

  "status": "running",

  "progress": 50,

  "completed_attempts": 12,

  "total_attempts": 24,

  "current_category": "prompt_injection",

  "current_strategy": "authority_impersonation",

  "report": null,

  "error": null

}

Completed response:

{

  "id": "uuid",

  "status": "completed",

  "progress": 100,

  "completed_attempts": 24,

  "total_attempts": 24,

  "current_category": "jailbreak",

  "current_strategy": "role_play",

  "report": {

    "metadata": {},

    "summary": {

      "total_attempts": 24,

      "successful": 2,

      "partial": 2,

      "blocked": 20,

      "success_rate": 8.33

    },

    "categories": {},

    "findings": []

  },

  "error": null

}

--------------------------------------------------

SCAN HISTORY

--------------------------------------------------

GET

/api/scans

Response:

{

  "scans": [

    {

      "id": "uuid",

      "status": "completed",

      "progress": 100,

      "completed_attempts": 24,

      "total_attempts": 24,

      "created_at": "...",

      "completed_at": "..."

    }

  ]

}

==================================================

SCAN WORKFLOW

==================================================

When the user clicks:

START RED TEAM SCAN

1. Read selected categories.

2. Read attempts per strategy.

3. POST /api/scans.

4. Store returned scan_id.

5. Switch dashboard into scanning state.

6. Poll:

GET /api/scans/{scan_id}

every 1 second.

7. Update:

progress

completed_attempts

total_attempts

current_category

current_strategy

8. When:

status = completed

stop polling.

9. Display:

summary

categories

findings

10. If:

status = failed

stop polling and display a clear error.

Do not create duplicate polling intervals.

Clean up polling when the component unmounts.

==================================================

TYPESCRIPT

==================================================

Create proper TypeScript types/interfaces for:

ScanRequest

ScanStatus

ScanSummary

CategoryResult

SecurityFinding

SecurityReport

ScanHistoryItem

Do not use "any" for API responses.

==================================================

COMPONENT STRUCTURE

==================================================

Organize the frontend into reusable components such as:

RedForgeDashboard

Header

ScanConfiguration

AttackCategoryCard

ScanStatus

SummaryMetrics

CategoryAnalysis

SecurityFindings

FindingCard

FindingDetails

RecentScans

AboutRedForge

Do not create unnecessary abstractions.

Keep the code easy to connect to the FastAPI backend.

Create a centralized API client/service for:

startScan()

getScan()

getScans()

getHealth()

==================================================

STATES

==================================================

The dashboard must support:

IDLE

QUEUED

RUNNING

COMPLETED

FAILED

Make each state visually polished.

IDLE:

Ready to scan.

QUEUED:

Preparing security assessment.

RUNNING:

Show live progress.

COMPLETED:

Show report.

FAILED:

Show error and Retry button.

==================================================

RESPONSIVENESS

==================================================

Desktop:

Two-column layout.

Tablet:

Reduced sidebar width.

Mobile:

Single-column layout.

Recent Scans moves below the main content.

Finding details should remain easy to read.

Attack configuration cards should stack vertically.

==================================================

IMPORTANT

==================================================

Do not build a generic SaaS dashboard.

Do not add unnecessary navigation.

Do not create multiple pages.

Do not add authentication.

Do not add billing.

Do not add user management.

Do not add team management.

Do not add unnecessary charts.

The entire product should feel like a focused security assessment console.

The visual reference should strongly influence the design.

The final impression should be:

"RedForge is a serious tool that attacks AI systems to find weaknesses."

Use the dark charcoal + restrained red visual identity consistently.

Build the complete frontend now with clean mock data for the initial state, while keeping the API integration ready for the FastAPI backend.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1535aeb4-a35a-4896-b1fd-8dc9375b40d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
