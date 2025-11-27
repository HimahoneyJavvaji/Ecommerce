package com.klu.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.klu.config.JwtUtil;
import com.klu.dto.OrderDTO;
import com.klu.dto.OrderItemDTO;
import com.klu.model.Order;
import com.klu.model.OrderItem;
import com.klu.model.User;
import com.klu.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    // Place order
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody OrderDTO orderDTO,
                                        @RequestHeader("Authorization") String authHeader) {

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if(!jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        Long userId = jwtUtil.getUserIdFromJwt(token);
        if(userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cannot extract user from token");
        }

        // Create minimal User object (only id) to link with Order
        User user = new User();
        user.setId(userId);

        // Map OrderDTO -> Order
        Order order = new Order();
        order.setTotalAmount(orderDTO.getTotalAmount());
        order.setUser(user);

        List<OrderItem> items = orderDTO.getItems().stream().map(dto -> {
            OrderItem item = new OrderItem();
            item.setName(dto.getName());
            item.setPrice(dto.getPrice());
            item.setQuantity(dto.getQuantity());
            item.setImageUrl(dto.getImageUrl());
            item.setOrder(order); // link back
            return item;
        }).collect(Collectors.toList());

        order.setItems(items);

        Order savedOrder = orderService.saveOrder(order);
        return ResponseEntity.ok(savedOrder);
    }

    // Get orders for logged-in user
    @GetMapping("/user/me")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateJwtToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        Long userId = jwtUtil.getUserIdFromJwt(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Cannot extract user from token");
        }

        List<Order> orders = orderService.getOrdersByUser(userId);

        if (orders == null || orders.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("No orders found for this user");
        }

        return ResponseEntity.ok(orders);
    }

    // Admin: get all orders
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
