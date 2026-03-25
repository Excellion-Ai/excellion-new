

## Add Manual Design Controls to the Builder Refine Panel

### What We're Building
When a course exists in the builder, add a third tab called "Design" (alongside Build and Help) that gives creators direct manual controls for customizing their course's visual appearance — no AI prompt needed.

### Why Lovable (Not Claude Code)
This is purely frontend UI work. The `ThemeEditor` component and `DesignConfig` type already exist. No database schema or edge function changes needed.

### Implementation

**File: `src/components/secret-builder/BuilderChatPanel.tsx`**

1. Add a "Design" tab to the tab bar (using a Palette icon), visible only when `hasCourse` is true
2. Create a `DesignTab` component inside the file that renders manual controls:
   - **Colors section**: Color pickers for primary, secondary, accent, background, card background, text, and muted text (reusing the pattern from `ThemeEditor`)
   - **Typography section**: Font selects for heading and body fonts (same 8 font options already defined)
   - **Layout section**: Spacing (compact/normal/relaxed), border radius (none/small/medium/large), hero style (gradient/image/minimal/split)
   - **Template section**: 4 template cards (creator/technical/academic/visual) for quick style switching
3. Wire the Design tab to directly update the course's `design_config` via a new `onDesignUpdate` callback prop

**File: `src/components/secret-builder/BuilderShell.tsx`**

4. Pass a new `onDesignUpdate` handler to `BuilderChatPanel` that:
   - Merges the updated design config into the current `courseSpec`
   - Triggers the existing autosave debounce
   - Sets `saveStatus` to `"unsaved"`

### Props Change
```typescript
// Add to BuilderChatPanelProps
onDesignUpdate?: (config: DesignConfig) => void;
currentDesignConfig?: DesignConfig;
```

### Technical Notes
- Reuses the `DesignConfig` interface from `ThemeEditor.tsx` (colors, fonts, spacing, borderRadius, heroStyle)
- Color pickers use native `<input type="color">` (same as ThemeEditor)
- Font options: Inter, DM Sans, Playfair Display, Poppins, Space Grotesk, Montserrat, Lora, Merriweather
- Changes apply instantly to the preview via the existing `DynamicCoursePreview` CSS variable injection
- No new dependencies required

