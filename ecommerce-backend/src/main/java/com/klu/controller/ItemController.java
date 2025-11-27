package com.klu.controller;

import com.klu.model.Item;
import com.klu.service.ItemService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173")
public class ItemController {

    private final ItemService service;

    public ItemController(ItemService service) {
        this.service = service;
    }

    // ✅ Public - anyone can view items by category
    @GetMapping("/category/{categoryId}")
    public List<Item> getItemsByCategory(@PathVariable Long categoryId) {
        return service.getItemsByCategory(categoryId);
    }

    // ✅ Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{categoryId}")
    public Item addItem(@PathVariable Long categoryId, @RequestBody Item item) {
        return service.addItem(categoryId, item);
    }

    // ✅ Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Item updateItem(@PathVariable Long id, @RequestBody Item item) {
        return service.updateItem(id, item);
    }

    // ✅ Admin only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        service.deleteItem(id);
    }
}
