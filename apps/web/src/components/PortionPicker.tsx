'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
/** The same choices the API allows (Portions.ALLOWED in the domain). */
const OPTIONS = [1, 2, 4, 8];

type PortionPickerProps = {
  /** The portion to show as selected: 2,4,8  */
  value: number;
  /** Called with the number the user clicked. */
  onChange: (portions: number) => void;
};

/**
 * The 1 / 2 / 4 / 8 buttons. It does not remember anything itself: it shows
 * `value`, and reports clicks through `onChange`. RecipeScaler in the browser holds the memory.
 */
export function PortionPicker({ value, onChange }: PortionPickerProps) {

  return (
    <Box sx={{ mb: 5 }}>
      <Typography sx={{ fontWeight: 600, mb: 1 }}>
        Cooking for {value} {value === 1 ? 'person' : 'people'}
      </Typography>
      <Box role="group" aria-label="Portions" sx={{ display: 'flex', gap: 1 }}>
        {OPTIONS.map((option) => (
         <Button
            key={option}
            variant={option === value ? 'contained' : 'outlined'}
            color={option === value ? 'primary' : 'inherit'}
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            sx={{ minWidth: 56 }}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Box>
  );
}