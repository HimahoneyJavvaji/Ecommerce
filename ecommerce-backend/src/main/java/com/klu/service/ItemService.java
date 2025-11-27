package com.klu.service;
import com.klu.model.Item;
import com.klu.model.Category;
import com.klu.repository.ItemRepository;
import com.klu.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    private final ItemRepository itemRepo;
    private final CategoryRepository categoryRepo;

    public ItemService(ItemRepository itemRepo, CategoryRepository categoryRepo) {
        this.itemRepo = itemRepo;
        this.categoryRepo = categoryRepo;
    }

    public List<Item> getItemsByCategory(Long categoryId) {
        return itemRepo.findByCategoryId(categoryId);
    }

    public Item addItem(Long categoryId, Item item) {
        Category cat = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        item.setCategory(cat);
        return itemRepo.save(item);
    }

    public Item updateItem(Long id, Item updated) {
        Item existing = itemRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        existing.setImageUrl(updated.getImageUrl());
        existing.setDescription(updated.getDescription());
        return itemRepo.save(existing);
    }

    public void deleteItem(Long id) {
        if (!itemRepo.existsById(id)) {
            throw new IllegalArgumentException("Item not found");
        }
        itemRepo.deleteById(id);
    }
}
