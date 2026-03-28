'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAccount, useSignMessage } from 'wagmi';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportModalProps {
  agentAddress: string;
}

const SIGN_MESSAGE = 'Sign this message to verify your wallet ownership on FLARE';

const REPORT_REASONS = [
  { value: 'PROXY_HIDDEN', label: 'Hidden Proxy' },
  { value: 'INCONSISTENT_BEHAVIOR', label: 'Inconsistent Behavior' },
  { value: 'SCAM', label: 'Scam / Fraud' },
  { value: 'OTHER', label: 'Other' },
] as const;

export function ReportModal({ agentAddress }: ReportModalProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const submitMutation = useMutation({
    mutationFn: async (data: {
      reason: string;
      description: string;
      signature: string;
      userAddress: string;
    }) => {
      const res = await fetch(`/api/v1/agents/${agentAddress}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Failed to submit report');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Report submitted successfully');
      resetForm();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
      setShowConfirm(false);
    },
  });

  const resetForm = () => {
    setReason('');
    setDescription('');
    setShowConfirm(false);
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const signature = await signMessageAsync({ message: SIGN_MESSAGE });
      submitMutation.mutate({
        reason,
        description: description.trim(),
        signature,
        userAddress: address,
      });
    } catch {
      toast.error('Signature rejected');
    }
  };

  const canSubmit = reason && description.trim().length >= 10;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          disabled={!isConnected}
        >
          <AlertTriangle size={14} className="mr-1" />
          Report Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[rgba(15,17,23,0.95)] border-[rgba(255,255,255,0.1)]">
        <DialogHeader>
          <DialogTitle className="text-white">Report Agent</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Report suspicious or malicious behavior. False reports may result in account restrictions.
          </DialogDescription>
        </DialogHeader>

        {!showConfirm ? (
          <div className="space-y-4">
            {/* Reason Select */}
            <div>
              <label htmlFor="report-reason" className="mb-2 block text-sm font-medium text-text-secondary">
                Reason <span className="text-red-400">*</span>
              </label>
              <Select value={reason} onValueChange={setReason} required>
                <SelectTrigger id="report-reason" aria-required="true" className="bg-[rgba(31,41,55,0.5)] border-[rgba(255,255,255,0.08)] text-white">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent className="bg-[rgba(15,17,23,0.95)] border-[rgba(255,255,255,0.1)]">
                  {REPORT_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="text-white hover:bg-[rgba(59,130,246,0.1)]">
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="report-description" className="mb-2 block text-sm font-medium text-text-secondary">
                Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                id="report-description"
                placeholder="Describe the issue in detail (min 10 characters)"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                className="bg-[rgba(31,41,55,0.5)] border-[rgba(255,255,255,0.08)] text-white placeholder:text-gray-500 resize-none"
                rows={4}
                aria-required="true"
                aria-describedby="report-char-count"
              />
              <div id="report-char-count" className="mt-1 text-right text-xs text-text-muted" aria-live="polite">
                {description.length}/1000
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 p-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-yellow-500" />
              <p className="text-xs text-yellow-400">
                Filing false reports is a violation of our terms. Repeated false reports may result in your account being restricted.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-[rgba(255,255,255,0.1)] text-text-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowConfirm(true)}
                disabled={!canSubmit}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Continue
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
              <p className="text-sm text-yellow-400">
                Are you sure you want to submit this report? This action will be recorded on your wallet address.
              </p>
              <div className="mt-3 space-y-1 text-sm text-text-secondary">
                <p><strong>Reason:</strong> {REPORT_REASONS.find(r => r.value === reason)?.label}</p>
                <p><strong>Description:</strong> {description.slice(0, 100)}{description.length > 100 ? '...' : ''}</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="border-[rgba(255,255,255,0.1)] text-text-secondary"
              >
                Go Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {submitMutation.isPending ? 'Submitting...' : 'Confirm Report'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
