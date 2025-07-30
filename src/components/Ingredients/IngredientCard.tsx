import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Ingredient } from '../../models/dish';

interface IngredientCardProps {
  ingredient: Ingredient;
  onEdit: (ing: Ingredient) => void;
  onDelete: (id: string) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 flex flex-col justify-between overflow-hidden">
    <img
      src={ingredient.image}
      alt={ingredient.name}
      className="w-full h-28 object-cover rounded-lg mb-4"
    />
    <h3 className="font-semibold text-gray-800 truncate mb-2" title={ingredient.name}>
      {ingredient.name}
    </h3>
    {ingredient.net_unit_value != null && (
      <div className="text-right text-sm text-gray-600 mb-4">
        {ingredient.unit}
      </div>
    )}
    <div className="flex justify-end gap-2">
      <button
        onClick={() => onEdit(ingredient)}
        className="p-2 border border-gray-300 rounded-lg bg-green-50 transition-colors"
        aria-label="Edit Ingredient"
      >
        <Edit className="w-5 h-5 text-green-600" />
      </button>
      <button
        onClick={() => onDelete(ingredient._id)}
        className="p-2 border border-gray-300 rounded-lg bg-red-50 transition-colors"
        aria-label="Delete Ingredient"
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </button>
    </div>
  </div>
);

export default IngredientCard;
