# Portfolio Backend — Installation & Setup (Prisma + MySQL)

## What's built — complete backend, all modules

Every module from the plan is done: `auth`, `admins`, `media`, `tags`, `settings`,
`skills`, `experiences`, `education`, `testimonials`, `projects`, `blog`, `contact`.

- **Global**: config validation, `ValidationPipe`, CORS, consistent JSON error
  responses, JWT auth guard (opt-out via `@Public()`), role guard for super_admin-only
  routes, static `/uploads` serving.
- **Public read endpoints** (no auth) power the website; **admin endpoints**
  (JWT required) power the dashboard. Same service layer underneath — the split is
  just which data is visible (published vs. draft, approved vs. pending, visible vs.
  hidden) and who can write.

## ⚠️ Verification note

This sandbox can't reach `binaries.prisma.sh`, so `prisma generate` can't complete
here. To still verify the code, I hand-wrote a type stub matching every model/field in
`schema.prisma` and ran `tsc --noEmit` + `nest build` against it — both pass clean
across all 12 modules. The stub itself is not shipped; on your machine, real
`prisma generate` (via `npm install`) replaces it with the actual generated client.

## Setup

```bash
cd portfolio-backend
npm install                 # runs `prisma generate` automatically
npx prisma db push          # creates all tables in my_portfolio
npm run seed:admin          # create your first super_admin
npm run start:dev
```

`.env` is pre-filled with `DATABASE_URL="mysql://root:@localhost:3306/my_portfolio"`.

## Full API reference

All routes are prefixed with `/api`. 🔓 = public (no token). 🔒 = requires
`Authorization: Bearer <token>`. 🔒👑 = super_admin only.

### Auth
| Method | Path | |
|---|---|---|
| POST | `/auth/login` | 🔓 |
| GET | `/auth/me` | 🔒 |

### Admins (managing dashboard users)
| Method | Path | |
|---|---|---|
| POST / GET / PATCH / DELETE | `/admins`, `/admins/:id` | 🔒👑 |

### Media
| Method | Path | |
|---|---|---|
| POST | `/media` (multipart `file`) | 🔒 |
| GET | `/media`, `/media/:id` | 🔒 |
| DELETE | `/media/:id` | 🔒 |

### Tags
| Method | Path | |
|---|---|---|
| GET | `/tags` | 🔓 |
| POST | `/tags` | 🔒 |
| DELETE | `/tags/:id` | 🔒 |

### Settings
| Method | Path | |
|---|---|---|
| GET | `/settings` (site info + kv, flattened) | 🔓 |
| PATCH | `/settings` | 🔒 |
| GET / PUT / DELETE | `/settings/kv`, `/settings/kv/:key` | 🔒 |

### Skills
| Method | Path | |
|---|---|---|
| GET | `/skills` (visible only) | 🔓 |
| GET | `/skills/admin` (all), `/skills/:id` | 🔒 |
| POST / PATCH / DELETE | `/skills`, `/skills/:id` | 🔒 |
| PATCH | `/skills/reorder` (`{ items: [{id, orderIndex}] }`) | 🔒 |

### Experiences / Education
Same shape as Skills, minus the visibility split (no draft state):
`GET /experiences` 🔓, `POST/PATCH/DELETE` 🔒, `PATCH /experiences/reorder` 🔒.
Identical for `/education`.

### Testimonials
| Method | Path | |
|---|---|---|
| POST | `/testimonials` (client self-submits — saved unapproved) | 🔓 |
| GET | `/testimonials` (approved only) | 🔓 |
| GET | `/testimonials/admin` (all, incl. pending) | 🔒 |
| PATCH | `/testimonials/:id/approve` | 🔒 |
| PATCH / DELETE / reorder | | 🔒 |

> Note: I made a judgment call allowing public submission (common for portfolios —
> clients leave their own testimonial, you approve before it's visible). If you'd
> rather only admins create testimonials, remove the `@Public()` on `submit()` in
> `testimonials.controller.ts`.

### Projects
| Method | Path | |
|---|---|---|
| GET | `/projects` (published only; filters: `category`, `tag`, `featured`, `search`, `page`, `limit`) | 🔓 |
| GET | `/projects/slug/:slug` (published only, increments view count) | 🔓 |
| GET | `/projects/admin` (all statuses; filter by `status`) | 🔒 |
| GET | `/projects/:id` | 🔒 |
| POST / PATCH / DELETE | `/projects`, `/projects/:id` (soft delete) | 🔒 |
| PATCH | `/projects/reorder` | 🔒 |

Create/update body accepts `imageMediaIds: number[]` (gallery, in order) and
`tags: string[]` (tag names — created automatically if they don't exist yet).

### Blog
Same pattern as Projects (`/blog`, `/blog/slug/:slug`, `/blog/admin`), minus the
image gallery — just a single `coverMediaId`. Author is set automatically from the
JWT on create.

### Contact
| Method | Path | |
|---|---|---|
| POST | `/contact` (public contact form) | 🔓 |
| GET | `/contact`, `/contact/:id` | 🔒 |
| PATCH | `/contact/:id/read` | 🔒 |
| DELETE | `/contact/:id` | 🔒 |

## Useful Prisma commands

| Command | What it does |
|---|---|
| `npx prisma studio` | Visual database browser/editor |
| `npx prisma db push` | Sync schema.prisma → database (dev) |
| `npx prisma migrate dev --name init` | Versioned migration (once you have real data) |
| `npx prisma generate` | Regenerate the typed client after any schema change |

## Next step

Backend is feature-complete. Next up: `packages/types` + `packages/api-client`
(shared TypeScript so the admin dashboard and public site don't duplicate API
calls), then the admin dashboard itself.
