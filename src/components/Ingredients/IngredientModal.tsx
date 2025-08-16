import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../Common/Dialog';
import { Save, RotateCw } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  getCategories,
  createIngredient,
  updateIngredient,
} from '../../services/ingredients';

import { UNIT_OPTIONS } from '../../assets/assets';
import { Ingredient, IngredientPayload } from '../../models/dish';

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  initialData?: Ingredient | null;
}

const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  initialData = null,
}) => {
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [category, setCategory] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [netUnitValue, setNetUnitValue] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(err => {
        console.error(err);
        toast.error('Không tải được danh mục.');
      });
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUnit(initialData.unit);
      setCategory(initialData.category);
      setPreviewUrl(initialData.image);
      // setNetUnitValue(initialData.net_unit_value);
    } else {
      clearFields();
    }
  }, [initialData, isOpen]);

  const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreviewUrl(e.target.value);
  };

  const clearFields = () => {
    setName('');
    setUnit('');
    setCategory('');
    setPreviewUrl('');
    setNetUnitValue(0);
  };

  const resetFields = () => {
    if (initialData) {
      setName(initialData.name);
      setUnit(initialData.unit);
      setCategory(initialData.category);
      setPreviewUrl(initialData.image);
      // setNetUnitValue(initialData.net_unit_value);
    } else {
      clearFields();
    }
  };

  const handleNetUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (isNaN(value)) value = 0;
    // Clamp between 0 and 1000
    if (value < 0) value = 0;
    if (value > 1000) value = 1000;
    setNetUnitValue(value);
  };

  const save = async () => {
    if (isSaving) return; // chặn double-click
    // validate tối thiểu
    if (!name.trim() || !unit || !category) {
      toast.error('Vui lòng nhập đủ Tên, Đơn vị và Loại.');
      return;
    }
    setIsSaving(true);

    const payload: IngredientPayload = {
      name: name.trim(),
      unit,
      category,
      image: previewUrl,
      // net_unit_value: netUnitValue,
    };

    try {
      if (initialData) {
        await updateIngredient(initialData._id, payload);
        toast.success('Cập nhật nguyên liệu thành công');
      } else {
        await createIngredient(payload);
        toast.success('Thêm nguyên liệu thành công');
      }
      onSaved();
      onClose();
      clearFields();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Sửa nguyên liệu' : 'Thêm nguyên liệu'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">URL ảnh</label>
            <input
              type="url"
              placeholder="Paste image URL..."
              value={previewUrl}
              onChange={handleImageUrlChange}
              className="w-64 mb-4 px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-200"
              disabled={isSaving}
            />
            <div className="w-64 h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl('')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Preview sẽ hiển thị ở đây
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block font-semibold mb-1">Tên</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Enter ingredient name"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Đơn vị</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-200"
                disabled={isSaving}
              >
                <option value="">-- Chọn đơn vị --</option>
                {UNIT_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* <div>
              <label className="block font-semibold mb-1">Trọng lượng tính giá</label>
              <input
                type="number"
                value={netUnitValue}
                onChange={handleNetUnitChange}
                min={0}
                max={1000}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-200"
                placeholder="Nhập giá trị đơn vị (0 - 1000)"
                disabled={isSaving}
              />
            </div> */}

            <div>
              <label className="block font-semibold mb-1">Loại</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-200"
                disabled={isSaving}
              >
                <option value="">-- Chọn loại --</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-auto flex justify-end space-x-3">
              <button
                onClick={resetFields}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
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
                    Lưu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IngredientModal;
