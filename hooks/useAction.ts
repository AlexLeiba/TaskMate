import { ActionState } from '@/lib/createSafeAction';
import { useState, useCallback } from 'react';

type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionState<TInput, TOutput>>;

type OptionsType<TOutput> = {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string | null) => void;
  onLoading?: (loading: boolean) => void;
  onComplete?: (state: boolean) => void;
};

export function useAction<TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: OptionsType<TOutput> = {}
) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (input: TInput) => {
      setLoading(true);

      try {
        const result = await action(input);

        if (!result) {
          return;
        }

        if (result.error) {
          setError(result.error);

          options.onError?.(result.error);
          return;
        }

        if (result.data) {
          setData(result.data as TOutput);

          options.onSuccess?.(result.data as TOutput);
          return;
        }
      } catch (error: any) {
        setError(error.message as string);

        options.onError?.(error.message);
        return;
      } finally {
        setLoading(false);
        options.onComplete?.(true);
      }
    },
    [action, options]
  );

  return {
    execute,
    loading,
    error,
    data,
  };
}
