# Admin Role Setup Guide

## Overview
This app now uses role-based access control (RBAC) to protect recipe data. Only users with the `admin` role can create, update, or delete recipes in the database.

## Assigning Admin Role

To make a user an admin, you need to insert a record into the `user_roles` table using Lovable Cloud backend.

### Method 1: Using Lovable Cloud Backend (Recommended)

1. Click on "View Backend" in your Lovable dashboard
2. Go to the SQL Editor
3. Run this query to make a user an admin:

```sql
-- Replace 'USER_EMAIL_HERE' with the actual user's email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'USER_EMAIL_HERE'
ON CONFLICT (user_id, role) DO NOTHING;
```

### Method 2: Get User ID First

If you know the user's ID (UUID), you can directly insert:

```sql
-- Replace 'USER_UUID_HERE' with the actual UUID
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin'::public.app_role)
ON CONFLICT (user_id, role) DO NOTHING;
```

### Verify Admin Status

To check who has admin access:

```sql
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

## Available Roles

- `admin` - Can create, update, and delete recipes
- `moderator` - Reserved for future use (currently no special permissions)
- `user` - Default role (read-only access to recipes)

## Security Features

✅ **Recipe Protection**: Only admins can modify recipe database  
✅ **Role-Based Access**: Uses secure `has_role()` function to prevent privilege escalation  
✅ **RLS Policies**: Row-level security prevents unauthorized access  
✅ **Separate Roles Table**: Roles stored in dedicated table (not in profiles)

## Using Admin Status in Code

```typescript
import { useUserRole } from '@/hooks/useUserRole';

function MyComponent() {
  const { isAdmin, isLoading } = useUserRole();

  if (isLoading) return <Loading />;

  return (
    <div>
      {isAdmin && (
        <Button onClick={handleAdminAction}>
          Admin Only Action
        </Button>
      )}
    </div>
  );
}
```

## Important Notes

⚠️ **Never check admin status using client-side storage** - Always use the `useUserRole` hook which queries the database  
⚠️ **Do not store roles in localStorage** - This can be manipulated by attackers  
⚠️ **Server-side validation** - All admin actions are validated on the database level with RLS policies

## Removing Admin Access

To revoke admin access:

```sql
-- Replace 'USER_EMAIL_HERE' with the user's email
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'USER_EMAIL_HERE')
  AND role = 'admin';
```
