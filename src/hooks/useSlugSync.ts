import { useCallback, useState } from 'react';
import slugify from 'slugify';

const slugOpts = { lower: true };

/**
 * Hook to sync the `slug` field with `name.en` / `name.en` changes. - When name.en changes and the
 * user hasn't manually touched the slug, the slug is auto-generated via `slugify()`. - When the
 * user manually edits the slug, auto-sync is disabled.
 */
export default function useSlugSync() {
  const [slugTouched, setSlugTouched] = useState(false);

  /**
   * Call when loading existing data to determine whether the slug differs from the slugified name —
   * i.e. the user has manually set it before.
   */
  const initSlugTouched = useCallback((nameEn: string, slug: string) => {
    setSlugTouched(slugify(nameEn, slugOpts) !== slug);
  }, []);

  /**
   * OnChange handler for the name.en field. Pass `setFieldValue` from your form so this hook can
   * update both name.en and slug in one shot.
   */
  const handleNameEnChange = useCallback(
    (value: string, setFieldValue: (field: string, value: unknown) => void) => {
      setFieldValue('name.en', value);
      if (!slugTouched) {
        setFieldValue('slug', slugify(value, slugOpts));
      }
    },
    [slugTouched],
  );

  /** OnChange handler for the slug field. */
  const handleSlugChange = useCallback(
    (value: string, setFieldValue: (field: string, value: unknown) => void) => {
      setSlugTouched(true);
      setFieldValue('slug', value);
    },
    [],
  );

  return { initSlugTouched, handleNameEnChange, handleSlugChange };
}
