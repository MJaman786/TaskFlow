import { useMutation } from '@tanstack/react-query';
import { nlpSuggestTaskApi } from '../api/task.api';
import type { NlpSuggestPayload } from '../types/task.types';

interface NlpSuggestVariables {
  payload: NlpSuggestPayload;
}

export default function useNlpSuggest() {
  return useMutation({
    mutationFn: async ({ payload }: NlpSuggestVariables) => {
      const res = await nlpSuggestTaskApi(payload);
      return res;
    },
  });
}