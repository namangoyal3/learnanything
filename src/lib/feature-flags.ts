/**
 * Feature Flags for PM Streak
 * 
 * Features behind flags can be enabled/disabled without code changes
 * by setting environment variables.
 */

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  enabledFor: 'all' | 'pro' | 'beta' | 'none';
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  priority_support: {
    id: 'priority_support',
    name: 'Priority Support System',
    description: 'GitHub Issues-based support system with priority labeling for Pro users',
    enabled: process.env.FEATURE_PRIORITY_SUPPORT === 'true',
    enabledFor: process.env.FEATURE_PRIORITY_SUPPORT === 'true' ? 'pro' : 'none'
  },
  learning_roadmap_personalization: {
    id: 'learning_roadmap_personalization',
    name: 'Personalized Learning Roadmap',
    description: 'AI-generated personalized learning paths based on user goals',
    enabled: process.env.FEATURE_LEARNING_ROADMAP === 'true',
    enabledFor: process.env.FEATURE_LEARNING_ROADMAP === 'true' ? 'pro' : 'none'
  },
  deeper_dives_ui: {
    id: 'deeper_dives_ui',
    name: 'Deeper Dives UI Enhancement',
    description: 'Improved UI for Deeper Dives with progress tracking',
    enabled: process.env.FEATURE_DEEPER_DIVES_UI === 'true',
    enabledFor: process.env.FEATURE_DEEPER_DIVES_UI === 'true' ? 'all' : 'none'
  },
  certificate_pdf_generation: {
    id: 'certificate_pdf_generation',
    name: 'PDF Certificate Generation',
    description: 'Generate downloadable PDF certificates for course completion',
    enabled: process.env.FEATURE_CERTIFICATE_PDF === 'true',
    enabledFor: process.env.FEATURE_CERTIFICATE_PDF === 'true' ? 'pro' : 'none'
  }
};

/**
 * Check if a feature is enabled for a user
 */
export function isFeatureEnabled(featureId: string, userPlan?: 'free' | 'pro'): boolean {
  const flag = FEATURE_FLAGS[featureId];
  if (!flag) return false;
  
  if (!flag.enabled) return false;
  
  switch (flag.enabledFor) {
    case 'all':
      return true;
    case 'pro':
      return userPlan === 'pro';
    case 'beta':
      // Beta features enabled for specific users or conditions
      return process.env.BETA_USERS?.split(',').includes(userPlan || '') || false;
    case 'none':
    default:
      return false;
  }
}

/**
 * Get all enabled features for a user
 */
export function getEnabledFeatures(userPlan?: 'free' | 'pro'): FeatureFlag[] {
  return Object.values(FEATURE_FLAGS).filter(flag => 
    isFeatureEnabled(flag.id, userPlan)
  );
}

/**
 * Check if Priority Support should be shown in pricing
 * (Shows as "Coming Soon" when disabled)
 */
export function shouldShowPrioritySupport(): boolean {
  return FEATURE_FLAGS.priority_support.enabled;
}

/**
 * Get feature status for pricing page
 */
export function getFeatureStatus(featureId: string): 'enabled' | 'coming_soon' | 'disabled' {
  const flag = FEATURE_FLAGS[featureId];
  if (!flag) return 'disabled';
  
  if (flag.enabled) return 'enabled';
  
  // Special case: Priority Support shows as "Coming Soon" when disabled
  if (featureId === 'priority_support') return 'coming_soon';
  
  return 'disabled';
}