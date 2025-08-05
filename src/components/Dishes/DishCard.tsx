import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import type { Dish } from '../../models/dish';

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete?: (dishId: string) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onEdit, onDelete }) => (
  <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 flex flex-col justify-between overflow-hidden">
    {dish.image ? (
      <img
        src={dish.image}
        alt={dish.vietnamese_name}
        className="flex-1 w-full object-cover rounded-md mb-4"
      />
    ) : (
      <div className="flex-1 w-full bg-gray-200 rounded-md mb-4" />
    )}

    {/* Title and Actions on same line */}
    <div className="flex items-center justify-between mb-2">
      <h3
        className="font-semibold truncate pr-2"
        title={dish.vietnamese_name}
      >
        {dish.vietnamese_name}
      </h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onEdit(dish)}
          className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
        >
          <Edit className="w-4 h-4" />
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(dish._id)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default DishCard;
