package com.klu.dto;

import java.util.List;

public class OrderDTO {
    private double totalAmount;
    private List<OrderItemDTO> items;

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
