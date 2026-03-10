# Backend Change Log: Multi-Page Section Progress Tracking

> **Date**: March 10, 2026
> **Commit**: `feat: multi-page section progress tracking for all conversation flows`

---

## What Changed (TL;DR)

The backend now tracks **per-page/section progress** for multi-page Google Forms. Every API response already included `progressDetail` — now it also contains:

- `totalPages` — total number of pages/sections in the form
- `currentPage` — which page the user is currently on (1-based)
- `sectionIndex` on each field — which page that field belongs to (0-based)
- `sections[]` — per-page progress breakdown (only when form has >1 page)

**No breaking changes.** All new fields are additive. Existing frontend code will keep working.

---

## New Fields in `progressDetail`

### Always present (even single-page forms)

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | `number` | Total pages in the form. `1` for single-page forms. |
| `currentPage` | `number` | 1-based page the user is currently answering. |

### On each field in `fields[]`

| Field | Type | Description |
|-------|------|-------------|
| `sectionIndex` | `number` | 0-based index of the page/section this field belongs to. |

### New `sections[]` array (only when `totalPages > 1`)

| Field | Type | Description |
|-------|------|-------------|
| `sectionId` | `string` | `"section_0"`, `"section_1"`, etc. |
| `title` | `string` | Page title (from the Google Form section header, or `"Page N"` fallback). |
| `status` | `'completed' \| 'current' \| 'upcoming'` | Whether all fields in this section are answered. |
| `percentage` | `number` | 0–100 completion for this section only. |
| `answeredCount` | `number` | How many fields answered in this section. |
| `totalFields` | `number` | Total answerable fields in this section. |
| `pageNumber` | `number` | 1-based page number. |

---

## TypeScript Types (Copy to Frontend)

```typescript
interface FieldProgress {
  fieldId: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming' | 'skipped';
  questionNumber: number;   // 1-based
  sectionIndex: number;     // NEW — 0-based page index
}

interface SectionProgress {
  sectionId: string;        // "section_0", "section_1", …
  title: string;            // Page/section title
  status: 'completed' | 'current' | 'upcoming';
  percentage: number;       // 0-100 for this section only
  answeredCount: number;
  totalFields: number;
  pageNumber: number;       // 1-based
}

interface ProgressDetail {
  percentage: number;       // 0-100 overall
  answeredCount: number;
  totalFields: number;
  currentFieldIndex: number;
  fields: FieldProgress[];
  sections?: SectionProgress[];  // NEW — only when totalPages > 1
  totalPages: number;            // NEW — always present
  currentPage: number;           // NEW — always present, 1-based
}
```

---

## Affected API Endpoints

All three entry points return the updated `progressDetail` in every response:

### 1. Public Chat (App-Created Forms)

| Method | Endpoint | Response field |
|--------|----------|----------------|
| `POST` | `/api/public/chat/:token/start` | `data.progressDetail` |
| `POST` | `/api/public/chat/:token/message` | `data.progressDetail` |

### 2. URL-Based Conversation (User-Pasted Google Form Link)

| Method | Endpoint | Response field |
|--------|----------|----------------|
| `POST` | `/api/conversation/start` | `data.progressDetail` |
| `POST` | `/api/conversation/:id/message` | `data.progressDetail` |
| `GET`  | `/api/conversation/:id/status` | `data.progressDetail` |

### 3. WebSocket

| Event (client → server) | Response event | Response field |
|--------------------------|----------------|----------------|
| `startConversation` | `conversationStarted` | `progressDetail` |
| `sendMessage` | `messageReply` | `progressDetail` |
| `getStatus` | `sessionStatus` | `progressDetail` |

---

## Example JSON: Single-Page Form (No Change)

```json
{
  "progressDetail": {
    "percentage": 40,
    "answeredCount": 2,
    "totalFields": 5,
    "currentFieldIndex": 2,
    "totalPages": 1,
    "currentPage": 1,
    "fields": [
      { "fieldId": "field_0", "label": "Name", "status": "completed", "questionNumber": 1, "sectionIndex": 0 },
      { "fieldId": "field_1", "label": "Email", "status": "completed", "questionNumber": 2, "sectionIndex": 0 },
      { "fieldId": "field_2", "label": "Feedback", "status": "current", "questionNumber": 3, "sectionIndex": 0 }
    ]
  }
}
```

Note: `sections` is **not present** for single-page forms (no need to render page stepper).

---

## Example JSON: Multi-Page Form (3 Pages)

```json
{
  "progressDetail": {
    "percentage": 33,
    "answeredCount": 3,
    "totalFields": 9,
    "currentFieldIndex": 3,
    "totalPages": 3,
    "currentPage": 2,
    "fields": [
      { "fieldId": "field_0", "label": "Full Name", "status": "completed", "questionNumber": 1, "sectionIndex": 0 },
      { "fieldId": "field_1", "label": "Email", "status": "completed", "questionNumber": 2, "sectionIndex": 0 },
      { "fieldId": "field_2", "label": "Phone", "status": "completed", "questionNumber": 3, "sectionIndex": 0 },
      { "fieldId": "field_3", "label": "Rate Service", "status": "current", "questionNumber": 4, "sectionIndex": 1 },
      { "fieldId": "field_4", "label": "Comments", "status": "upcoming", "questionNumber": 5, "sectionIndex": 1 },
      { "fieldId": "field_5", "label": "Recommend?", "status": "upcoming", "questionNumber": 6, "sectionIndex": 1 },
      { "fieldId": "field_6", "label": "Follow-up OK?", "status": "upcoming", "questionNumber": 7, "sectionIndex": 2 },
      { "fieldId": "field_7", "label": "Preferred Time", "status": "upcoming", "questionNumber": 8, "sectionIndex": 2 },
      { "fieldId": "field_8", "label": "Anything else?", "status": "upcoming", "questionNumber": 9, "sectionIndex": 2 }
    ],
    "sections": [
      {
        "sectionId": "section_0",
        "title": "Personal Info",
        "status": "completed",
        "percentage": 100,
        "answeredCount": 3,
        "totalFields": 3,
        "pageNumber": 1
      },
      {
        "sectionId": "section_1",
        "title": "Feedback",
        "status": "current",
        "percentage": 0,
        "answeredCount": 0,
        "totalFields": 3,
        "pageNumber": 2
      },
      {
        "sectionId": "section_2",
        "title": "Follow-up",
        "status": "upcoming",
        "percentage": 0,
        "answeredCount": 0,
        "totalFields": 3,
        "pageNumber": 3
      }
    ]
  }
}
```

---

## Frontend Implementation Guide

### Decision Logic

```
if (progressDetail.sections && progressDetail.sections.length > 1) {
  → Render page stepper + per-page progress
} else {
  → Render simple progress bar (same as before)
}
```

### Recommended UI Layout for Multi-Page Forms

```
┌──────────────────────────────────────────────┐
│  [●]──[◉]──[○]                               │  ← Page stepper (sections)
│  Personal Info → Feedback → Follow-up         │  ← Section titles
├──────────────────────────────────────────────┤
│  ████████░░░░░░░░░░░░  33%                   │  ← Overall progress bar
│  3 of 9 questions answered                    │
├──────────────────────────────────────────────┤
│  Page 2: Feedback (0/3 done)                  │  ← Current section info
├──────────────────────────────────────────────┤
│                                              │
│  Chat messages...                            │
│                                              │
└──────────────────────────────────────────────┘
```

### Page Stepper Component (React + Tailwind)

```tsx
function PageStepper({ progressDetail }: { progressDetail: ProgressDetail }) {
  if (!progressDetail.sections || progressDetail.sections.length <= 1) return null;

  return (
    <div className="space-y-2 p-3 border-b">
      {/* Step circles with connectors */}
      <div className="flex items-center justify-center gap-1">
        {progressDetail.sections.map((section, i) => (
          <div key={section.sectionId} className="flex items-center gap-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${section.status === 'completed' ? 'bg-green-500 text-white' : ''}
                ${section.status === 'current' ? 'bg-blue-500 text-white ring-2 ring-blue-200' : ''}
                ${section.status === 'upcoming' ? 'bg-gray-200 text-gray-400' : ''}
              `}
            >
              {section.status === 'completed' ? '✓' : section.pageNumber}
            </div>
            {i < progressDetail.sections.length - 1 && (
              <div className={`h-0.5 w-6 ${section.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Current section label */}
      <p className="text-center text-sm text-blue-700 font-medium">
        Page {progressDetail.currentPage}: {progressDetail.sections[progressDetail.currentPage - 1]?.title}
      </p>
    </div>
  );
}
```

### Handling Single-Page vs Multi-Page

```tsx
function ProgressHeader({ progressDetail }: { progressDetail: ProgressDetail }) {
  return (
    <div>
      {/* Page stepper — auto-hides for single-page forms */}
      <PageStepper progressDetail={progressDetail} />

      {/* Overall progress bar — always shown */}
      <div className="px-3 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressDetail.percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {progressDetail.answeredCount} of {progressDetail.totalFields} answered ({progressDetail.percentage}%)
        </p>
      </div>
    </div>
  );
}
```

---

## Edge Cases to Handle

| Scenario | What happens | Frontend should |
|----------|-------------|-----------------|
| Single-page form | `sections` is `undefined`, `totalPages` = 1 | Hide page stepper, show only progress bar |
| Form imported via Google API (no sections) | `sectionIndex` = 0 on all fields, `totalPages` = 1 | Same as single-page |
| `CLARIFYING` state | Progress stays the same (re-asking same question) | Don't animate/flash the progress |
| `CONFIRMING` state | `percentage` = 100 | Show "Review answers" label |
| User on last page | `currentPage` = `totalPages` | Stepper shows last circle as current |
| All pages completed | All sections have `status: 'completed'` | Show "All pages complete!" or submit state |

---

## Backend Files Changed

| File | What changed |
|------|-------------|
| `src/conversation/interfaces/conversation.interface.ts` | Added `SectionProgress` interface, `sectionIndex` to `FieldProgress`, `sections/totalPages/currentPage` to `ProgressDetail` |
| `src/conversation/conversation.service.ts` | Rewrote `buildProgressDetail()` to compute per-section progress and page tracking |
| `src/public-chat/public-chat.service.ts` | Rewrote `adaptFormToSchema()` to preserve section data instead of hardcoding empty sections |
| `src/forms/forms.service.ts` | Added `sectionIndex` tracking and `pageCount` to metadata during Google API form import |
| `src/forms/schemas/form.schema.ts` | Added `pageCount?` to metadata type definition |
| `docs/FRONTEND_PROGRESS_GUIDE.md` | Updated types, JSON examples, added `PageProgress` component |

---

## Quick Test

To verify the new fields are present, start a chat and check the response:

```bash
# App-created form (public chat)
curl -X POST http://localhost:4000/api/public/chat/<TOKEN>/start

# URL-based form (paste a Google Form link)
curl -X POST http://localhost:4000/api/conversation/start \
  -H "Content-Type: application/json" \
  -d '{"url": "https://docs.google.com/forms/d/e/<FORM_ID>/viewform"}'
```

Look for `totalPages`, `currentPage`, and `sections` in `data.progressDetail`.
