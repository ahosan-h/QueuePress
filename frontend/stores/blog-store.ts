import { create } from "zustand";

import { Blog } from "@/types/blog";

type BlogStore = {
  blogs: Blog[];

  loading: boolean;

  selectedBlog: Blog | null;

  setBlogs: (blogs: Blog[]) => void;

  addBlog: (blog: Blog) => void;

  updateBlog: (blog: Blog) => void;

  removeBlog: (id: string) => void;

  setSelectedBlog: (blog: Blog | null) => void;

  setLoading: (loading: boolean) => void;

  reset: () => void;
};

export const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],

  loading: false,

  selectedBlog: null,

  setBlogs: (blogs) =>
    set({
      blogs,
    }),

  addBlog: (blog) =>
    set((state) => ({
      blogs: [blog, ...state.blogs],
    })),

  updateBlog: (updatedBlog) =>
    set((state) => ({
      blogs: state.blogs.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog,
      ),
    })),

  removeBlog: (id) =>
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog._id !== id),
    })),

  setSelectedBlog: (blog) =>
    set({
      selectedBlog: blog,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  reset: () =>
    set({
      blogs: [],
      loading: false,
      selectedBlog: null,
    }),
}));
