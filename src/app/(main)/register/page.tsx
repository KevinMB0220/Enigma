'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAccount } from 'wagmi';
import { Loader2, AlertCircle, CheckCircle2, Wallet, BookOpen, Bot, Database, Fingerprint } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WalletConnectButton } from '@/components/shared/wallet-connect-button';
import { FlashlightCursor } from '@/components/shared/flashlight-cursor';
import { IndustrialCorner } from '@/components/shared/industrial-corner';
import { useRegisterAgent } from '@/hooks/use-register-agent';
import { cn } from '@/lib/utils/index';

const formSchema = z.object({
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),
  type: z.enum(['TRADING', 'LENDING', 'GOVERNANCE', 'ORACLE', 'CUSTOM'], {
    errorMap: () => ({ message: 'Please select an agent type' }),
  }),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

const AGENT_TYPES = [
  { value: 'TRADING', label: 'Trading', description: 'Automated trading bots' },
  { value: 'LENDING', label: 'Lending', description: 'DeFi lending protocols' },
  { value: 'GOVERNANCE', label: 'Governance', description: 'DAO governance agents' },
  { value: 'ORACLE', label: 'Oracle', description: 'Data oracle providers' },
  { value: 'CUSTOM', label: 'Custom', description: 'Other autonomous agents' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { mutate: registerAgent, isPending, isError, error } = useRegisterAgent();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      name: '',
      type: undefined,
      description: '',
    },
  });

  const selectedType = watch('type');

  const onSubmit = (data: FormData) => {
    registerAgent(
      {
        ...data,
        address: data.address.toLowerCase() as `0x${string}`,
      },
      {
        onSuccess: (result) => {
          setShowSuccess(true);
          setTimeout(() => {
            router.push(`/agents/${result?.agent.address}`);
          }, 2000);
        },
      }
    );
  };

  if (showSuccess) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[#05070A] relative overflow-hidden">
        <FlashlightCursor />
        <div className="text-center z-10 p-12 border border-[#4ADE80]/40 bg-[#0F1219] relative max-w-lg">
          <IndustrialCorner position="tl" />
          <IndustrialCorner position="tr" />
          <IndustrialCorner position="bl" />
          <IndustrialCorner position="br" />
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-[#4ADE80]/10 border border-[#4ADE80]/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-[#4ADE80]" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">
            INIT_SUCCESSful
          </h1>
          <p className="text-[#64748B] font-mono text-[10px] uppercase tracking-widest">
            Redirecting to node profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-[#05070A] relative overflow-hidden p-4 sm:p-8">
      <FlashlightCursor />
      
      {!isConnected ? (
        <div className="flex flex-col items-center justify-center text-center space-y-12 animate-fade-in group z-10">
          <div className="text-center space-y-4 mb-4">
             <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-[1px] bg-[#4ADE80]/30" />
                <span className="text-[12px] font-black text-[#4ADE80] uppercase tracking-[0.4em]">Initialize Registry</span>
                <div className="w-12 h-[1px] bg-[#4ADE80]/30" />
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
               FLARE Nodes
             </h1>
          </div>

          <div className="relative">
            <div className="h-44 w-44 flex items-center justify-center relative">
               <div className="absolute inset-0 border-2 border-[#4ADE80]/10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-45" />
               <div className="absolute inset-4 border border-[#4ADE80]/20 transition-all duration-500 group-hover:-rotate-90" />
               <Wallet className="h-14 w-14 text-[#4ADE80]/60 group-hover:text-[#4ADE80] transition-colors" />
            </div>
            <div className="absolute -top-2 -right-2 h-4 w-4 bg-[#FB7185] animate-pulse" />
          </div>

          <div className="space-y-6">
            <p className="text-xs text-[#64748B] uppercase tracking-[0.3em] leading-relaxed max-w-sm mx-auto font-bold opacity-80">
              Identity required to authorize node ownership and signature metadata.
            </p>
            <WalletConnectButton className="h-16 px-16 rounded-none border-[#4ADE80]/40 hover:border-[#4ADE80] hover:bg-[#4ADE80]/5 text-[#4ADE80] font-black uppercase tracking-[0.4em] transition-all shadow-[0_0_30px_rgba(74,222,128,0.1)]" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_450px] gap-0 border border-[#4ADE80]/20 bg-[#0F1219] relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          <IndustrialCorner position="tl" />
          <IndustrialCorner position="tr" />
          <IndustrialCorner position="bl" />
          <IndustrialCorner position="br" />

          {/* Left Side: Industrial Titles & Info */}
          <div className="flex flex-col p-10 bg-[#05070A]/60 border-r border-[#4ADE80]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ADE80]/[0.02] -translate-y-1/2 translate-x-1/2 rotate-45" />
            
            <div className="space-y-1 mb-12">
              <p className="text-[11px] font-black text-[#4ADE80]/60 uppercase tracking-[0.4em]">Step 01</p>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Initialize Registry</h3>
              <p className="text-[14px] font-black text-[#4ADE80] uppercase tracking-tighter opacity-80">FLARE Nodes</p>
            </div>

            <div className="flex-1 space-y-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-[#4ADE80]/10 border border-[#4ADE80]/20 flex items-center justify-center">
                     <Bot className="h-4 w-4 text-[#4ADE80]" />
                   </div>
                   <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Protocol_Entry</span>
                 </div>
                 <p className="text-[12px] text-[#64748B] leading-relaxed font-medium uppercase tracking-tight">
                   Add your autonomous agent for verification, trust scoring, and network synchronization.
                 </p>
              </div>

              <div className="space-y-4 border-l border-[#4ADE80]/10 pl-6">
                 <div className="flex items-center gap-3">
                   <div className="h-1.5 w-1.5 bg-[#4ADE80]" />
                   <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-[0.2em]">Verification Phase 01</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="h-1.5 w-1.5 bg-[#4ADE80]/40" />
                   <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-[0.2em] opacity-40">Telemetry Handshake</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="h-1.5 w-1.5 bg-[#4ADE80]/10" />
                   <span className="text-[9px] font-mono text-[#64748B] uppercase tracking-[0.2em] opacity-20">Database Write</span>
                 </div>
              </div>
            </div>

            <Link
              href="/docs"
              className="flex items-center gap-3 p-4 border border-[#4ADE80]/10 bg-[#4ADE80]/5 hover:bg-[#4ADE80]/10 transition-all mt-8"
            >
              <BookOpen className="h-4 w-4 text-[#4ADE80]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4ADE80]">Technical_Guide</span>
            </Link>
          </div>

          {/* Right Side: Dense Industrial Form */}
          <div className="flex flex-col p-10 bg-[#0F1219]">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 h-full flex flex-col">
              <div className="space-y-6 flex-1">
                {/* Contract Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Contract_Address</Label>
                  <Input
                    id="address"
                    placeholder="0x000..."
                    {...register('address')}
                    className={cn(
                      'h-12 rounded-none bg-[#05070A] border-[#4ADE80]/20 font-mono text-[11px] font-black text-[#4ADE80] placeholder:text-[#4ADE80]/10',
                      'focus:ring-1 focus:ring-[#4ADE80]/40 focus:border-[#4ADE80] transition-all',
                      errors.address && 'border-red-500/40'
                    )}
                    disabled={isPending}
                  />
                  {errors.address && <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest">{errors.address.message}</p>}
                </div>

                {/* Agent Label */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Operational_ID</Label>
                  <Input
                    id="name"
                    placeholder="SYSTEM_ALPHA"
                    {...register('name')}
                    className={cn(
                      'h-12 rounded-none bg-[#05070A] border-[#4ADE80]/20 font-mono text-[11px] font-black text-white placeholder:text-[#4ADE80]/10',
                      'focus:ring-1 focus:ring-[#4ADE80]/40 focus:border-[#4ADE80] transition-all',
                      errors.name && 'border-red-500/40'
                    )}
                    disabled={isPending}
                  />
                </div>

                {/* Protocol Class */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Protocol_Class</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) => setValue('type', value as FormData['type'])}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      className={cn(
                        'h-12 rounded-none bg-[#05070A] border-[#4ADE80]/20 font-mono text-[11px] font-black text-[#4ADE80]',
                        errors.type && 'border-red-500/40'
                      )}
                    >
                      <SelectValue placeholder="CLASS_NULL" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-[#4ADE80]/20 bg-[#0F1219] text-[#4ADE80]">
                      {AGENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="focus:bg-[#4ADE80]/10 focus:text-[#4ADE80] font-mono text-[10px] uppercase tracking-widest">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Execution Logs */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-[#475569]">Execution_Summary</Label>
                  <Textarea
                    id="description"
                    placeholder="Short node logs..."
                    rows={3}
                    {...register('description')}
                    className={cn(
                      'rounded-none bg-[#05070A] border-[#4ADE80]/20 font-mono text-[11px] font-black text-[#64748B] placeholder:text-[#4ADE80]/10 resize-none min-h-[90px]',
                      'focus:ring-1 focus:ring-[#4ADE80]/40 focus:border-[#4ADE80] transition-all',
                      errors.description && 'border-red-500/40'
                    )}
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-[#4ADE80]/10">
                <Button
                  type="submit"
                  disabled={isPending}
                  className={cn(
                    'w-full h-14 rounded-none font-black uppercase tracking-[0.4em] text-[12px]',
                    'bg-[#4ADE80] text-[#05070A] hover:bg-[#22D3EE] transition-all duration-300',
                    'shadow-[0_4px_20px_rgba(74,222,128,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)]',
                    'disabled:opacity-20'
                  )}
                >
                  {isPending ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      EXECUTING...
                    </div>
                  ) : (
                    'Execute_Registration'
                  )}
                </Button>
              </div>

              {isError && (
                <div className="mt-4 p-3 border border-red-500/20 bg-red-500/5 text-center">
                  <p className="text-[9px] font-mono text-red-500 uppercase tracking-widest">
                    SYSTEM_ERR: {error?.message || 'REG_FAILED'}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
