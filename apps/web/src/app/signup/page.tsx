import PersonAddIcon from '@mui/icons-material/PersonAdd';
import type { Metadata } from 'next';

import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Sign up | Recipes for One' };

export default function SignUpPage() {
  return (
    <ComingSoon icon={<PersonAddIcon />} title="Sign up">
      Create an account to save recipes, set how many people you usually cook for, and plan your week
      without leftovers.
    </ComingSoon>
  );
}
