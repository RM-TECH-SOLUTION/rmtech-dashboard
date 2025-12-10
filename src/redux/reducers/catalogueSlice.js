
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { catalogueAPI } from '../../services/api';

// export const fetchCatalogueModels = createAsyncThunk(
//   'catalogue/fetchModels',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await catalogueAPI.getModels(params);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchCatalogueItems = createAsyncThunk(
//   'catalogue/fetchItems',
//   async ({ modelId, params }, { rejectWithValue }) => {
//     try {
//       const response = await catalogueAPI.getItems(modelId, params);
//       return { modelId, data: response };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const createCatalogueItem = createAsyncThunk(
//   'catalogue/createItem',
//   async (itemData, { rejectWithValue }) => {
//     try {
//       const response = await catalogueAPI.createItem(itemData);
//       return response;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const updateCatalogueItem = createAsyncThunk(
//   'catalogue/updateItem',
//   async ({ id, itemData }, { rejectWithValue }) => {
//     try {
//       const response = await catalogueAPI.updateItem(id, itemData);
//       return response;
//     } catch (ValueError) {
//       return rejectWithValue(ValueError.message);
//     }
//   }
// );


// const initialState = {
//   models: [],
//   items: {},
//   loading: false,
//   error: null,
//   currentModel: null,
//   currentItem: null,
// };


// const catalogueSlice = createSlice({
//   name: 'catalogue',
//   initialState,
//   reducers: {
//     setCurrentModel: (state, action) => {
//       state.currentModel = action.payload;
//     },
//     setCurrentItem: (state, action) => {
//       state.currentItem = action.payload;
//     },
//     clearCatalogueData: (state) => {
//       state.models = [];
//       state.items = {};
//       state.currentModel = null;
//       state.currentItem = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCatalogueModels.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchCatalogueModels.fulfilled, (state, action) => {
//         state.loading = false;
//         state.models = action.payload.data || [];
//       })
//       .addCase(fetchCatalogueModels.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchCatalogueItems.fulfilled, (state, action) => {
//         const { modelId, data } = action.payload;
//         state.items[modelId] = data.data || [];
//       })
//       .addCase(createCatalogueItem.fulfilled, (state, action) => {
//         const item = action.payload;
//         const modelId = item.modelId;
//         if (state.items[modelId]) {
//           state.items[modelId].unshift(item);
//         }
//       });
//   },
// });

// export const { setCurrentModel, setCurrentItem, clearCatalogueData } = catalogueSlice.actions;
// export default catalogueSlice.reducer;