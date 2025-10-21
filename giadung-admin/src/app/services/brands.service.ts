// giadung-admin/src/app/services/brands.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Brand } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/brands`;

  /**
   * Lấy tất cả thương hiệu
   */
  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.apiUrl);
  }

  /**
   * Lấy thương hiệu theo ID
   */
  getBrandById(id: number): Observable<Brand> {
    return this.http.get<Brand>(`${this.apiUrl}/${id}`);
  }

  /**
   * Tạo thương hiệu mới
   */
  createBrand(brand: Brand): Observable<Brand> {
    return this.http.post<Brand>(this.apiUrl, brand);
  }

  /**
   * Cập nhật thương hiệu
   */
  updateBrand(id: number, brand: Brand): Observable<Brand> {
    return this.http.put<Brand>(`${this.apiUrl}/${id}`, brand);
  }

  /**
   * Xóa thương hiệu
   */
  deleteBrand(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}