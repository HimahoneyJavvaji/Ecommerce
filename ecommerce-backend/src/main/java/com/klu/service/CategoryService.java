package com.klu.service;

import org.springframework.stereotype.Service;
import com.klu.model.Category;
import com.klu.repository.CategoryRepository;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository repo;

    public CategoryService(CategoryRepository repo) {
        this.repo = repo;
    }

    public List<Category> getAll() {
        return repo.findAll();
    }

    public Category create(Category category) {
        if (repo.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category already exists");
        }
        return repo.save(category);
    }

    public Category update(Long id, Category updated) {
        Category existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        existing.setName(updated.getName());
        return repo.save(existing);
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("Category not found");
        }
        repo.deleteById(id);
    }
}
