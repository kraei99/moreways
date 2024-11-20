import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useLeadOperations } from '@/hooks/useLeads';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  propertyInterest: z.string().optional(),
  notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: any;
  onClose: () => void;
}

export function LeadForm({ lead, onClose }: LeadFormProps) {
  const { createLead, updateLead } = useLeadOperations();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead || {}
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      if (lead) {
        await updateLead.mutateAsync({ id: lead.id, data });
      } else {
        await createLead.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>
          {lead ? 'Edit Lead' : 'Add New Lead'}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input {...register('name')} />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input {...register('email')} type="email" />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input {...register('phone')} />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone.message}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Property Interest</label>
          <Input {...register('propertyInterest')} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea {...register('notes')} />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {lead ? 'Update' : 'Add'} Lead
        </Button>
      </DialogFooter>
    </form>
  );
}