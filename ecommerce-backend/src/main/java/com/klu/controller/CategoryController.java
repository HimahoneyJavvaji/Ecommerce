package com.klu.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.klu.dto.CategoryDto;
import com.klu.model.Category;
import com.klu.service.CategoryService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173") // allow React dev server
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    // ✅ Public: anyone can see categories
    @GetMapping
    public List<CategoryDto> getAll() {
        return service.getAll().stream()
                .map(c -> new CategoryDto(c.getId(), c.getName()))
                .collect(Collectors.toList());
    }

    // ✅ Restricted: only ADMIN can create
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<CategoryDto> create(@Valid @RequestBody CategoryDto dto) {
        Category created = service.create(new Category(dto.getName()));
        return new ResponseEntity<>(new CategoryDto(created.getId(), created.getName()), HttpStatus.CREATED);
    }

    // ✅ Restricted: only ADMIN can update
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @Valid @RequestBody CategoryDto dto) {
        Category updated = service.update(id, new Category(dto.getName()));
        return new CategoryDto(updated.getId(), updated.getName());
    }

    // ✅ Restricted: only ADMIN can delete
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
