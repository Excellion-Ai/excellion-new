-- Revoke direct RPC execute on user_has_paid_access().
-- search_path already pinned to 'public'. Not used in any RLS policies.
-- Only prevents /rest/v1/rpc/user_has_paid_access from being callable
-- by anon or authenticated roles directly.

revoke execute on function public.user_has_paid_access() from anon, authenticated, public;
