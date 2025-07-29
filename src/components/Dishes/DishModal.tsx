// src/components/Dishes/DishModal.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../Common/Dialog';
import { X, Save, RotateCw } from 'lucide-react';
import type { Dish, Ingredient } from '../../models/models';

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onSaved: () => void;
}

const DishModal: React.FC<DishModalProps> = ({
  isOpen,
  onClose,
  dish,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [newIng, setNewIng] = useState('');
  const [ings, setIngs] = useState<Ingredient[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    // Remove diacritical marks using Unicode range
    setEnglishName(
      name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
    );
  }, [name]);

  useEffect(() => {
    if (isOpen) {
      if (dish) {
        setName(dish.vietnamese_name);
        setNewIng('');
        setIngs(dish.ingredients || []);
        setPreviewUrl(dish.image || '');
        setImageFile(null);
      } else {
        reset();
      }
    }
  }, [isOpen, dish]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const addIng = () => {
    const label = newIng.trim();
    if (label) {
      const newIngredient: Ingredient = {
        category: '',
        image: '',
        ingredient_name: label,
        net_unit_value: 0,
        unit: '',
        vietnamese_name: label,
      };
      setIngs(prev => [...prev, newIngredient]);
      setNewIng('');
    }
  };

  const removeIng = (idx: number) =>
    setIngs(prev => prev.filter((_, i) => i !== idx));

  const reset = () => {
    setName('');
    setEnglishName('');
    setNewIng('');
    setIngs([]);
    setImageFile(null);
    setPreviewUrl('');
  };

  const save = async () => {
    const formData = new FormData();
    formData.append('vietnamese_name', name);
    formData.append('dish', englishName);
    ings.forEach((ing, i) => {
      formData.append(`ingredients[${i}].vietnamese_name`, ing.vietnamese_name);
      formData.append(`ingredients[${i}].net_unit_value`, String(ing.net_unit_value));
      formData.append(`ingredients[${i}].unit`, ing.unit);
    });
    if (imageFile) formData.append('image', imageFile);

    try {
      if (dish) {
        // edit logic here
      } else {
        // add logic here
      }
      onSaved();
      onClose();
      reset();
    } catch (err: any) {
      console.error('Save dish error', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg overflow-hidden">
        <DialogHeader>
          <DialogTitle>{dish ? 'Edit Dish' : 'Add Dish'}</DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[75vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Image + Info */}
          <div className="flex flex-col">
            <div className="relative w-full h-64 bg-gray-200 rounded-xl mb-6 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Click to upload image
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <label className="font-semibold mb-1">Vietnamese Name</label>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              placeholder="Enter dish name..."
              value={name}
              onChange={e => setName(e.target.value)}
            />

            <label className="font-semibold mb-1">English Slug</label>
            <input
              type="text"
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              value={englishName}
              disabled
            />

            <label className="font-semibold mb-1">New Ingredient</label>
            <div className="flex gap-2 items-center mb-4">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Add ingredient..."
                value={newIng}
                onChange={e => setNewIng(e.target.value)}
              />
              <button
                onClick={addIng}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >Add</button>
            </div>
          </div>

          {/* Right: List Ingredients */}
          <div className="flex flex-col border rounded-lg p-4">
            <h3 className="font-bold mb-4">Ingredients List</h3>
            <div className="flex-1 overflow-auto space-y-2">
              {ings.length === 0 ? (
                <p className="italic text-gray-500">No ingredients added.</p>
              ) : (
                ings.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between w-full bg-gray-50 p-2 rounded-lg"
                  >
                    <span className="font-medium truncate flex-1">{ing.vietnamese_name}</span>
                    <span className="font-semibold text-green-600 ml-auto text-right">
                      {ing.unit}
                    </span>
                    <button
                      onClick={() => removeIng(idx)}
                      className="ml-4 p-1 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={reset}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <RotateCw className="w-5 h-5 mr-1" /> Reset
              </button>
              <button
                onClick={save}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                <Save className="w-5 h-5 mr-1" /> Save
              </button>
            </div>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export default DishModal;
