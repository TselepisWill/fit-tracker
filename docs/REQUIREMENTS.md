# Fit Tracker – Functional Requirements

## Overview
Fit Tracker is a fitness and nutrition tracking app designed to help users manage their health goals. The system supports account management, activity tracking, and personalized recommendations, with additional tools for administrators to manage content and users.

---

## Target Users
- Fitness-focused individuals (users)
- System administrators

---

## Functional Requirements

### 1. Account Management
**Description**: Allow users to create and manage their profiles.

- **FR1.1**: Users can register and log in using email and password.
- **FR1.2**: Users can edit their profile details (name, age, weight, goals).
- **FR1.3**: Users can set fitness goals (e.g., weight loss, muscle gain).

---

### 2. Activity Tracking
**Description**: Enable users to log and monitor physical activity, nutrition, and sleep.

- **FR2.1**: Users can log workout details (type, duration, sets, reps).
- **FR2.2**: Users can input and track daily calorie and macronutrient intake.
- **FR2.3**: System integrates with external APIs or devices to monitor sleep patterns.

---

### 3. Personalized Recommendations
**Description**: Provide AI-driven fitness and nutrition suggestions.

- **FR3.1**: System recommends workouts based on user goals and history.
- **FR3.2**: Users can view personalized diet and training tips.
- **FR3.3**: Users can visualize progress with interactive charts and graphs.

---

### 4. Admin – User Management
**Description**: Admins manage user accounts and monitor system activity.

- **FR4.1**: Admins can view and disable user accounts.
- **FR4.2**: Admins can review and manage flagged content.

---

### 5. Admin – Content Management
**Description**: Admins maintain the quality and relevance of app content.

- **FR5.1**: Admins can add, edit, or delete workout routines.
- **FR5.2**: Admins can approve or reject user-submitted recipes.
- **FR5.3**: Admins can send system-wide notifications (e.g., updates, alerts).

---

## Notes
- All sensitive user information (passwords, health data) must be securely stored using encryption.
- The system should support mobile responsiveness and API integration with third-party fitness trackers or health platforms.
