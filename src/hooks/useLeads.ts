import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi, type LeadCreate, type LeadUpdate, type LeadSearchParams } from '@/services/api/lead';
import { useToast } from '@/components/ui/use-toast';

export function useLeads(params?: LeadSearchParams) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadApi.getAll(params),
  });

  return {
    leads: data,
    isLoading,
    error,
  };
}

export function useLeadOperations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createLead = useMutation({
    mutationFn: leadApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Lead Created',
        description: 'New lead has been successfully created.',
      });
    },
  });

  const updateLead = useMutation({
    mutationFn: ({ id, data }: { id: string; data: LeadUpdate }) => 
      leadApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Lead Updated',
        description: 'Lead has been successfully updated.',
      });
    },
  });

  const deleteLead = useMutation({
    mutationFn: leadApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({
        title: 'Lead Deleted',
        description: 'Lead has been successfully deleted.',
      });
    },
  });

  return {
    createLead,
    updateLead,
    deleteLead,
  };
}

export function useLeadDetails(id: string) {
  const { data, isLoading } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadApi.getById(id),
    enabled: Boolean(id),
  });

  const communications = useQuery({
    queryKey: ['lead', id, 'communications'],
    queryFn: () => leadApi.getCommunications(id),
    enabled: Boolean(id),
  });

  return {
    lead: data,
    isLoading,
    communications: communications.data,
    isCommunicationsLoading: communications.isLoading,
  };
}