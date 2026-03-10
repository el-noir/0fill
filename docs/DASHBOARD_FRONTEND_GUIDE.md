# Frontend Dashboard Guide — Kill All Dummy Data

> **Problem:** The current frontend dashboard is 90% hardcoded dummy data. This guide maps every dashboard element to a real backend endpoint.  
> **Auth:** All endpoints require `Authorization: Bearer <JWT>`.  
> **Base:** `http://localhost:4000/api`

---

## Dashboard Data Audit: What Was Fake vs. What's Real Now

| Dashboard Element | Was it real? | Backend endpoint now | Notes |
|---|---|---|---|
| **Total Forms** | ❌ FAKE (hardcoded "1") | `GET /organizations/:orgId/dashboard/stats` → `data.totalForms` | Real aggregate |
| **+12% trend** | ❌ FAKE | `→ data.trends.forms.changePercent` | Real period-over-period comparison |
| **Active Syncs** | ❌ FAKE | `→ data.activeForms` | Count of forms with status=ACTIVE |
| **Total Submissions** 1,248 | ❌ FAKE | `→ data.totalSubmissions` | Real count across ALL org forms |
| **+24% trend** | ❌ FAKE | `→ data.trends.submissions.changePercent` | Real trend |
| **Avg. Completion 68.4%** | ❌ FAKE | `→ data.completionRate` | Real: successful / total |
| **-2.1% trend** | ❌ FAKE | `→ data.trends.completionRate.changePercent` | Real trend |
| **Recent Activity** | ❌ ALL FAKE | `GET /organizations/:orgId/dashboard/activity` | Real event feed |
| **"View All" link** | ❌ DOES NOTHING | Same endpoint with pagination `?page=2` | Works now |
| **Responses Over Time chart** | ❌ (only existed per-form) | `→ data.responsesOverTime[]` | Org-wide time-series |

---

## Endpoint 1: Dashboard Stats (Replace ALL Stat Cards)

```
GET /api/organizations/:orgId/dashboard/stats
```

**Query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `days` | number | `30` | Trend comparison period |

**Response:**
```json
{
  "success": true,
  "data": {
    "totalForms": 3,
    "activeForms": 2,
    "totalSubmissions": 47,
    "successfulSubmissions": 45,
    "failedSubmissions": 2,
    "completionRate": 95.74,
    "averageCompletionTimeSeconds": 62,
    "responsesToday": 5,
    "responsesThisWeek": 18,
    "responsesThisMonth": 47,
    "trends": {
      "submissions": {
        "current": 47,
        "previous": 32,
        "changePercent": 46.88
      },
      "completionRate": {
        "current": 95.74,
        "previous": 90.0,
        "changePercent": 6.38
      },
      "forms": {
        "current": 1,
        "previous": 2,
        "changePercent": -50.0
      }
    },
    "responsesOverTime": [
      { "date": "2026-02-09", "count": 0 },
      { "date": "2026-02-10", "count": 3 },
      { "date": "2026-02-11", "count": 5 },
      { "date": "2026-02-12", "count": 2 }
    ],
    "topForms": [
      {
        "formId": "683f1a2b...",
        "title": "Contact Information",
        "submissionCount": 45,
        "completionRate": 97.78,
        "lastSubmissionAt": "2026-03-10T08:12:00.000Z"
      },
      {
        "formId": "684a2b3c...",
        "title": "Customer Survey",
        "submissionCount": 2,
        "completionRate": 100.0,
        "lastSubmissionAt": "2026-03-09T14:30:00.000Z"
      }
    ]
  }
}
```

### Mapping to Dashboard Stat Cards

```
┌─────────────────────────────────────────────────────────────┐
│  Total Forms          Active Forms        Total Submissions │
│  data.totalForms      data.activeForms    data.totalSubmissions │
│  trends.forms         (no trend needed)   trends.submissions │
│  .changePercent                           .changePercent    │
├─────────────────────────────────────────────────────────────┤
│  Completion Rate      Avg. Time           Responses Today   │
│  data.completionRate  data.average        data.responsesToday │
│  trends.completionRate CompletionTime     (responsesThisWeek │
│  .changePercent       Seconds             responsesThisMonth)│
└─────────────────────────────────────────────────────────────┘
```

### Trend Badge Logic

```javascript
function renderTrend(changePercent) {
  if (changePercent === null) return null;  // No previous data
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;
  const prefix = isPositive ? '+' : '';
  return {
    text: `${prefix}${changePercent}%`,
    color: isPositive ? 'green' : isNegative ? 'red' : 'gray',
  };
}

// Special case: for completion rate, DOWN is bad (red), UP is good (green)
// For all metrics, positive = green, negative = red
```

### averageCompletionTimeSeconds

This field can be `null` if no submissions have timing data yet (old submissions before the fix). Handle it:

```javascript
if (data.averageCompletionTimeSeconds === null) {
  display = '--';  // or "N/A"
} else if (data.averageCompletionTimeSeconds < 60) {
  display = `${data.averageCompletionTimeSeconds}s`;
} else {
  const mins = Math.floor(data.averageCompletionTimeSeconds / 60);
  const secs = data.averageCompletionTimeSeconds % 60;
  display = `${mins}m ${secs}s`;
}
```

---

## Endpoint 2: Activity Feed (Replace ALL Dummy Activity)

```
GET /api/organizations/:orgId/dashboard/activity
```

**Query params:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `pageSize` | number | `20` | Items per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "65a1b2c3...",
        "action": "SUBMISSION_RECEIVED",
        "description": "New submission on \"Contact Information\"",
        "metadata": {
          "formId": "683f1a2b...",
          "sessionId": "c5479234..."
        },
        "userId": null,
        "createdAt": "2026-03-10T14:22:00.000Z"
      },
      {
        "id": "65a1b2c4...",
        "action": "FORM_IMPORTED",
        "description": "Imported form \"Customer Survey\"",
        "metadata": {
          "formId": "684a2b3c...",
          "formTitle": "Customer Survey"
        },
        "userId": "60a1b2c3...",
        "createdAt": "2026-03-10T13:00:00.000Z"
      },
      {
        "id": "65a1b2c5...",
        "action": "CHAT_LINK_GENERATED",
        "description": "Generated chat link for form",
        "metadata": {
          "formId": "683f1a2b...",
          "token": "abc123"
        },
        "userId": "60a1b2c3...",
        "createdAt": "2026-03-10T10:15:00.000Z"
      },
      {
        "id": "65a1b2c6...",
        "action": "MEMBER_INVITED",
        "description": "Invited a new member (john@example.com)",
        "metadata": {
          "email": "john@example.com"
        },
        "userId": "60a1b2c3...",
        "createdAt": "2026-03-09T09:30:00.000Z"
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 3
  }
}
```

### Activity Action Types

| Action | Icon | Color | Description template |
|--------|------|-------|---------------------|
| `SUBMISSION_RECEIVED` | 📩 / inbox icon | green | `description` field has form title |
| `SUBMISSION_FAILED` | ❌ / alert icon | red | `description` has form title |
| `FORM_IMPORTED` | ➕ / plus icon | blue | `description` has form title |
| `FORM_DELETED` | 🗑️ / trash icon | gray | `description` |
| `CHAT_LINK_GENERATED` | 🔗 / link icon | blue | `metadata.formId` for navigation |
| `CHAT_CONFIG_UPDATED` | ⚙️ / settings icon | gray | `metadata.formId` |
| `MEMBER_INVITED` | 👤+ / user-plus | blue | `metadata.email` |
| `MEMBER_REMOVED` | 👤- / user-minus | red | `metadata.removedUserId` |
| `MEMBER_ROLE_CHANGED` | 🔄 / refresh | yellow | `metadata` |
| `INTEGRATION_CONNECTED` | 🔌 / plug | green | `metadata.provider` |
| `INTEGRATION_DISCONNECTED` | ⚡ / unplug | red | `metadata.provider` |

### Time Ago Formatting

Use relative time ("2 mins ago", "1 hour ago", "3 days ago") based on `createdAt`.

### "View All" Button

Load page 2, 3, etc. — either in a modal/drawer or a separate `/activity` page:
```javascript
// Initial load (sidebar preview, 5 items)
const preview = await fetch(`${BASE}/organizations/${orgId}/dashboard/activity?pageSize=5`, { headers });

// "View All" → full page with pagination
const page2 = await fetch(`${BASE}/organizations/${orgId}/dashboard/activity?page=2&pageSize=20`, { headers });
```

---

## Endpoint 3: Top Forms Table (Replace Dummy Form List)

The `topForms` array inside the dashboard stats response replaces the static "Active Forms" table on the dashboard.

```json
"topForms": [
  {
    "formId": "683f1a2b...",
    "title": "Contact Information",
    "submissionCount": 45,
    "completionRate": 97.78,
    "lastSubmissionAt": "2026-03-10T08:12:00.000Z"
  }
]
```

Render as a table:

| Status | Name | Submissions | Completion | Last Response |
|--------|------|-------------|------------|---------------|
| 🟢 Active | Contact Information | 45 | 97.8% | 2 hours ago |

For full form list with question counts, use the existing endpoint:
```
GET /api/organizations/:orgId/forms
```

---

## Complete Dashboard Integration Example

```javascript
const BASE = 'http://localhost:4000/api';
const ORG_ID = 'your-org-id';
const headers = { 'Authorization': `Bearer ${TOKEN}` };

// ── Load dashboard (2 parallel calls) ────────────────────────
const [statsRes, activityRes] = await Promise.all([
  fetch(`${BASE}/organizations/${ORG_ID}/dashboard/stats?days=30`, { headers }),
  fetch(`${BASE}/organizations/${ORG_ID}/dashboard/activity?pageSize=5`, { headers }),
]);

const stats = (await statsRes.json()).data;
const activity = (await activityRes.json()).data;

// ── Stat cards ───────────────────────────────────────────────
document.getElementById('totalForms').textContent = stats.totalForms;
document.getElementById('totalFormsTrend').textContent =
  stats.trends.forms.changePercent !== null
    ? `${stats.trends.forms.changePercent > 0 ? '+' : ''}${stats.trends.forms.changePercent}%`
    : '';

document.getElementById('totalSubmissions').textContent = stats.totalSubmissions;
document.getElementById('submissionsTrend').textContent =
  `${stats.trends.submissions.changePercent > 0 ? '+' : ''}${stats.trends.submissions.changePercent}%`;

document.getElementById('completionRate').textContent = `${stats.completionRate}%`;
document.getElementById('completionTrend').textContent =
  `${stats.trends.completionRate.changePercent > 0 ? '+' : ''}${stats.trends.completionRate.changePercent}%`;

// ── Time-series chart ────────────────────────────────────────
const chartData = stats.responsesOverTime;  // [{date, count}, ...]
// Feed to your charting library (Recharts, Chart.js, etc.)

// ── Top forms table ──────────────────────────────────────────
for (const form of stats.topForms) {
  console.log(`${form.title}: ${form.submissionCount} submissions, ${form.completionRate}%`);
}

// ── Activity feed ────────────────────────────────────────────
for (const item of activity.activities) {
  console.log(`${item.description} — ${timeAgo(item.createdAt)}`);
}
```

---

## What Each Dashboard Section Should Call

### Header Stats Row
**Single call:** `GET /organizations/:orgId/dashboard/stats`

| Card | Data path |
|------|-----------|
| Total Forms | `data.totalForms` |
| Forms trend | `data.trends.forms.changePercent` |
| Active Forms | `data.activeForms` |
| Total Submissions | `data.totalSubmissions` |
| Submissions trend | `data.trends.submissions.changePercent` |
| Completion Rate | `data.completionRate` |
| Completion trend | `data.trends.completionRate.changePercent` |
| Avg. Completion Time | `data.averageCompletionTimeSeconds` |

### Responses Over Time Chart
**Same call** — `data.responsesOverTime[]`

Each entry: `{ date: "YYYY-MM-DD", count: N }`

### Recent Activity Sidebar
**One call:** `GET /organizations/:orgId/dashboard/activity?pageSize=5`

### Active Forms Table
**Same stats call** — `data.topForms[]`

For full form list: `GET /organizations/:orgId/forms`

### "This Week" / "This Month" stats
**Same stats call:**
- `data.responsesToday`
- `data.responsesThisWeek`
- `data.responsesThisMonth`

---

## What About "Active Syncs"?

The current integration system doesn't track sync status as a separate concept. What "Active Syncs" actually means is **forms with source=GOOGLE_FORMS and status=ACTIVE**. You can use `data.activeForms` for this number. If you want to differentiate between manually-created forms and synced ones, use the existing list endpoint and filter:

```javascript
const forms = await fetch(`${BASE}/organizations/${orgId}/forms`, { headers }).then(r => r.json());
const syncedForms = forms.forms.filter(f => f.source === 'GOOGLE_FORMS');
const activeSyncs = syncedForms.length;
```

---

## Error States

| Scenario | What happens | Frontend should |
|----------|--------------|-----------------|
| No forms yet | `totalForms: 0`, empty `topForms` | Show onboarding prompt ("Import your first form") |
| No submissions yet | `totalSubmissions: 0`, empty chart | Show empty state ("Waiting for responses...") |
| No activity yet | `activities: []`, `total: 0` | Show "No recent activity" message |
| `averageCompletionTimeSeconds: null` | No timing data yet | Show "--" or "N/A" |
| `changePercent: null` | No previous period data | Hide trend badge or show "New" |

---

## Summary: Frontend Changes Needed

1. **DELETE** all hardcoded stat values (1248, 68.4%, "+12%", etc.)
2. **Call** `GET /organizations/:orgId/dashboard/stats` on page load
3. **Call** `GET /organizations/:orgId/dashboard/activity?pageSize=5` on page load
4. **Map** response fields to each UI card (see table above)
5. **Implement** "View All" to paginate activity with `?page=N`
6. **Feed** `responsesOverTime` to chart library
7. **Handle** null/zero states gracefully
