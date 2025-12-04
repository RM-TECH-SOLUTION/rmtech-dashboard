
const API_BASE_URL = 'https://api.rmtechsolution.com/';


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


let mockPosts = [
  { id: 1, title: 'Getting Started with React CMS', category: 'Technology', author: 'John Doe', date: '2024-01-15', status: 'published', views: '1.2k', content: '<p>Sample content</p>', excerpt: 'Learn how to build a modern CMS', tags: 'react, cms' },
  { id: 2, title: 'Web Development Best Practices', category: 'Development', author: 'Jane Smith', date: '2024-01-14', status: 'draft', views: '890', content: '<p>Sample content</p>', excerpt: 'Best practices for web development', tags: 'web, development' },
];

let mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@rmtechsolution.com', role: 'admin', status: 'active', joined: '2024-01-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@rmtechsolution.com', role: 'editor', status: 'active', joined: '2024-01-02' },
];

let mockMedia = [
  { id: 1, name: 'banner.jpg', type: 'image', url: 'https://via.placeholder.com/400x300', size: '2.4 MB', uploaded: '2024-01-15' },
  { id: 2, name: 'document.pdf', type: 'document', url: '#', size: '1.2 MB', uploaded: '2024-01-14' },
];


export const postsAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockPosts };
  },
  
  getById: async (id) => {
    await delay(300);
    const post = mockPosts.find(p => p.id === parseInt(id));
    return { data: post };
  },
  
  create: async (data) => {
    await delay(500);
    const newPost = {
      id: mockPosts.length + 1,
      ...data,
      date: new Date().toISOString().split('T')[0],
      views: '0',
      author: JSON.parse(localStorage.getItem('user'))?.name || 'Admin'
    };
    mockPosts.unshift(newPost);
    return { data: newPost };
  },
  
  update: async (id, data) => {
    await delay(500);
    const index = mockPosts.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      mockPosts[index] = { ...mockPosts[index], ...data };
    }
    return { data: mockPosts[index] };
  },
  
  delete: async (id) => {
    await delay(300);
    mockPosts = mockPosts.filter(p => p.id !== parseInt(id));
    return { data: { success: true } };
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockUsers };
  },
  
  create: async (data) => {
    await delay(500);
    const newUser = {
      id: mockUsers.length + 1,
      ...data,
      joined: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    mockUsers.push(newUser);
    return { data: newUser };
  },
  
  update: async (id, data) => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === parseInt(id));
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data };
    }
    return { data: mockUsers[index] };
  },
  
  delete: async (id) => {
    await delay(300);
    mockUsers = mockUsers.filter(u => u.id !== parseInt(id));
    return { data: { success: true } };
  }
};

// Media API
export const mediaAPI = {
  getAll: async () => {
    await delay(500);
    return { data: mockMedia };
  },
  
  upload: async (file) => {
    await delay(1000);
    const newMedia = {
      id: mockMedia.length + 1,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: URL.createObjectURL(file),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploaded: new Date().toISOString().split('T')[0]
    };
    mockMedia.unshift(newMedia);
    return { data: newMedia };
  },
  
  delete: async (id) => {
    await delay(300);
    mockMedia = mockMedia.filter(m => m.id !== parseInt(id));
    return { data: { success: true } };
  }
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    await delay(500);
    
    // Mock authentication
    if (email === 'admin@rmtechsolution.com' && password === 'password') {
      const user = {
        id: 1,
        name: 'Admin User',
        email: email,
        role: 'admin',
        token: 'mock-jwt-token-123456'
      };
      return { data: user };
    }
    
    throw new Error('Invalid credentials');
  },
  
  logout: async () => {
    await delay(200);
    return { data: { success: true } };
  }
};

// Add to api.js

// Content Models API
export const contentModelsAPI = {
  getAll: async () => {
    await delay(500);
    const models = localStorage.getItem('contentModels');
    return { data: models ? JSON.parse(models) : [] };
  },
  
  getBySlug: async (slug) => {
    await delay(300);
    const models = localStorage.getItem('contentModels');
    const allModels = models ? JSON.parse(models) : [];
    const model = allModels.find(m => m.slug === slug);
    return { data: model };
  },
  
  create: async (model) => {
    await delay(500);
    const models = localStorage.getItem('contentModels');
    const allModels = models ? JSON.parse(models) : [];
    allModels.push(model);
    localStorage.setItem('contentModels', JSON.stringify(allModels));
    return { data: model };
  },
  
  update: async (id, model) => {
    await delay(500);
    const models = localStorage.getItem('contentModels');
    let allModels = models ? JSON.parse(models) : [];
    allModels = allModels.map(m => m.id === id ? model : m);
    localStorage.setItem('contentModels', JSON.stringify(allModels));
    return { data: model };
  },
  
  delete: async (id) => {
    await delay(300);
    const models = localStorage.getItem('contentModels');
    let allModels = models ? JSON.parse(models) : [];
    allModels = allModels.filter(m => m.id !== id);
    localStorage.setItem('contentModels', JSON.stringify(allModels));
    return { data: { success: true } };
  }
};

// Content Items API
export const contentItemsAPI = {
  getAll: async (modelSlug) => {
    await delay(500);
    const items = localStorage.getItem(`contentItems_${modelSlug}`);
    return { data: items ? JSON.parse(items) : [] };
  },
  
  getById: async (modelSlug, itemId) => {
    await delay(300);
    const items = localStorage.getItem(`contentItems_${modelSlug}`);
    const allItems = items ? JSON.parse(items) : [];
    const item = allItems.find(i => i.id === parseInt(itemId));
    return { data: item };
  },
  
  create: async (modelSlug, item) => {
    await delay(500);
    const items = localStorage.getItem(`contentItems_${modelSlug}`);
    let allItems = items ? JSON.parse(items) : [];
    const newItem = {
      id: Date.now(),
      ...item,
      createdAt: new Date().toISOString()
    };
    allItems.push(newItem);
    localStorage.setItem(`contentItems_${modelSlug}`, JSON.stringify(allItems));
    return { data: newItem };
  },
  
  update: async (modelSlug, itemId, item) => {
    await delay(500);
    const items = localStorage.getItem(`contentItems_${modelSlug}`);
    let allItems = items ? JSON.parse(items) : [];
    allItems = allItems.map(i => 
      i.id === parseInt(itemId) ? { ...i, ...item } : i
    );
    localStorage.setItem(`contentItems_${modelSlug}`, JSON.stringify(allItems));
    return { data: item };
  },
  
  delete: async (modelSlug, itemId) => {
    await delay(300);
    const items = localStorage.getItem(`contentItems_${modelSlug}`);
    let allItems = items ? JSON.parse(items) : [];
    allItems = allItems.filter(i => i.id !== parseInt(itemId));
    localStorage.setItem(`contentItems_${modelSlug}`, JSON.stringify(allItems));
    return { data: { success: true } };
  }
};