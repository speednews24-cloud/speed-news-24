import { useInfiniteQuery } from '@tanstack/react-query';
import { articleApi } from '../services/api.js';

export function useInfiniteArticles(params = {}) {
  return useInfiniteQuery({
    queryKey: ['articles', params],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => articleApi.list({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined
  });
}
