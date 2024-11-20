import { useState } from 'react';
import { LeadList } from './components/LeadList';
import { LeadForm } from './components/LeadForm';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function LeadsPage() {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button onClick={() => setIsAddingLead(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>

      <LeadList 
        onEdit={setSelectedLead}
        onAddNew={() => setIsAddingLead(true)}
      />

      <Dialog 
        open={isAddingLead || !!selectedLead} 
        onOpenChange={(open) => {
          setIsAddingLead(open);
          if (!open) setSelectedLead(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <LeadForm
            lead={selectedLead}
            onClose={() => {
              setIsAddingLead(false);
              setSelectedLead(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}