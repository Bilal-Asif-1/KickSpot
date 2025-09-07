import { create } from 'zustand';

interface UIState {
  // Navigation
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  
  // Modals
  isProductModalOpen: boolean;
  selectedProductId: number | null;
  
  // Loading states
  isGlobalLoading: boolean;
  loadingStates: Record<string, boolean>;
  
  // Toast/Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timeout?: number;
  }>;
  
  // Filters & Search
  searchQuery: string;
  selectedCategory: string;
  priceRange: [number, number];
  sortBy: string;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
}

interface UIActions {
  // Navigation
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  // Modals
  openProductModal: (productId: number) => void;
  closeProductModal: () => void;
  
  // Loading
  setGlobalLoading: (loading: boolean) => void;
  setLoadingState: (key: string, loading: boolean) => void;
  
  // Notifications
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Filters & Search
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSortBy: (sortBy: string) => void;
  clearFilters: () => void;
  
  // Theme
  setTheme: (theme: UIState['theme']) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()((set, get) => ({
  // Initial state
  isMobileMenuOpen: false,
  isSidebarOpen: true,
  isProductModalOpen: false,
  selectedProductId: null,
  isGlobalLoading: false,
  loadingStates: {},
  notifications: [],
  searchQuery: '',
  selectedCategory: '',
  priceRange: [0, 1000],
  sortBy: 'newest',
  theme: 'system',

  // Navigation actions
  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  setMobileMenuOpen: (isOpen: boolean) => {
    set({ isMobileMenuOpen: isOpen });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (isOpen: boolean) => {
    set({ isSidebarOpen: isOpen });
  },

  // Modal actions
  openProductModal: (productId: number) => {
    set({
      isProductModalOpen: true,
      selectedProductId: productId,
    });
  },

  closeProductModal: () => {
    set({
      isProductModalOpen: false,
      selectedProductId: null,
    });
  },

  // Loading actions
  setGlobalLoading: (loading: boolean) => {
    set({ isGlobalLoading: loading });
  },

  setLoadingState: (key: string, loading: boolean) => {
    set((state) => ({
      loadingStates: {
        ...state.loadingStates,
        [key]: loading,
      },
    }));
  },

  // Notification actions
  addNotification: (notification) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after timeout
    if (notification.timeout !== 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.timeout || 5000);
    }
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((notif) => notif.id !== id),
    }));
  },

  clearAllNotifications: () => {
    set({ notifications: [] });
  },

  // Filter actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  setPriceRange: (range: [number, number]) => {
    set({ priceRange: range });
  },

  setSortBy: (sortBy: string) => {
    set({ sortBy });
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedCategory: '',
      priceRange: [0, 1000],
      sortBy: 'newest',
    });
  },

  // Theme actions
  setTheme: (theme: UIState['theme']) => {
    set({ theme });
  },
}));

// Selectors for better performance
export const useNavigation = () => useUIStore((state) => ({
  isMobileMenuOpen: state.isMobileMenuOpen,
  isSidebarOpen: state.isSidebarOpen,
  toggleMobileMenu: state.toggleMobileMenu,
  setMobileMenuOpen: state.setMobileMenuOpen,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
}));

export const useModal = () => useUIStore((state) => ({
  isProductModalOpen: state.isProductModalOpen,
  selectedProductId: state.selectedProductId,
  openProductModal: state.openProductModal,
  closeProductModal: state.closeProductModal,
}));

export const useLoading = () => useUIStore((state) => ({
  isGlobalLoading: state.isGlobalLoading,
  loadingStates: state.loadingStates,
  setGlobalLoading: state.setGlobalLoading,
  setLoadingState: state.setLoadingState,
}));

export const useNotifications = () => useUIStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearAllNotifications: state.clearAllNotifications,
}));

export const useFilters = () => useUIStore((state) => ({
  searchQuery: state.searchQuery,
  selectedCategory: state.selectedCategory,
  priceRange: state.priceRange,
  sortBy: state.sortBy,
  setSearchQuery: state.setSearchQuery,
  setSelectedCategory: state.setSelectedCategory,
  setPriceRange: state.setPriceRange,
  setSortBy: state.setSortBy,
  clearFilters: state.clearFilters,
}));

export const useTheme = () => useUIStore((state) => ({
  theme: state.theme,
  setTheme: state.setTheme,
}));
