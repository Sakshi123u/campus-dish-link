import margherita from "@/assets/margherita.jpg";
import cheesePizza from "@/assets/cheese-pizza.jpg";
import vegBurger from "@/assets/veg-burger.jpg";
import paneerBurger from "@/assets/paneer-burger.jpg";
import coldCoffee from "@/assets/cold-coffee.jpg";
import icedTea from "@/assets/iced-tea.jpg";
import fries from "@/assets/fries.jpg";
import brownie from "@/assets/brownie.jpg";
import dosa from "@/assets/dosa.jpg";
import samosa from "@/assets/samosa.jpg";
import pasta from "@/assets/pasta.jpg";
import chocoShake from "@/assets/choco-shake.jpg";
import gulabJamun from "@/assets/gulab-jamun.jpg";
import sandwich from "@/assets/sandwich.jpg";
import masalaChai from "@/assets/masala-chai.jpg";
import iceCream from "@/assets/ice-cream.jpg";

export type StallId = "pizza" | "burger" | "beverage" | "snack" | "dessert";

export type Stall = {
  id: StallId;
  name: string;
  address: string;
};

export const STALLS: Stall[] = [
  { id: "pizza", name: "Pizza Stall", address: "localhost:8001" },
  { id: "burger", name: "Burger Stall", address: "localhost:8002" },
  { id: "beverage", name: "Beverage Stall", address: "localhost:8003" },
  { id: "snack", name: "Snack Corner", address: "localhost:8004" },
  { id: "dessert", name: "Dessert House", address: "localhost:8005" },
];

export const stallName = (id: StallId) =>
  STALLS.find((s) => s.id === id)?.name ?? id;

export type Category = "Pizza" | "Burgers" | "Beverages" | "Snacks" | "Desserts";

export type FoodItem = {
  id: string;
  name: string;
  category: Category;
  stall: StallId;
  price: number;
  image: string;
  available: boolean;
};

export const MENU: FoodItem[] = [
  { id: "f1", name: "Margherita Pizza", category: "Pizza", stall: "pizza", price: 120, image: margherita, available: true },
  { id: "f2", name: "Cheese Pizza", category: "Pizza", stall: "pizza", price: 150, image: cheesePizza, available: true },
  { id: "f3", name: "Veg Burger", category: "Burgers", stall: "burger", price: 80, image: vegBurger, available: true },
  { id: "f4", name: "Paneer Burger", category: "Burgers", stall: "burger", price: 90, image: paneerBurger, available: true },
  { id: "f5", name: "Cold Coffee", category: "Beverages", stall: "beverage", price: 60, image: coldCoffee, available: true },
  { id: "f6", name: "Lemon Iced Tea", category: "Beverages", stall: "beverage", price: 50, image: icedTea, available: true },
  { id: "f7", name: "French Fries", category: "Snacks", stall: "snack", price: 60, image: fries, available: true },
  { id: "f8", name: "Brownie", category: "Desserts", stall: "dessert", price: 70, image: brownie, available: false },
  { id: "f9", name: "Farmhouse Pizza", category: "Pizza", stall: "pizza", price: 180, image: margherita, available: true },
  { id: "f10", name: "Corn Pizza Slice", category: "Pizza", stall: "pizza", price: 70, image: cheesePizza, available: true },
  { id: "f11", name: "Cheese Burger", category: "Burgers", stall: "burger", price: 100, image: vegBurger, available: true },
  { id: "f12", name: "Aloo Tikki Burger", category: "Burgers", stall: "burger", price: 70, image: paneerBurger, available: true },
  { id: "f13", name: "Masala Dosa", category: "Snacks", stall: "snack", price: 90, image: dosa, available: true },
  { id: "f14", name: "Samosa (2 pcs)", category: "Snacks", stall: "snack", price: 40, image: samosa, available: true },
  { id: "f15", name: "Grilled Sandwich", category: "Snacks", stall: "snack", price: 75, image: sandwich, available: true },
  { id: "f16", name: "White Sauce Pasta", category: "Snacks", stall: "snack", price: 110, image: pasta, available: true },
  { id: "f17", name: "Chocolate Shake", category: "Beverages", stall: "beverage", price: 90, image: chocoShake, available: true },
  { id: "f18", name: "Masala Chai", category: "Beverages", stall: "beverage", price: 25, image: masalaChai, available: true },
  { id: "f19", name: "Gulab Jamun", category: "Desserts", stall: "dessert", price: 50, image: gulabJamun, available: true },
  { id: "f20", name: "Choco Ice Cream", category: "Desserts", stall: "dessert", price: 60, image: iceCream, available: true },
];

export const CATEGORIES: Category[] = ["Pizza", "Burgers", "Beverages", "Snacks", "Desserts"];

export type Role = "student" | "staff" | "admin";

export type User = {
  username: string;
  name: string;
  role: Role;
  stall?: StallId;
};

export const DEMO_ACCOUNTS: { username: string; password: string; user: User }[] = [
  { username: "student", password: "student123", user: { username: "student", name: "Student", role: "student" } },
  { username: "pizza", password: "pizza123", user: { username: "pizza", name: "Pizza Staff", role: "staff", stall: "pizza" } },
  { username: "burger", password: "burger123", user: { username: "burger", name: "Burger Staff", role: "staff", stall: "burger" } },
  { username: "admin", password: "admin123", user: { username: "admin", name: "Admin", role: "admin" } },
];

export const SERVICES = [
  { name: "Order Coordinator", type: "Service", address: "localhost:8000", latency: 28 },
  { name: "Pizza Stall", type: "Service", address: "localhost:8001", latency: 32 },
  { name: "Burger Stall", type: "Service", address: "localhost:8002", latency: 30 },
  { name: "Beverage Stall", type: "Service", address: "localhost:8003", latency: 35 },
  { name: "Message Queue", type: "MQ", address: "localhost:6379", latency: 10 },
  { name: "Database", type: "Database", address: "localhost:5432", latency: 12 },
  { name: "WebSocket Server", type: "Service", address: "localhost:7000", latency: 22 },
];
