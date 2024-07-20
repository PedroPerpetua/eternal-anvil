import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';
import * as Yup from 'yup';

function useYupResolver(validationSchema: Yup.AnyObjectSchema) {
  return useCallback(
    async (data: FieldValues) => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });
        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: (errors as Yup.ValidationError).inner.reduce(
            (allErrors, currentError) => ({
              ...allErrors,
              [currentError.path!]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );
}

export default useYupResolver;
