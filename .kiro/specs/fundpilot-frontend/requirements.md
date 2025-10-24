# Requirements Document

## Introduction

FundPilot is a personal investment assistance system that provides real-time fund monitoring, AI market predictions, and trading recommendations. The frontend is a React-based web application built with Vite that offers users a comprehensive dashboard for fund analysis, strategy signals, and portfolio management.

## Glossary

- **FundPilot_System**: The complete fund monitoring and analysis web application
- **Dashboard_Module**: The main overview interface displaying fund summaries and market data
- **Fund_Analysis_Module**: The detailed analysis interface for individual funds
- **Strategy_Module**: The interface displaying AI-generated trading recommendations
- **Notification_Module**: The configuration interface for push notifications
- **Settings_Module**: The system configuration interface
- **User**: Individual investors using the system for fund monitoring
- **Fund_Data**: Real-time and historical fund net asset value information
- **AI_Prediction**: Machine learning generated market forecasts and trading suggestions
- **Technical_Indicator**: Mathematical calculations based on fund price data (MACD, RSI, Moving Averages)

## Requirements

### Requirement 1

**User Story:** As a User, I want to view a comprehensive dashboard of my monitored funds, so that I can quickly assess my portfolio performance and market conditions.

#### Acceptance Criteria

1. WHEN the User accesses the dashboard, THE FundPilot_System SHALL display current market indices with daily percentage changes
2. THE FundPilot_System SHALL render interactive line charts showing fund performance trends with hover tooltips
3. THE FundPilot_System SHALL present AI-generated daily recommendations in card format with confidence scores
4. WHERE multiple funds are selected, THE FundPilot_System SHALL overlay fund performance data on comparative charts
5. THE FundPilot_System SHALL update dashboard data automatically every 5 minutes during market hours

### Requirement 2

**User Story:** As a User, I want to analyze individual funds in detail, so that I can make informed investment decisions based on technical indicators and historical data.

#### Acceptance Criteria

1. WHEN the User searches for a fund, THE Fund_Analysis_Module SHALL provide autocomplete suggestions based on fund codes and names
2. THE Fund_Analysis_Module SHALL display interactive charts with technical indicators including MACD, RSI, and moving averages
3. THE Fund_Analysis_Module SHALL show historical buy/sell signals with explanatory tooltips on chart hover
4. WHERE time range selection is modified, THE Fund_Analysis_Module SHALL dynamically update all chart data and indicators
5. THE Fund_Analysis_Module SHALL calculate and display performance metrics for selected time periods

### Requirement 3

**User Story:** As a User, I want to review AI-generated trading signals and strategies, so that I can evaluate system recommendations before making investment decisions.

#### Acceptance Criteria

1. THE Strategy_Module SHALL display a filterable table of all generated trading signals with date, fund, strategy type, and confidence scores
2. WHEN the User filters signals by date range, THE Strategy_Module SHALL update the display to show only matching records
3. THE Strategy_Module SHALL provide visual indicators for signal types (buy/sell/hold) with color-coded badges
4. WHERE signal confidence is below 60%, THE Strategy_Module SHALL display warning indicators
5. THE Strategy_Module SHALL allow export of signal data in CSV format

### Requirement 4

**User Story:** As a User, I want to configure notification settings, so that I can receive timely alerts about market conditions and trading opportunities.

#### Acceptance Criteria

1. THE Notification_Module SHALL provide configuration options for Server酱, email, and Telegram push notifications
2. WHEN the User enters notification credentials, THE Notification_Module SHALL validate the configuration with a test message
3. THE Notification_Module SHALL allow scheduling of notification frequency and timing preferences
4. THE Notification_Module SHALL save configuration settings and display confirmation messages
5. WHERE notification delivery fails, THE Notification_Module SHALL display error messages with troubleshooting guidance

### Requirement 5

**User Story:** As a User, I want to customize system settings and preferences, so that I can tailor the application to my investment style and preferences.

#### Acceptance Criteria

1. THE Settings_Module SHALL provide theme switching between light and dark modes with immediate visual feedback
2. THE Settings_Module SHALL allow management of API keys for external data sources with masked input fields
3. WHEN the User modifies fund watchlist, THE Settings_Module SHALL update the configuration and refresh dashboard data
4. THE Settings_Module SHALL provide data synchronization options between local and cloud storage
5. THE Settings_Module SHALL display system status indicators for data connectivity and API health

### Requirement 6

**User Story:** As a User, I want the application to be responsive and performant, so that I can access fund information efficiently on both desktop and mobile devices.

#### Acceptance Criteria

1. THE FundPilot_System SHALL render properly on screen sizes from 320px to 1920px width
2. THE FundPilot_System SHALL load initial dashboard data within 3 seconds on standard broadband connections
3. WHEN the User navigates between modules, THE FundPilot_System SHALL complete transitions within 500 milliseconds
4. THE FundPilot_System SHALL maintain smooth scrolling and interactions at 60 frames per second
5. WHERE network connectivity is poor, THE FundPilot_System SHALL display appropriate loading states and error messages