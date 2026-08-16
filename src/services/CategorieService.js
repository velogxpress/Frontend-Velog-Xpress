import api from "./api";


export const createCategorie = (Categorie) =>
  api.post("/categories", Categorie,);
export const listCategories = (page) =>
  api.get(`/categories?page=${page}&size=9&sort=description,asc`);
export const listCategoriesForSelect = (page) =>
  api.get(`/categories?page=${page}&size=1000&sort=description,asc`);
export const getCategorie = (CategorieId) =>
  api.get(`/categories/category/${CategorieId}`);

  export const getCategorieById = (CategorieId) =>
    api.get(`/categories/categoryByID/${CategorieId}`);

  export const searchCategorie = (CategorieId,page) =>
    api.get(`/categories/search/${CategorieId}?page=${page}&size=9&sort=description,desc`);
   export const getCategorieByPart = (CategorieId,page) =>
    api.get(`/categories/searchbypart/${CategorieId}?page=${page}&size=1000&sort=description,desc`);

export const updateCategorie = (CategorieId, Categorie) =>
  api.put(`/categories/${CategorieId}`, Categorie);
export const deleteCategorie = (CategorieId) =>
  api.delete(`/categories/${CategorieId}`);
