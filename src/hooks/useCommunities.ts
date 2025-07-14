// hooks/useCommunities.ts

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCommunity, fetchCommunities, followCommunity, unfollowCommunity } from '../lib/api'

export const useCreateCommunity = () => {
  return useMutation({
    mutationFn: createCommunity,
  })
}

export const useCommunities = () => {
  return useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      const result = await fetchCommunities()
      console.log('[useCommunities] Result:', result) // << Important
      return result
    },
  })
}


export const useFollowCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: followCommunity,
    onMutate: async ({ communityId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['communities'] })

      const previousCommunities = queryClient.getQueryData<any[]>(['communities'])

      queryClient.setQueryData(['communities'], (old: any[] = []) =>
        old.map((community) =>
          community.$id === communityId
            ? { ...community, followers: [...(community.followers || []), userId] }
            : community
        )
      )

      return { previousCommunities }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCommunities) {
        queryClient.setQueryData(['communities'], context.previousCommunities)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
    },
  })
}

export const useUnfollowCommunity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unfollowCommunity,
    onMutate: async ({ communityId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ['communities'] })

      const previousCommunities = queryClient.getQueryData<any[]>(['communities'])

      queryClient.setQueryData(['communities'], (old: any[] = []) =>
        old.map((community) =>
          community.$id === communityId
            ? {
                ...community,
                followers: (community.followers || []).filter((id: string) => id !== userId),
              }
            : community
        )
      )

      return { previousCommunities }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCommunities) {
        queryClient.setQueryData(['communities'], context.previousCommunities)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
    },
  })
}