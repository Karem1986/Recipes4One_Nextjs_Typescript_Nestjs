import StorefrontIcon from '@mui/icons-material/Storefront';
import type { Metadata } from 'next';

import { ComingSoon } from '@/components/ComingSoon';

export const metadata: Metadata = { title: 'Green businesses in the Netherlands | Recipes for One' };

export default function GreenBusinessesPage() {
  return (
    <ComingSoon icon={<StorefrontIcon />} title="Green businesses in the Netherlands">
      Zero-waste shops, bulk stores and plant-based products, so you can buy exactly what a
      recipe for one needs and nothing that ends up in the bin.
    </ComingSoon>
  );
}
