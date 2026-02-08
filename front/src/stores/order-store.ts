import { create } from 'zustand';

interface OrderItem {
    caffeineStrength?: "CAFFEINE" | "DECAFFEINE" | "";
    grindLevel?: "WHOLE_BEAN" | "GROUND" | "";
    packaging?: "STICK" | "BULK" | "";
    weight?: string;
    photo?: string;
    quantity?: number;
    price?: number;
    totalPrice?: number;
    deliveryDate?: string; 
    blend_id?: number;
    blend_name?: string;
    collection_id?: number;
    collection_name?: string;
}

interface OrderMeta {
    blend_id?: number;
    blend_name?: string;
    collection_id?: number;
    collection_name?: string;
    price?: number;
}

interface SubscriptionInfo {
    total_cycles?: number;
    first_delivery_date?: string;
}

interface OrderStore {
    order: OrderItem[];
    setOrder: (order: OrderItem[]) => void;
    resetOrder: () => void;
    increaseQuantity: (index: number) => void;
    decreaseQuantity: (index: number) => void;
    removeItem: (index: number) => void;
    currentMeta: OrderMeta;
    setCurrentMeta: (meta: OrderMeta) => void;
    subscriptionInfo: SubscriptionInfo;
    setSubscriptionInfo: (info: SubscriptionInfo) => void;
}

interface OrderImage {
    name: string; 
}

interface OrderImageStore {
    orderImage: OrderImage;
    setOrderImage: (orderImage: OrderImage) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
    order: [],
    setOrder: (order: OrderItem[]) => set({ order }),
    resetOrder: () => set({ order: [] }),
    increaseQuantity: (index: number) => set((state) => ({ order: state.order.map((item, i) => i === index ? { ...item, quantity: item.quantity! + 1 } : item) })),

    // if quantity is 1, then remove the item
    decreaseQuantity: (index: number) => set((state) => {
        const currentItem = state.order[index];
        if (currentItem && currentItem.quantity === 1) {
            // Remove the item if quantity is 1
            return { order: state.order.filter((_, i) => i !== index) };
        } else {
            // Decrease quantity by 1
            return { order: state.order.map((item, i) => i === index ? { ...item, quantity: item.quantity! - 1 } : item) };
        }
    }),
    removeItem: (index: number) => set((state) => ({ order: state.order.filter((item, i) => i !== index) })),
    currentMeta: {},
    setCurrentMeta: (meta: OrderMeta) => set({ currentMeta: meta }),
    subscriptionInfo: {},
    setSubscriptionInfo: (info: SubscriptionInfo) => set({ subscriptionInfo: info }),
}));

export const useOrderImageStore = create<OrderImageStore>((set) => ({
    orderImage: { name: "" },
    setOrderImage: (orderImage: OrderImage) => set({ orderImage }),
}));    