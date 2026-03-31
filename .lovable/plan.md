

## Fix: Make Published Course Pages Match Builder Preview

### Problem
The builder preview uses `DynamicCoursePreview` → `CourseLandingPreview` (rich Tailwind components, animations, section ordering, layout templates). The public `CoursePage.tsx` uses completely separate inline-styled HTML. They share zero code, so published courses look nothing like the builder.

### Solution
Replace CoursePage's custom inline rendering (lines 252-398) with `DynamicCoursePreview`, the same component the builder uses. Keep CoursePage's data fetching, SEO, enrollment logic, and loading/error states.

### Changes

**File: `src/pages/CoursePage.tsx`**

1. Add imports for `DynamicCoursePreview` and `ExtendedCourse`
2. Add a mapping function `mapRowToExtendedCourse(row)` that converts the DB row into an `ExtendedCourse` shape — maps `curriculum` → `modules`, passes through `design_config`, `section_order`, `page_sections`, etc.
3. Replace all inline rendering (hero, curriculum, FAQ, instructor, CTA, footer — lines 252-397) with:
   ```tsx
   <DynamicCoursePreview
     course={mappedCourse}
     onEnrollClick={handleEnroll}
   />
   ```
4. Keep: Helmet SEO, owner preview banner, loading spinner, not-found state, enrollment handler
5. Remove: all inline style objects (`sectionPad`, `sectionHeading`, `cardStyle`, `btnStyle`), `openModules` state, color/font resolution helpers (no longer needed since DynamicCoursePreview handles theming)

### What stays the same
- Data fetching logic (public/owner/UUID fallback)
- Enrollment flow with auth redirect
- Course view tracking
- SEO metadata via Helmet
- Loading and not-found states

### Result
Published pages will render identically to the builder preview — same animations, section ordering, layout templates, and design_config theming.

