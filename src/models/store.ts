export interface Store {
  store_id: string;
  chain: string;
  store_location: string;
  district: string;
  latitude: number;
  longitude: number;
  store_name: string;
  phone: string;
  province?: string;
  ward?: string;
  imageUrl?: string;
  reviewsCount?: number;
  totalScore?: number;
  province_id?: number;
  district_id?: number;
  ward_id?: number;
}