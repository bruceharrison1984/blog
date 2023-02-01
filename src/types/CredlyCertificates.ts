export interface CredlyCertificate {
  id: string;
  expires_at_date: any;
  issued_at_date: string;
  issued_to: string;
  locale: string;
  public: boolean;
  state: string;
  translate_metadata: boolean;
  accepted_at: string;
  expires_at: string;
  issued_at: string;
  last_updated_at: string;
  updated_at: string;
  earner_path: string;
  earner_photo_url: string;
  is_private_badge: boolean;
  user_is_earner: boolean;
  issuer: Issuer;
  badge_template: BadgeTemplate;
  image: Image2;
  image_url: string;
  evidence: any[];
  recommendations: any[];
}

export interface Issuer {
  summary: string;
  entities: Entity[];
}

export interface Entity {
  label: string;
  primary: boolean;
  entity: Entity2;
}

export interface Entity2 {
  type: string;
  id: string;
  name: string;
  url: string;
  vanity_url: string;
  internationalize_badge_templates: boolean;
  share_to_ziprecruiter: boolean;
  verified: boolean;
}

export interface BadgeTemplate {
  id: string;
  cost: any;
  description: string;
  global_activity_url: string;
  earn_this_badge_url: any;
  enable_earn_this_badge: boolean;
  enable_detail_attribute_visibility: boolean;
  level: any;
  name: string;
  vanity_slug: string;
  time_to_earn: any;
  type_category: any;
  show_badge_lmi: boolean;
  show_skill_tag_links: boolean;
  translatable: boolean;
  image: Image;
  image_url: string;
  url: string;
  issuer: Issuer2;
  alignments: any[];
  badge_template_activities: BadgeTemplateActivity[];
  endorsements: any[];
  skills: Skill[];
}

export interface Image {
  id: string;
  url: string;
}

export interface Issuer2 {
  summary: string;
  entities: Entity3[];
}

export interface Entity3 {
  label: string;
  primary: boolean;
  entity: Entity4;
}

export interface Entity4 {
  type: string;
  id: string;
  name: string;
  url: string;
  vanity_url: string;
  internationalize_badge_templates: boolean;
  share_to_ziprecruiter: boolean;
  verified: boolean;
}

export interface BadgeTemplateActivity {
  id: string;
  activity_type: string;
  required_badge_template_id: any;
  title: string;
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  vanity_slug: string;
}

export interface Image2 {
  id: string;
  url: string;
}
