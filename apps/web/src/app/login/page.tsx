import LoginIcon from '@mui/icons-material/Login';
import type { Metadata } from 'next';

import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Login | Recipes for One' };

export default function LoginPage() {
  return (
    <ComingSoon icon={<LoginIcon />} title="Login">
      Log in to keep your favourite recipes and your Sunday meal-prep plans in one place. Until then,
      every recipe works without an account.
    </ComingSoon>
  );
}
