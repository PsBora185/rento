import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();

  const isOwner = user?.role === 'OWNER';
  const isRenter = user?.role === 'RENTER';
  const role = user?.role;

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  return {
    role,
    isOwner,
    isRenter,
    hasRole,
  };
};

export default useRole;