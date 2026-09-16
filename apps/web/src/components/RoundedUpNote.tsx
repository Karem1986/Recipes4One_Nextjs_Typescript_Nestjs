import KitchenIcon from '@mui/icons-material/Kitchen';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import type { RoundedUp } from '@/lib/api';
import { formatName, formatQuantity, formatSpoonAmount } from '@/lib/format-ingredients';

type RoundedUpNoteProps = {
  /** Counted ingredients to round up: 0.25 can needed --> 1 can used. */
  items: RoundedUp[];
};

/**
 * The anti-waste note: which ingredients were rounded up to whole ones and how
 * much the recipe strictly needed. Shows nothing when nothing was rounded.
 * For one person, the app rounds the cans up and tells you why. At four, the recipe divides exactly, so the note disappears.
 */
export function RoundedUpNote({ items }: RoundedUpNoteProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <Alert severity="success" icon={<KitchenIcon />} sx={{ mb: 5, borderRadius: '16px' }}>
      <AlertTitle>Rounded up, so nothing is left half-used</AlertTitle>
      <Box component="ul" sx={{ m: 0, mb: 1, pl: 2.5 }}>
        {items.map((item) => {
          const used = { name: item.name, amount: item.used, unit: item.unit };
          const neededUnit = item.unit === 'piece' ? item.name : item.unit;
          return (
            <li key={item.name}>
              <strong>
                {formatQuantity(used)} {formatName(used)}
              </strong>{' '}
              instead of {formatSpoonAmount(item.needed)} {neededUnit}
            </li>
          );
        })}
      </Box>
      <Typography variant="body2">
        Use it all: no half-open can or half an onion waiting in your fridge.
      </Typography>
    </Alert>
  );
}