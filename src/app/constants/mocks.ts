import { User } from '../models/user.interface';
import { ProjectRequest } from '../models/project.interface';
import { TagRequest } from '../models/tag.interface';
import { Task } from '../models/task.interface';

export const MOCK_USERS_DATA: User[] = [
  { id: '836235', name: 'Carlos', surnames: 'Rodríguez', avatarUrl: 'users/user1.jpg' },
  { id: '455940', name: 'María', surnames: 'López Hernández', avatarUrl: 'users/user2.jpg' },
  { id: '383308', name: 'Andrea', surnames: 'Martínez', avatarUrl: 'users/user3.jpg' },
  { id: '324431', name: 'Javier', surnames: 'Santos Pérez', avatarUrl: 'users/user4.jpg' },
  { id: '719530', name: 'Ana', surnames: 'Ortega', avatarUrl: 'users/user5.jpg' },
  { id: '493598', name: 'Leandro', surnames: 'Zurrik', avatarUrl: 'users/user6.jpg' },
  { id: '688239', name: 'Marc', surnames: 'Dojvik', avatarUrl: 'users/user7.jpg' },
];

export const MOCK_TAGS_DATA: TagRequest[] = [
  { name: 'Prototype', color: 'violet' },
  { name: 'Research', color: 'pink' },
  { name: 'Design', color: 'blue' },
  { name: 'Frontend', color: 'red' },
  { name: 'Backend', color: 'teal' },
  { name: 'Design system', color: 'yellow' },
];

export const MOCK_PROJECTS_DATA: ProjectRequest[] = [
  { name: 'Median', slug: 'median', color: 'pink' },
  { name: 'Risen', slug: 'risen', color: 'blue' },
  { name: 'Strata Insurance', slug: 'strata-insurance', color: 'amber' },
];

export const MOCK_TASKS_DATA: {title: string, description: string}[] = [
  {
    title: "Set up project repository",
    description: "Create the initial Git repository and configure branch protections for the new software project."
  },
  {
    title: "Review API documentation",
    description: "Check the updated API documentation and ensure all endpoints match the current integration requirements."
  },
  {
    title: "Fix login authentication bug",
    description: "Investigate and resolve the issue preventing users from logging in with OAuth providers."
  },
  {
    title: "Design dashboard UI mockups",
    description: "Create initial wireframes and visual mockups for the new analytics dashboard."
  },
  {
    title: "Prepare sprint planning notes",
    description: "Gather requirements, tickets, and effort estimations for the upcoming sprint planning meeting."
  },
  {
    title: "Optimize database queries",
    description: "Analyze slow queries in the reporting module and apply optimizations to improve performance."
  },
  {
    title: "Implement email notifications",
    description: "Add backend logic to send email updates for task status changes and user mentions."
  },
  {
    title: "Set up CI/CD pipeline",
    description: "Configure automated build and deployment pipelines using the company’s CI/CD tools."
  },
  {
    title: "Refactor user profile component",
    description: "Clean up and modularize the user profile frontend code for better maintainability."
  },
  {
    title: "Update internal wiki",
    description: "Document recent changes in the development workflow and update onboarding guides."
  },
  {
    title: "Test payment gateway integration",
    description: "Verify that the new payment provider works correctly across all supported regions."
  },
  {
    title: "Conduct code review",
    description: "Review merge requests from team members and provide technical feedback."
  },
  {
    title: "Migrate legacy endpoints",
    description: "Move deprecated API endpoints to the new microservices architecture."
  },
  {
    title: "Create unit tests for billing",
    description: "Write automated tests for the billing service to improve coverage and reduce regressions."
  },
  {
    title: "Analyze error logs",
    description: "Inspect logs from the production cluster to identify recurring system errors."
  },
  {
    title: "Implement dark mode",
    description: "Add theming support and implement a dark mode option for the web app UI."
  },
  {
    title: "Prepare deployment checklist",
    description: "Compile a detailed checklist for the next major release deployment."
  },
  {
    title: "Research cloud providers",
    description: "Compare available cloud services and propose recommendations for upcoming infrastructure changes."
  },
  {
    title: "Update frontend dependencies",
    description: "Upgrade React and related libraries to the latest stable versions."
  },
  {
    title: "Set up monitoring alerts",
    description: "Configure alerting rules to track CPU usage, memory spikes, and service downtime."
  },
  {
    title: "Implement role-based access",
    description: "Add permissions logic to restrict administrative features to authorized users."
  },
  {
    title: "Fix CSS layout issues",
    description: "Resolve UI misalignment problems reported in the mobile layout testing."
  },
  {
    title: "Review security audit",
    description: "Check the findings from the external security audit and plan remediation steps."
  },
  {
    title: "Write API usage examples",
    description: "Provide sample API request and response examples for third-party developers."
  },
  {
    title: "Set up local dev environment",
    description: "Create a reproducible local environment template for new team members."
  },
  // {
  //   title: "Validate data migration",
  //   description: "Verify that migrated user data matches source values after the last database upgrade."
  // },
  // {
  //   title: "Improve search indexing",
  //   description: "Tune search index settings to deliver faster and more relevant results."
  // },
  // {
  //   title: "Add feature flags system",
  //   description: "Introduce a feature flagging mechanism to roll out new features safely."
  // },
  // {
  //   title: "Document REST conventions",
  //   description: "Define guidelines for naming, versioning, and structuring REST APIs across the company."
  // },
  // {
  //   title: "Run performance benchmarks",
  //   description: "Measure performance before and after optimizations to validate improvements."
  // },
  // {
  //   title: "Fix session timeout issue",
  //   description: "Correct the behavior causing premature user session expiration."
  // },
  // {
  //   title: "Prepare training materials",
  //   description: "Create slides and examples for the team’s upcoming internal training session."
  // },
  // {
  //   title: "Conduct usability testing",
  //   description: "Perform user tests on the new onboarding flow and compile feedback."
  // },
  // {
  //   title: "Implement file uploads",
  //   description: "Add support for uploading project assets with validation and storage."
  // },
  // {
  //   title: "Clean up deprecated code",
  //   description: "Remove old code paths no longer used after recent features went live."
  // },
  // {
  //   title: "Configure Docker images",
  //   description: "Create optimized Docker images for backend and frontend services."
  // },
  // {
  //   title: "Audit npm packages",
  //   description: "Check for vulnerabilities in frontend packages and update insecure versions."
  // },
  // {
  //   title: "Improve onboarding workflow",
  //   description: "Streamline the user onboarding process to reduce drop-off rates."
  // },
  // {
  //   title: "Write integration tests",
  //   description: "Add cross-service integration tests to validate critical workflows."
  // },
  // {
  //   title: "Implement retry logic",
  //   description: "Add retry and fallback mechanisms for unstable external integrations."
  // },
  // {
  //   title: "Analyze cache performance",
  //   description: "Review cache hit ratios and adjust TTL values to improve efficiency."
  // },
  // {
  //   title: "Create design tokens",
  //   description: "Define reusable design tokens for colors, spacing, and typography."
  // },
  // {
  //   title: "Set up feature analytics",
  //   description: "Track usage metrics for new features using the analytics platform."
  // },
  // {
  //   title: "Improve error messages",
  //   description: "Rewrite vague or unclear error messages to help users resolve issues faster."
  // },
  // {
  //   title: "Implement two-factor login",
  //   description: "Add optional two-factor authentication using SMS or authenticator apps."
  // },
  // {
  //   title: "Review pull request workflow",
  //   description: "Assess current PR guidelines and suggest improvements to speed up reviews."
  // },
  // {
  //   title: "Add pagination to lists",
  //   description: "Introduce pagination to large datasets to reduce load times and memory usage."
  // },
  // {
  //   title: "Monitor API rate limits",
  //   description: "Ensure systems remain within third-party API rate limits and add throttling if needed."
  // },
  // {
  //   title: "Update server configs",
  //   description: "Apply updated server configuration templates across all environments."
  // },
  // {
  //   title: "Improve logging format",
  //   description: "Standardize log structures to simplify parsing and reduce noise."
  // }
];
