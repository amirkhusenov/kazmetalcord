# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KazMetalCord is a metal products e-commerce platform for Kazakhstan. The project consists of two main components:

1. **frontend/** - Next.js 15 web application (App Router)
2. **inserter/** - TypeScript data processing scripts for MongoDB data population

## Frontend (Next.js Application)

### Development Commands

```bash
cd frontend
npm run dev        # Start development server on port 3000
npm run build      # Production build with sitemap generation
npm run start      # Start production server
npm run lint       # Run ESLint
npm run analyze    # Build with bundle analyzer (ANALYZE=true)
```

### Architecture

**Framework**: Next.js 15 with App Router and React Server Components

**Key directories**:
- `src/app/(sidebar)/` - Main app routes with shared sidebar layout
  - Dynamic routes use [...slug] pattern for category and product pages
- `src/components/` - React components (UI primitives in `ui/`, business logic at root)
- `src/server/` - Server-side code (database operations, email service)
- `src/lib/` - Shared utilities and helpers
- `src/types/` - TypeScript type definitions

**Data Flow**:
- MongoDB stores metal product catalog with dynamic fields per category
- Server functions in `src/server/db.ts` use React cache() for query deduplication
- Categories organized hierarchically via `categoryPath` arrays
- Transliteration system converts Cyrillic category names to Latin URLs (see `translitCyrillicToLatin` in `src/lib/utils.ts`)

**State Management**:
- Zustand for cart and city selection
- `CategoryPathManager.ts` manages category navigation state

**Styling**: Tailwind CSS with custom design tokens and shadcn/ui components

**Environment Variables** (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `SMTP_*` - Email service configuration (nodemailer)
- `LOKI_*` - Logging service configuration

### Important Patterns

**URL Structure**: Category paths are transliterated from Cyrillic to Latin for URLs. The mapping is stored in `category-translit.json` at the root.

**Database Queries**: All MongoDB operations go through `src/server/connection.ts` which caches the connection. Query functions in `src/server/db.ts` are cached with React's cache() wrapper.

**Type Safety**: Zod schemas validate all data from MongoDB. See `EnhancedMetalItemSchema` and `CategoryFieldValuesSchema` in inserter types.

**Image Optimization**: Images disabled in next.config.ts (`unoptimized: true`). Product category images stored in `public/dannye/` following transliterated category path structure.

**Analytics**: Yandex Metrika and GoatCounter tracking configured in root layout.

## Inserter (Data Processing Scripts)

### Development Commands

```bash
cd inserter
npm run build      # Compile TypeScript
ts-node index.ts   # Run data insertion (processes JSON files and populates MongoDB)
```

### Purpose

The inserter processes raw product data from JSON files and populates MongoDB with:
1. Metal product items with enhanced metadata (transliterated titles, category paths)
2. Category field values (dynamic filters per category)

### Key Scripts

- `index.ts` - Main entry point, orchestrates data processing
- `validate.ts` - Parses leaf folders, validates JSON data against Zod schemas
- `mongo.ts` - Handles MongoDB connection and bulk insertions
- `build-tree.ts` - Builds hierarchical category tree from flat data
- `normalize.ts` - Transliterates Cyrillic filenames/content to Latin
- `image-upload.ts` - Uploads category images to Cloudinary

### Data Structure

**Input**: Nested folder structure in `data/` or `dannye/` where:
- Each leaf folder contains JSON files with product data
- Optional `image.webp` for category image
- Folder names represent category hierarchy

**Output** (MongoDB collections):
- `metal_collection` - Product items with indexes on `Наименование`, `categoryPath`, `translitTitle`
- `category_field_values` - Available filter values per category path

**Environment Variables** (see `.env.example`):
- `MONGODB_URI` - MongoDB connection string
- `CLOUDINARY_*` - Image upload credentials (cloud_name, api_key, api_secret)

### Important Patterns

**Transliteration**: The `translitCyrillicToLatin` function (shared with frontend) converts Cyrillic to Latin, replacing spaces/dots with underscores and removing special characters.

**Batch Processing**: MongoDB insertions use 10,000-item batches for performance.

**Validation**: All data validated with Zod schemas before insertion. Invalid records are caught and logged.

## Shared Concepts

**Category Paths**: Arrays of strings representing hierarchical categories, e.g. `["Металлопрокат", "Листовой", "Горячекатаный"]`

**Transliteration**: Consistent transliteration function used across both projects for URL generation and file system normalization.

**Dynamic Fields**: Product items have a flexible schema - only `Наименование` (name) is required, all other fields are category-specific and stored as string key-value pairs.
