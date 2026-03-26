import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiClient } from '../utils/apiClient';

export interface NearbyStoreItem {
  storeId: string;
  storeName: string;
  address: string;
  latitude: number;
  longitude: number;
  distance: number;
  isHot: boolean;
  rank1Count: number;
  rank2Count: number;
  rank3Count: number;
}

export interface NearbyStorePage {
  content: NearbyStoreItem[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export function useNearbyStores() {
  const [data, setData] = useState<NearbyStorePage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchAbortController = useRef<AbortController | null>(null);

  const fetchNearbyStores = useCallback(async (params: {
    lat: number;
    lng: number;
    radius?: number;
    keyword?: string;
    onlyHot?: boolean;
    sort?: 'distance' | 'wins';
    page?: number;
    size?: number;
  }, append: boolean = false) => {
    if (!append && fetchAbortController.current) {
      fetchAbortController.current.abort();
    }
    const controller = new AbortController();
    fetchAbortController.current = controller;

    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      qs.append('lat', params.lat.toString());
      qs.append('lng', params.lng.toString());
      if (params.radius !== undefined) qs.append('radius', params.radius.toString());
      if (params.keyword) qs.append('keyword', params.keyword);
      if (params.onlyHot !== undefined) qs.append('onlyHot', params.onlyHot.toString());
      if (params.sort) qs.append('sort', params.sort);
      if (params.page !== undefined) qs.append('page', params.page.toString());
      if (params.size !== undefined) qs.append('size', params.size.toString());

      const res = await apiClient(`${API_BASE_URL}/api/lotto/stores/nearby?${qs.toString()}`, {
        signal: controller.signal
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        setData(prev => {
          if (append && prev) {
            return {
              ...result.data,
              content: [...prev.content, ...result.data.content]
            };
          }
          return result.data;
        });
      } else {
        setError(result.message || '주변 판매점 정보를 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError('서버 통신 오류가 발생했습니다.');
    } finally {
      if (fetchAbortController.current?.signal.aborted === false) {
        setLoading(false);
      }
    }
  }, []);

  return { data, loading, error, fetchNearbyStores };
}
