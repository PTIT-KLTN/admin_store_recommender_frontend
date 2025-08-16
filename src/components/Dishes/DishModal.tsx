import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../Common/Dialog';
import { X, Save, RotateCw } from 'lucide-react';
import type { Dish, Dish_Ingredient as DishIngredient } from '../../models/dish';
import type { Ingredient as ServiceIngredient } from '../../models/dish';
import {
  getIngredients as fetchAllIngredients,
  getCategories as fetchIngCategories,
  createIngredient as createNewIngredient,
} from '../../services/ingredients';
import { toast } from 'react-toastify';
import { UNIT_OPTIONS } from '../../assets/assets';
import { createDish, updateDish } from '../../services/dishes';
import { NewDishPayload } from '../../models/dish';

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
  // Dish fields
  const [name, setName] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  // Ingredients currently in dish
  const [ings, setIngs] = useState<DishIngredient[]>([]);

  // Autocomplete and new-ingredient form
  const [allIngredients, setAllIngredients] = useState<ServiceIngredient[]>([]);
  const [suggestions, setSuggestions] = useState<ServiceIngredient[]>([]);
  const [newIng, setNewIng] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState(UNIT_OPTIONS[0]);
  const [newValue, setNewValue] = useState<number | ''>('');
  const [newCategory, setNewCategory] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load on open / edit
  useEffect(() => {
    if (isOpen) {
      if (dish) {
        setName(dish.vietnamese_name);
        setIngs(dish.ingredients || []);
        setPreviewUrl(dish.image || '');
      } else {
        resetAll();
      }
      fetchAllIngredients(0, undefined, 5000)
        .then(res => setAllIngredients(res.ingredients))
        .catch(err => console.error(err));
      fetchIngCategories()
        .then(list => setCategories(list))
        .catch(err => console.error(err));
    }
  }, [isOpen, dish]);

  // Preview image
  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value);
  };

  // Autocomplete suggestions
  useEffect(() => {
    if (newIng.trim()) {
      const q = newIng.toLowerCase();
      setSuggestions(
        allIngredients.filter(ing =>
          ing.name.toLowerCase().includes(q)
        )
      );
      setShowNewForm(false);
    } else {
      setSuggestions([]);
      setShowNewForm(false);
    }
  }, [newIng, allIngredients]);

  const mapToDishIngredient = (ing: ServiceIngredient): DishIngredient => ({
    vietnamese_name: ing.name,
    ingredient_name: ing.name_en,
    // net_unit_value: ing.net_unit_value,
    unit: ing.unit,
    category: ing.category,
    image: ing.image,
  });

  const addExisting = (ing: ServiceIngredient) => {
    setIngs(prev => [...prev, mapToDishIngredient(ing)]);
    setNewIng('');
    setSuggestions([]);
  };

  const handleCreateNew = async () => {
    if (!newName || !newCategory || !newImageUrl) {
      toast.error('Vui lòng điền đủ thông tin mới, bao gồm URL ảnh.');
      return;
    }
    const payload = {
      name: newName,
      unit: newUnit,
      // net_unit_value: typeof newValue === 'number' ? newValue : Number(newValue),
      category: newCategory,
      image: newImageUrl,
    };
    try {
      await createNewIngredient(payload);
      const resp = await fetchAllIngredients(0, undefined, 5000);
      setAllIngredients(resp.ingredients);
      const created = resp.ingredients.find(i => i.name === newName);
      if (created) setIngs(prev => [...prev, mapToDishIngredient(created)]);

      // Reset new ingredient form fields
      setNewName('');
      setNewUnit(UNIT_OPTIONS[0]);
      setNewValue('');
      setNewCategory('');
      setNewImageUrl('');
      setNewIng('');
      setShowNewForm(false);
      toast.success('Tạo nguyên liệu mới thành công!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Lỗi tạo nguyên liệu mới.');
    }
  };

  const removeIng = (idx: number) =>
    setIngs(prev => prev.filter((_, i) => i !== idx));

  const resetAll = () => {
    setName('');
    setPreviewUrl('');
    setIngs([]);
    setNewIng('');
    setShowNewForm(false);
    setNewName('');
    setNewUnit(UNIT_OPTIONS[0]);
    setNewValue('');
    setNewCategory('');
    setNewImageUrl('');
  };

  const handleReset = () => {
    if (dish) {
      setName(dish.vietnamese_name);
      setPreviewUrl(dish.image || '');
      setIngs(dish.ingredients || []);
    } else {
      resetAll();
    }
  };

  const save = async () => {
    if (isSaving) return; // chặn double-click
    // validate tối thiểu
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên món ăn.');
      return;
    }
    setIsSaving(true);

    const payload: NewDishPayload = {
      vietnamese_name: name.trim(),
      image: previewUrl,
      ingredients: ings.map(ing => ({
        vietnamese_name: ing.vietnamese_name,
        ingredient_name: ing.ingredient_name,
        category: ing.category,
        image: ing.image,
        unit: ing.unit,
        // net_unit_value: ing.net_unit_value,
      })),
    };

    try {
      if (dish) {
        await updateDish(dish._id, payload);
        toast.success('Cập nhật món ăn thành công!');
      } else {
        await createDish(payload);
        toast.success('Tạo món ăn thành công!');
      }
      onSaved();
      onClose();
      resetAll();
    } catch (err: any) {
      console.error('Lỗi tạo/cập nhật món ăn:', err?.message);
      toast.error(err?.message || 'Tạo/Cập nhật món ăn thất bại. Vui lòng thử lại sau.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dish ? 'Sửa món ăn' : 'Thêm món ăn'}</DialogTitle>
        </DialogHeader>
        <div className="p-6 max-h-[75vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold mb-1 block">URL ảnh</label>
            <input
              type="url"
              placeholder="Dán ảnh món ăn ở đây ..."
              value={previewUrl}
              onChange={handleImageUrlChange}
              className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              disabled={isSaving}
            />
            <div className="w-full h-64 bg-gray-200 rounded-xl mb-6 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl('')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Preview ảnh sẽ xuất hiện ở đây ...
                </div>
              )}
            </div>

            <label className="font-semibold mb-1">Tên món ăn</label>
            <input
              type="text"
              className="w-full mt-2 mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              placeholder="Nhập tên món ăn ..."
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isSaving}
            />

            <label className="font-semibold mb-1">Thêm nguyên liệu</label>
            <input
              type="text"
              className="w-full mb-2 mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-200"
              placeholder="Tìm kiếm hoặc tạo nguyên liệu ..."
              value={newIng}
              onChange={e => setNewIng(e.target.value)}
              disabled={isSaving}
            />
            {suggestions.length > 0 && (
              <ul className="border rounded-lg max-h-40 overflow-auto bg-white shadow-sm mb-4">
                {suggestions.map(s => (
                  <li
                    key={s._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                    onClick={() => addExisting(s)}
                  >
                    <span>{s.name}</span>
                    <span className="text-gray-500">{s.unit}</span>
                  </li>
                ))}
              </ul>
            )}
            {newIng && (
              <button
                onClick={() => setShowNewForm(true)}
                className="mb-4 text-blue-600 hover:underline"
                disabled={isSaving}
              >
                + Tạo nguyên liệu mới
              </button>
            )}
            {showNewForm && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Tên</label>
                  <input
                    placeholder="Nhập tên nguyên liệu"
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200"
                    disabled={isSaving}
                  />
                </div>
                {/* Image URL */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">URL ảnh</label>
                  <input
                    placeholder="Dán URL hình ảnh nguyên liệu"
                    type="url"
                    value={newImageUrl}
                    onChange={e => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200"
                    disabled={isSaving}
                  />
                </div>
                {/* Unit */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Đơn vị</label>
                  <select
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200"
                    disabled={isSaving}
                  >
                    {UNIT_OPTIONS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                {/* Value */}
                {/* <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Trọng lượng tính</label>
                  <input
                    placeholder="Số lượng trên mỗi đơn vị"
                    type="number"
                    value={newValue}
                    onChange={e => setNewValue(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200"
                    disabled={isSaving}
                  />
                </div> */}
                {/* Category */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">Loại</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2	border border-gray-300 rounded-md focus:ring-2 focus:ring-green-200"
                    disabled={isSaving}
                  >
                    <option value="" disabled>Chọn loại</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                {/* Buttons */}
                <div className="col-span-full flex justify-end space-x-4 mt-4">
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="px-4 py-2	border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNew}
                    className="px-4 py-2	bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    disabled={isSaving}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col border rounded-lg p-4">
            <h3 className="font-bold mb-4">Danh sách nguyên liệu</h3>
            <div className="flex-1 overflow-auto space-y-2">
              {ings.length === 0 ? (
                <p className="italic text-gray-500">Chưa có nguyên liệu nào được thêm vào.</p>
              ) : (
                ings.map((ing, idx) => (
                  <div key={idx} className="flex	items-center bg-white p-2 rounded-lg border">
                    <img src={ing.image} alt={ing.vietnamese_name} className="w-8	h-8 rounded-full mr-3 object-cover" />
                    <div className="flex-1">
                      <p className="font-medium">{ing.vietnamese_name}</p>
                      <p className="text-sm text-gray-500">{ing.unit}</p>
                    </div>
                    <button
                      onClick={() => removeIng(idx)}
                      className="ml-4 p-1 hover:bg-gray-100 rounded-lg transition"
                      disabled={isSaving}
                    >
                      <X className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleReset}
                className="inline-flex	items-center px-4 py-2	border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                disabled={isSaving}
              >
                <RotateCw className="w-5 h-5 mr-1" /> Đặt lại
              </button>
              <button
                onClick={save}
                disabled={isSaving}
                className={`inline-flex items-center px-4 py-2 rounded transition
                  ${isSaving
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'}`}
              >
                {isSaving ? (
                  <>
                    <RotateCw className="w-5 h-5 mr-1 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-1" />
                    Save
                  </>
                )}
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
