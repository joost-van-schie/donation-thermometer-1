# Donation Thermometer React App

This project is a donation thermometer application built with React and Tailwind CSS. It displays the total amount of donations received and provides a visual representation of the progress towards a donation goal.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/joost-van-schie/donation-thermometer-1.git
   cd donation-thermometer-1
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

   or

   ```bash
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000` to see the app in action.

## State Management

The app uses React Context for global state management, including donations, totals, and configurations. Configuration data is persisted in `localStorage`.

## Core Components

1. `App` - Main container
2. `Header` & `Footer`
3. `QRCode` - Donation QR display
4. `Thermometer` - With animated fill and markers
5. `DonationList` - Recent donations section
6. `DonationPopup` - Notification when new donation arrives
7. `GoalReachedOverlay` - Celebration screen
8. `ConfettiEffect` - Visual celebration animations
9. `ConfigPanel` - Settings and test controls

## Key Functionality

1. **Donation Processing**
   - Manual test donations
   - API-connected donations
   - Update thermometer and list

2. **API Integration**
   - WordPress/Gravity Forms API connection
   - Authentication
   - Periodic fetching

3. **Responsive Design**
   - Scale entire app to maintain 1920×1080 aspect ratio

4. **Effects & Animations**
   - Thermometer fill animation
   - Confetti displays based on donation size
   - Popups and celebrations

5. **Configuration**
   - API settings
   - Goal amount adjustments
   - Field mappings
   - Refresh intervals

## Custom Hooks

- `useDonations` - Donation management
- `useAPI` - API connection
- `useScale` - Responsive scaling

## Implementation Order

1. Core UI components
2. State management
3. Thermometer visualization
4. Donation handling
5. API connections
6. Animations and effects
7. Configuration panel

## License

This project is licensed under the MIT License.
