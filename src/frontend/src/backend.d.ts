import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface KPISet {
    aov: number;
    cac: number;
    revenue: number;
    roas: number;
    shippingCost: number;
    conversionRate: number;
    profit: number;
    returnRate: number;
}
export type Time = bigint;
export interface ProductPricing {
    cost: number;
    productId: string;
    price: number;
}
export interface BrandProfile {
    name: string;
    suppliers: Array<SupplierInfo>;
    monthlyGoals: KPISet;
    pricing: Array<ProductPricing>;
    margin: number;
    products: Array<Product>;
    adBudget: number;
    weeklyGoals: KPISet;
}
export interface Campaign {
    id: bigint;
    revenue: number;
    endDate?: Time;
    name: string;
    roas: number;
    platform: Platform;
    spend: number;
    creativeLinks: Array<string>;
    startDate: Time;
}
export interface Task {
    id: bigint;
    status: TaskStatus;
    dueDate?: Time;
    description: string;
    brand?: string;
    priority: Priority;
}
export interface SupplierInfo {
    contact: string;
    name: string;
}
export interface UserProfile {
    name: string;
    role: string;
    email?: string;
}
export interface Product {
    sku: string;
    cost: number;
    name: string;
    category: string;
    margin: number;
    price: number;
}
export enum Platform {
    other = "other",
    meta = "meta",
    google = "google"
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBrand(name: string, profile: BrandProfile): Promise<void>;
    addCampaign(campaign: Campaign): Promise<bigint>;
    addTask(task: Task): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    deleteBrand(name: string): Promise<void>;
    deleteCampaign(id: bigint): Promise<void>;
    deleteTask(id: bigint): Promise<void>;
    generateWeeklySummary(): Promise<string>;
    getBrand(name: string): Promise<BrandProfile | null>;
    getBrandsByMargin(minMargin: number): Promise<Array<BrandProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampaign(id: bigint): Promise<Campaign | null>;
    getCampaignsByPlatform(platform: Platform): Promise<Array<Campaign>>;
    getCampaignsSortedByROAS(): Promise<Array<Campaign>>;
    getTask(id: bigint): Promise<Task | null>;
    getTasksByBrand(brand: string): Promise<Array<Task>>;
    getUpcomingTasks(): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listBrands(): Promise<Array<string>>;
    listCampaigns(): Promise<Array<Campaign>>;
    listTasks(): Promise<Array<Task>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBrand(name: string, profile: BrandProfile): Promise<void>;
    updateCampaign(id: bigint, campaign: Campaign): Promise<void>;
    updateTask(id: bigint, task: Task): Promise<void>;
}
