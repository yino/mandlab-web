// @ts-ignore
import axios from 'axios';

// ================= 类型定义 =================

// 文章相关类型
export interface Article {
  id: string;
  title: string;
  abstract?: string;
  author?: string;
  content?: string;
  html?: string;
  published_at?: string;
  refer_url?: string;
  signature?: string;
  source?: string;
  attachments?: ArticleAttachment[];
}

export interface ArticleAttachment {
  index: number;
  title: string;
  type: string;
  url: string;
}

export interface ArticleListBody {
  article_list?: Article[];
  next_page_token?: string;
}

export interface ArticleBody {
  title: string;
  abstract?: string;
  author?: string;
  content?: string;
  html?: string;
  published_at?: string;
  refer_url?: string;
  signature?: string;
  source?: string;
  attachments?: ArticleAttachment[];
  article_type_label?: string;
}

// 登录相关类型
export interface LoginInputBody {
  phone: string;
  verification_code: string;
  invite_code?: string;
}

export interface LoginOutputBody {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

// 验证码相关类型
export interface CodeInputBody {
  phone: string;
  purpose: 'login' | 'register' | 'reset';
}

export interface CodeOutputBody {
  message: string;
}

// 地区相关类型
export interface ProvinceItem {
  code: string;
  name: string;
}
export interface ProvinceListBody {
  province_list: ProvinceItem[];
}
export interface CityItem {
  code: string;
  name: string;
  province_code: string;
}
export interface CityListBody {
  city_list: CityItem[];
}
export interface AreaItem {
  code: string;
  name: string;
  province_code: string;
  city_code: string;
}
export interface AreaListBody {
  area_list: AreaItem[];
}

// 产业相关类型
export interface IndustryListItem {
  id: string;
  category_lv4: string;
  code: string;
  distribution_areas: string[];
  province_name: string;
  city_name: string;
  area_name: string;
  updated_at: string;
}
export interface IndustryListBody {
  industry_list?: IndustryListItem[];
  next_page_token?: string;
  total: number;
}

// 申请邀请码
export interface ApplyInputBody {
  address: string;
  applicant_name: string;
  business_card_file_id: string;
  company_name: string;
  email: string;
  phone: string;
  position: string;
}

export interface ApplyOutputBody {
  message: string;
  [key: string]: any;
}

export interface UploadFileBody {
  file_id: string;
  msg: string;
  [key: string]: any;
}

export interface UploadFileInput {
  file: File;
  hash?: string;
  purpose?: string;
}

// ================= axios 实例 =================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// ================= API 封装 =================

// 文章
export function getArticles(params?: {
  page_size?: number;
  page_token?: string;
  title?: string;
  start_date?: string;
  end_date?: string;
  type?: string;
  keyword?: string;
}) {
  return api.get<ArticleListBody>('/v1/article', { params });
}

export function getArticle(id: string) {
  return api.get<Article>(`/v1/article/${id}`);
}

export function createArticle(data: ArticleBody) {
  return api.post<Article>('/v1/article', data);
}

// 登录
export function login(data: LoginInputBody) {
  return api.post<LoginOutputBody>('/v1/auth/login', data);
}

// 发送验证码
export function sendCode(data: CodeInputBody) {
  return api.post<CodeOutputBody>('/v1/auth/code', data);
}

// 申请邀请码
export function applyInviteCode(data: ApplyInputBody) {
  return api.post<ApplyOutputBody>('/v1/auth/apply', data);
}

// 地区
export function getProvinces() {
  return api.get<ProvinceListBody>('/v1/common/provinces');
}

export function getCities(params?: { province_code?: string[] }) {
  return api.get<CityListBody>('/v1/common/cities', { params });
}

export function getAreas(params?: { province_codes?: string[]; city_codes?: string[] }) {
  return api.get<AreaListBody>('/v1/common/areas', { params });
}

// 产业
export function getIndustries(params?: {
  page_size?: number;
  page_token?: string;
  start_date?: string;
  end_date?: string;
  province_codes?: string[];
  city_codes?: string[];
  area_codes?: string[];
  codes?: string[];
  category_lv4s?: string[];
  keyword?: string;
}) {
  return api.get<IndustryListBody>('/v1/industry', { params });
}

export function uploadInviteFile(data: UploadFileInput) {
  const formData = new FormData();
  formData.append('file', data.file);
  if (data.hash !== undefined) formData.append('hash', data.hash);
  if (data.purpose !== undefined) formData.append('purpose', data.purpose);
  return api.post<UploadFileBody>('/v1/auth/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// ... 其他接口可按需补充 ...
