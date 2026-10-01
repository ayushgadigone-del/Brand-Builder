import React, { useState } from 'react';
import { ProductBrand, ColorSwatch } from '../types';
import { X, Sparkles, Plus, Trash2, Box, Palette } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProduct: (product: ProductBrand) => void;
}

const INSPIRATION_TEMPLATES: Partial<ProductBrand>[] = [
  {
    name: 'AURA 01',
    category: 'Ceramic Timepiece',
    tagline: 'Pure ceramic monolith. Time stripped of noise.',
    description: 'A seamless matte sand ceramic watch with a sunken slate dial and brass hand.',
    materials: 'High-density matte zirconium ceramic, brass accents, sapphire crystal',
    finish: 'Velvet matte sandblasted',
    colors: [
      { name: 'Sand Ceramic', hex: '#D6CEBE' },
      { name: 'Slate Dial', hex: '#334155' },
      { name: 'Muted Brass', hex: '#B45309' },
    ],
  },
  {
    name: 'SOLSTICE',
    category: 'Brutalist Concrete Luminaire',
    tagline: 'Cast stone catching warm amber dawn.',
    description: 'A geometric cast aggregate concrete table lamp with a recessed warm diffused glow.',
    materials: 'Textured cast basalt concrete, brushed aluminum cylinder switch',
    finish: 'Raw porous cast architectural concrete',
    colors: [
      { name: 'Basalt Grey', hex: '#4B5563' },
      { name: 'Warm Dawn', hex: '#F59E0B' },
      { name: 'Aluminum', hex: '#94A3B8' },
    ],
  },
  {
    name: 'VERDANT 48',
    category: 'Botanical Cold Brew',
    tagline: 'Single-origin highland coffee extracted over 48 hours.',
    description: 'A ribbed amber apothecary glass flask sealed with a hand-dipped charcoal wax top.',
    materials: 'Heavy embossed amber glass, textured recycled cotton paper label',
    finish: 'Gloss amber glass, matte parchment label',
    colors: [
      { name: 'Deep Amber', hex: '#92400E' },
      { name: 'Charcoal Wax', hex: '#18181B' },
      { name: 'Warm Cream', hex: '#FEF3C7' },
    ],
  },
];

export const NewProductModal: React.FC<NewProductModalProps> = ({
  isOpen,
  onClose,
  onCreateProduct,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [finish, setFinish] = useState('');
  const [colors, setColors] = useState<ColorSwatch[]>([
    { name: 'Obsidian', hex: '#18181B' },
    { name: 'Warm Gold', hex: '#D97706' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563EB');

  const [aesthetic, setAesthetic] = useState('Minimalist Architectural Luxury');
  const [logoDetails, setLogoDetails] = useState('');

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: Partial<ProductBrand>) => {
    if (tmpl.name) setName(tmpl.name);
    if (tmpl.category) setCategory(tmpl.category);
    if (tmpl.tagline) setTagline(tmpl.tagline);
    if (tmpl.description) setDescription(tmpl.description);
    if (tmpl.materials) setMaterials(tmpl.materials);
    if (tmpl.finish) setFinish(tmpl.finish);
    if (tmpl.colors) setColors(tmpl.colors);
    if (tmpl.aesthetic) setAesthetic(tmpl.aesthetic);
    if (tmpl.logoDetails) setLogoDetails(tmpl.logoDetails);
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [
      ...prev,
      { name: newColorName.trim(), hex: newColorHex },
    ]);
    setNewColorName('');
  };

  const handleRemoveColor = (idx: number) => {
    setColors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const lockedColors = colors.length > 0 ? colors : [{ name: 'Neutral', hex: '#334155' }];
    const colorSummary = lockedColors.map((c) => `${c.name} (${c.hex})`).join(', ');

    const newProduct: ProductBrand = {
      name: name.trim(),
      category: category.trim() || 'Signature Object',
      tagline: tagline.trim() || 'Distinctive design consistency.',
      description:
        description.trim() ||
        'A finely detailed commercial product with precise proportions and balanced geometric form.',
      materials: materials.trim() || 'Machined metal, glass, architectural ceramic',
      finish: finish.trim() || 'Satin matte',
      colors: lockedColors,
      aesthetic: aesthetic.trim() || 'Minimalist Contemporary Commercial',
      logoDetails: logoDetails.trim() || `Subtle engraved "${name.trim().toUpperCase()}" wordmark`,
      visualDnaLock: `Maintain exact ${name.trim()} silhouette, ${materials.trim() || 'premium materials'}, and locked palette: ${colorSummary}. Zero human presence.`,
    };

    onCreateProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-zinc-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">
                Add New Product to Imagine
              </h2>
              <p className="text-xs text-zinc-500">
                Define the physical visual DNA to imagine across every medium
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Quick inspiration starter pills */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Quick Concept Starters:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.name}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 cursor-pointer transition-colors"
                >
                  + {tmpl.name} ({tmpl.category})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. LUMA, NORDEN 04, ZEPHYR"
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Audio Hardware, Fragrance, Luminaire"
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Tagline / Hook
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Precision acoustic architecture."
              className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Physical Geometry & Form Factor
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the exact silhouette, shape, curves, bezels, or proportions..."
              className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Materials
              </label>
              <input
                type="text"
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
                placeholder="e.g. Brushed titanium, frosted acrylic"
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Surface Finish
              </label>
              <input
                type="text"
                value={finish}
                onChange={(e) => setFinish(e.target.value)}
                placeholder="e.g. Fine bead-blasted satin matte"
                className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-zinc-500" />
              Locked Color DNA
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {colors.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-zinc-200 bg-zinc-50 text-xs"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="font-medium text-zinc-800">{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveColor(i)}
                    className="text-zinc-400 hover:text-red-600 ml-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add color inline */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-7 h-7 rounded border border-zinc-300 p-0 cursor-pointer"
              />
              <input
                type="text"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color name (e.g. Copper, Forest)"
                className="px-2.5 py-1 text-xs border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddColor();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddColor}
                className="px-2.5 py-1 text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md cursor-pointer"
              >
                + Add Swatch
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white cursor-pointer shadow-xs disabled:opacity-50 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Imagine Product Across Mediums</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
