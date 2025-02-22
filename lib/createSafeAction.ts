export type ActionState<TOutput, TInput> = {
  error?: string | null;
  data?: TOutput;
};
