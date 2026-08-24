# Smart Food Connect

Use this image as the primary UI/UX reference. Recreate the visual language, layout, spacing, navigation, cards, typography and color scheme. Do not create a complicated Build a clean, simple and professional college project website called:

SMART FOOD COURT

"Order Smart. Eat Fast."

I have uploaded a reference image showing the exact visual direction and page layouts I want. USE THE UPLOADED IMAGE AS THE PRIMARY UI/UX REFERENCE.

IMPORTANT:

Do NOT copy the image as a single static page.

Build a real, functional multi-page web application based on the screens shown in the reference.

The website should look SIMPLE and EASY TO EXPLAIN to a college professor.

DO NOT add unnecessary features.

DO NOT create complicated animations.

DO NOT add unnecessary dashboards, cards, statistics or technical information to the student-facing pages.

Keep the interface clean and spacious.

==================================================

DESIGN STYLE

==================================================

Follow the uploaded reference image closely for:

- Overall layout

- Page structure

- Navigation

- Spacing

- Card design

- Typography

- Button styles

- Sidebar design

- Colors

- Food card layout

- Tables

- Status indicators

Use:

- White/light background

- Green as the primary action color

- Orange as the brand/accent color

- Dark navy text

- Subtle borders

- Small rounded corners

- Minimal shadows

- Clean modern typography

The design should feel like a modern college food-ordering application, NOT like a complicated enterprise dashboard.

Make the application responsive for desktop and laptop screens.

==================================================

APPLICATION STRUCTURE

==================================================

Create these pages:

1. Login Page

2. Student Home / Dashboard

3. Menu Page

4. Cart / Checkout

5. Order Tracking

6. Stall Dashboard

7. Preparing Orders

8. Admin Dashboard

9. System Monitor

Also create a very simple:

10. P2P Communication page

Do NOT create a complicated WebRTC video/audio page.

==================================================

1. LOGIN PAGE

==================================================

Create a simple centered login card.

Brand:

Smart Food Court

Order Smart. Eat Fast.

Fields:

Username

Password

Button:

Login

For demonstration, provide simple demo accounts:

Student:

student / student123

Pizza Staff:

pizza / pizza123

Burger Staff:

burger / burger123

Admin:

admin / admin123

After login, redirect the user to the appropriate dashboard based on their role.

==================================================

2. STUDENT HOME PAGE

==================================================

Create a clean student dashboard similar to the uploaded reference.

Top navigation/sidebar:

Home

Menu

My Orders

Track Order

Profile

Top right:

Student name

Cart

Main content:

"Hello, Student 👋"

" What would you like to eat today?"

Add a simple food-court banner.

Add:

Search food...

Categories:

Pizza

Burgers

Beverages

Snacks

Desserts

Popular Items:

Margherita Pizza

Cheese Pizza

Veg Burger

Paneer Burger

Cold Coffee

French Fries

Each food card should contain:

Food image

Food name

Stall name

Price

Add button

Keep this page visually simple.

==================================================

3. MENU PAGE

==================================================

Create a clean menu page.

Categories/filter:

All

Pizza

Burgers

Beverages

Snacks

Desserts

Food cards should contain:

Image

Food name

Stall

Price

Availability

Add button

Example food items:

Margherita Pizza – ₹120

Cheese Pizza – ₹150

Veg Burger – ₹80

Paneer Burger – ₹90

Cold Coffee – ₹60

Lemon Iced Tea – ₹50

French Fries – ₹60

Brownie – ₹70

Use realistic food images.

==================================================

4. CART / CHECKOUT

==================================================

Create a simple cart page.

Show:

Item

Stall

Price

Quantity

Total

Example:

Margherita Pizza

Pizza Stall

₹120

Qty 1

Veg Burger

Burger Stall

₹80

Qty 1

Cold Coffee

Beverage Stall

₹60

Qty 1

Total: ₹260

Buttons:

Clear Cart

Proceed to Checkout

When the user checks out, create a real order.

==================================================

5. ORDER TRACKING

==================================================

Create a simple and visually clear order tracking page.

Example:

Order ID: ORD-1001

Overall Status:

Order Placed

↓

Confirmed

↓

Preparing

↓

Ready

↓

Collected

Also show individual stall status:

Pizza Stall     Preparing

Burger Stall    Preparing

Beverage Stall  Ready

The overall order becomes "Ready" only when all required stalls have completed their items.

Keep this page simple.

==================================================

6. STALL DASHBOARD

==================================================

Create a separate dashboard for food stall staff.

Example:

Pizza Stall Dashboard

Show four simple statistics:

New Orders

Preparing

Ready

Completed Today

Below that show:

New Orders

Order ID

Items

Time

Action

Buttons:

Accept

Start Preparing

Mark Ready

Complete

The staff should be able to actually update order status.

When the status changes, the student's order tracking page should also update.

==================================================

7. PREPARING ORDERS PAGE

==================================================

Create a simple table:

Order ID

Items

Time

Action

Example:

ORD-1001-P1 | Margherita Pizza x1 | 11:20 AM | Mark Ready

ORD-1002-P1 | Cheese Pizza x1 | 11:25 AM | Mark Ready

Keep it clean and readable.

==================================================

8. ADMIN DASHBOARD

==================================================

Create a simple admin dashboard.

Show:

Total Orders

Pending Orders

Completed Orders

Today's Revenue

Then show:

Orders Overview

Orders by Stall

Keep charts simple.

Do NOT overload the dashboard with technical information.

==================================================

9. SYSTEM MONITOR

==================================================

This page is specifically for demonstrating the Distributed Systems concept.

Show a simple table:

Service

Type

Address

Status

Latency

Example:

Order Coordinator

Service

localhost:8000

Online

28 ms

Pizza Stall

Service

localhost:8001

Online

32 ms

Burger Stall

Service

localhost:8002

Online

30 ms

Beverage Stall

Service

localhost:8003

Online

35 ms

Message Queue

Service

localhost:6379

Online

10 ms

Database

Database

localhost

Online

12 ms

Use green "Online" badges and red "Offline" badges.

==================================================

10. P2P COMMUNICATION PAGE

==================================================

Create a VERY SIMPLE page.

Title:

P2P Communication

Show:

Pizza Stall  ←→  Burger Stall

Connection:

Connected

Create a simple chat box.

Example:

Pizza Stall:

"Do you have 5 burger buns available?"

Burger Stall:

"Yes, 5 are available."

Input:

Type message...

Send button.

IMPORTANT:

Do NOT create video calls.

Do NOT create camera previews.

Do NOT create codec information.

Do NOT create audio/video streaming dashboards.

The purpose of this page is only to demonstrate simple P2P messaging.

==================================================

IMPORTANT DISTRIBUTED SYSTEM FUNCTIONALITY

==================================================

Although the UI should remain simple, the application should be designed so that the Distributed Systems concepts can be implemented behind the scenes.

The main scenario is:

A student places ONE order containing food from multiple stalls.

Example:

Margherita Pizza → Pizza Stall

Veg Burger → Burger Stall

Cold Coffee → Beverage Stall

The system should:

1. Generate a unique Order ID.

2. Split the order into sub-orders.

3. Send each sub-order to the appropriate stall.

4. Allow stalls to process their orders independently.

5. Combine the stall statuses into one overall order status.

6. Update the student in real time.

Example:

ORD-1001

├── ORD-1001-PIZZA

├── ORD-1001-BURGER

└── ORD-1001-BEVERAGE

==================================================

DISTRIBUTED SYSTEM CONCEPTS

==================================================

Structure the code so we can later implement:

- Distributed architecture

- Client-server architecture

- Middleware

- RPC

- Message-oriented communication

- Stream-oriented communication

- P2P messaging

- WebRTC

- Concurrency

- Synchronization

- Fault tolerance

- Names and identifiers

- Virtualization/Docker

- Distributed multimedia

IMPORTANT:

Do NOT put all these concepts visibly on the student homepage.

The student interface should remain simple.

Technical concepts should be demonstrated through:

- Order distribution

- Stall dashboards

- System Monitor

- P2P Communication

- Order status updates

- Fault simulation later

==================================================

ORDER DISTRIBUTION VISUALIZATION

==================================================

On the admin/system side, create a simple section showing:

Student Order

       ↓

Order Coordinator

       ↓

 ┌─────┼─────┐

 ↓     ↓     ↓

Pizza Burger Beverage

Stall  Stall   Stall

This should be a simple visual representation, not a complicated diagram.

==================================================

NAVIGATION

==================================================

Student navigation:

Home

Menu

My Orders

Track Order

Profile

Staff navigation:

Dashboard

New Orders

Preparing

Ready

Completed

Admin navigation:

Overview

Orders

Stalls

System Monitor

P2P Communication

Keep navigation consistent across pages.

==================================================

TECHNICAL REQUIREMENTS

==================================================

Build this as a real functional application, not a static mockup.

Use a clean component-based architecture.

Create reusable components for:

- Navbar

- Sidebar

- Food Card

- Status Badge

- Order Table

- Dashboard Card

- Buttons

- Modal/Dialog

Use realistic sample data initially.

Keep the code organized and easy to modify.

Do not put everything into one huge component/file.

==================================================

MOST IMPORTANT UI RULE

==================================================

The uploaded reference image is the design reference.

Recreate the same overall visual language and page structure, but make the application cleaner and simpler where appropriate.

The final application should look like a polished but understandable college project.

I should be able to explain every page to my professor in 1–2 sentences.

Do NOT add features just to make the application look impressive.

First prioritize:

1. Clean UI

2. Simple navigation

3. Working ordering

4. Multi-stall order distribution

5. Order tracking

6. Stall management

7. Admin monitoring

After these are working, we will add the Distributed Systems communication mechanisms one by one.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3df4fcb4-4360-4c61-b950-60c02f4de200).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
