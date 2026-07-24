General
All user-facing content (text, labels, placeholders, validation messages, notifications, etc.) must be written in Persian (Farsi).
The entire UI is RTL (Right-to-Left). Every new page, component, dialog, form, and layout must support RTL correctly.
Keep the project structure consistent. Do not reorganize folders or rename files unless explicitly requested.
Before modifying existing files, always explain what will be changed and ask for confirmation. Never make large edits without approval.
When adding new features, follow the existing coding style and architecture already used in the project.
Frontend
The backend API URL is stored in the .env file. Never hardcode API URLs. Always read them from environment variables.
Reusable UI elements (Button, Input, Textarea, Select, Checkbox, Toggle, Modal, Form components, etc.) must be placed inside the components folder and reused throughout the project.
Avoid duplicate code. Extract repeated logic into reusable hooks, utility functions, or shared components.
Keep components small and focused. If a component becomes too large, split it into smaller components.
Use loading states for every asynchronous operation.
Display user-friendly error messages for failed requests.
Use the Toaster library for notifications.
Show a success toast after successful operations.
Show an error toast after failed operations.
Do not use browser alerts.
Validate all forms before sending data to the backend.
Disable submit buttons while requests are in progress to prevent duplicate submissions.
Use responsive design so pages work properly on desktop, tablet, and mobile devices.
Follow accessibility best practices where possible (labels, keyboard navigation, proper button types, etc.).
Backend Communication
All API requests should go through a centralized API service (Axios/fetch wrapper). Do not duplicate request logic.
Handle network errors gracefully.
Store tokens securely and automatically attach them to authenticated requests.
Never expose secrets, API keys, or sensitive credentials in frontend code.
Code Quality
Write clean, readable, and maintainable code.
Use meaningful variable, function, and component names.
Remove unused imports, variables, and dead code.
Follow ESLint and formatting rules.
Add comments only when they explain complex logic—not for obvious code.
Prefer reusable functions over duplicated logic.
Performance
Avoid unnecessary re-renders.
Lazy load large pages or components when appropriate.
Optimize images and assets.
Keep bundle size as small as possible.
Behavior
If requirements are ambiguous, ask questions before implementing.
If there are multiple possible approaches, briefly explain the pros and cons before choosing one.
If a requested implementation conflicts with existing architecture, explain the issue before making changes.
Do not assume missing backend APIs exist. If an endpoint is missing, mention it instead of inventing one.
Before introducing a new dependency, explain why it is needed and ask for approval.