import React, { useState } from 'react';
import { MediumDef, AspectRatioType } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

interface AddMediumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMedium: (newMedium: MediumDef) => void;
}

export const AddMediumModal: React.FC<AddMediumModalProps> = ({
  isOpen,
  onClose,
  onAddMedium,
}) => {
  const [name, setName] = useState('');
  const [badge, setBadge] = useState('Custom Media');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [description, setDescription] = useState('');
  const [envPrompt, setEnvPrompt] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = `custom-${Date.now()}`;
    const newMedium: MediumDef = {
      id,
      name: name.trim(),
      badge: badge.trim() || 'Custom Media',
      description: description.trim() || `Custom display medium: ${name.trim()}`,
      aspectRatio,
      iconName: 'Tv',
      category: 'outdoor',
      defaultPromptEnv:
        envPrompt.trim() ||
        `Displaying the product in a high-end ${name.trim()} setting. Masterclass commercial photography lighting, clean architectural context. Absolutely no people, no humans, strictly uninhabited.`,
    };

    onAddMedium(newMedium);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Add Custom Medium</h3>
              <p className="text-xs text-zinc-500">
                Imagine your product in any format or environment
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Medium Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Airport Terminal Lightbox, Bus Stop Canopy"
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Category / Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Transit Media, Ambient"
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-700 uppercase tracking-wider mb-1">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatioType)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              >
                <option value="1:1">1:1 (Square)</option>
                <option value="16:9">16:9 (Landscape Billboard)</option>
                <option value="3:4">3:4 (Portrait Print)</option>
                <option value="4:3">4:3 (Landscape Editorial)</option>
                <option value="9:16">9:16 (Vertical Story / Totem)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Brief Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. An illuminated glass showcase in a modern international terminal."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-700 uppercase tracking-wider mb-1">
              Environment & Staging Directives
            </label>
            <textarea
              rows={3}
              value={envPrompt}
              onChange={(e) => setEnvPrompt(e.target.value)}
              placeholder="Describe lighting, surface textures, architectural surroundings..."
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg cursor-pointer transition-colors"
            >
              Add Medium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
