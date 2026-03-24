---
name: audit
description: Run a full codebase audit — TypeScript errors, secret scanning, Edge Function checks, dead code detection, and build verification
user_invocable: true
---

# Codebase Auditor

Run the audit script and analyze the results. Fix any critical issues found automatically.

## Steps

1. Run `bash scripts/audit.sh` and capture the output
2. Summarize the findings for the user in a clear table
3. For any FAIL items:
   - **Type errors**: Read the failing files and fix the type issues
   - **Exposed secrets**: Immediately remove them and warn the user
   - **Missing CORS**: Add CORS headers to the edge function
   - **Build failures**: Diagnose and fix the build error
4. For WARN items: Note them but don't auto-fix unless trivial
5. Re-run the audit after fixes to confirm everything passes
6. If all checks pass on first run, just report the clean bill of health
