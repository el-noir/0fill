import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Webhook, Activity, Save } from 'lucide-react';
import { toast } from 'sonner';
import { getFormAutomations, syncFormAutomations } from '@/lib/api/organizations';

interface WebhookConfig {
    id: string;
    url: string;
    secret: string;
    triggerOn: string[];
}

interface AutomationPanelProps {
    orgId: string;
    formId: string;
    form: any;
    onUpdate: (updatedForm: any) => void;
}

export function AutomationPanel({ orgId, formId, form, onUpdate }: AutomationPanelProps) {
    const [automations, setAutomations] = useState<{ type: string, config: WebhookConfig }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadAutomations() {
            try {
                const data = await getFormAutomations(orgId, formId);
                setAutomations(data || []);
            } catch (error: any) {
                toast.error('Failed to load automations');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        loadAutomations();
    }, [orgId, formId]);

    const handleAddWebhook = () => {
        const newWebhook = {
            type: 'webhook',
            config: {
                id: Math.random().toString(36).substr(2, 9),
                url: '',
                secret: '',
                triggerOn: ['submission.completed']
            }
        };
        setAutomations([...automations, newWebhook]);
    };

    const handleRemoveWebhook = (index: number) => {
        const newAutomations = [...automations];
        newAutomations.splice(index, 1);
        setAutomations(newAutomations);
    };

    const handleUpdateConfig = (index: number, field: keyof WebhookConfig, value: any) => {
        const newAutomations = [...automations];
        const config = newAutomations[index].config as WebhookConfig;
        
        if (field === 'triggerOn') {
            const currentTriggers = config.triggerOn || [];
            if (currentTriggers.includes(value)) {
                config.triggerOn = currentTriggers.filter(t => t !== value);
            } else {
                config.triggerOn = [...currentTriggers, value];
            }
        } else {
            config[field] = value as never;
        }
        
        setAutomations(newAutomations);
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Clean out empty URLs before saving
        const cleaned = automations.filter(a => a.type === 'webhook' && a.config.url.trim() !== '');
        
        try {
            await syncFormAutomations(orgId, formId, cleaned);
            toast.success('Automations saved successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to save automations');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
            </div>
        );
    }

    return (
        <div className="bg-[#0B0B0F] border border-gray-800/80 rounded-md p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-sm">Automations & Webhooks</h3>
                        <p className="text-gray-500 text-[11px]">Send submission data to over 5,000+ apps.</p>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-brand-purple hover:bg-[#0da372] text-white text-xs px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            <div className="space-y-6">
                {automations.map((automation, idx) => (
                    <div key={automation.config.id || idx} className="border border-gray-800 rounded-lg p-5 bg-[#111116]/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Webhook className="w-4 h-4 text-emerald-400" />
                                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Outgoing Webhook</h4>
                            </div>
                            <button
                                onClick={() => handleRemoveWebhook(idx)}
                                title="Remove Webhook"
                                className="text-gray-600 hover:text-red-400 p-1 rounded-md transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] text-gray-400 font-medium mb-1">Payload URL</label>
                                <input
                                    type="url"
                                    value={automation.config.url}
                                    onChange={(e) => handleUpdateConfig(idx, 'url', e.target.value)}
                                    placeholder="https://hooks.zapier.com/hooks/catch/1234..."
                                    className="w-full bg-black/40 border border-gray-800 rounded-md px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-purple"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-gray-400 font-medium mb-1">Secret (Optional)</label>
                                <input
                                    type="password"
                                    value={automation.config.secret || ''}
                                    onChange={(e) => handleUpdateConfig(idx, 'secret', e.target.value)}
                                    placeholder="Add a secret token to verify payload origin"
                                    className="w-full bg-black/40 border border-gray-800 rounded-md px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-purple"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-gray-400 font-medium mb-2">Trigger Events</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={(automation.config.triggerOn || []).includes('submission.completed')}
                                            onChange={() => handleUpdateConfig(idx, 'triggerOn', 'submission.completed')}
                                            className="w-3.5 h-3.5 bg-black border-gray-800 rounded text-brand-purple focus:ring-brand-purple focus:ring-offset-black"
                                        />
                                        <span className="text-[11px] text-gray-300">Completed Submissions</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={(automation.config.triggerOn || []).includes('submission.abandoned')}
                                            onChange={() => handleUpdateConfig(idx, 'triggerOn', 'submission.abandoned')}
                                            className="w-3.5 h-3.5 bg-black border-gray-800 rounded text-brand-purple focus:ring-brand-purple focus:ring-offset-black"
                                        />
                                        <span className="text-[11px] text-gray-300">Abandoned Form Leads</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddWebhook}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-800 hover:border-brand-purple/50 bg-[#111116] hover:bg-brand-purple/5 text-gray-400 hover:text-brand-purple text-xs font-medium py-4 rounded-lg transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Webhook Integration
                </button>
            </div>
        </div>
    );
}
