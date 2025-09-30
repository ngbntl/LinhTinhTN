export type User = {
  username: string;
  password: string;
};
export type UserResponse = {
  message: string;
  status: string;
  result: User[];
};
export type CategoryMenu = {
  name: string;
  hasSubMenu: boolean;
};
export type CrewResponse<T = null> = {
  code?: number;
  message: string;
  status: string;
  data: T[];
};
export type VisitorTeam = {
  id: number;
  visitor_team_id: number;
  visitor_team_name: string;
  port_name: string;
  port_name_ja: string;
  status: string;
  status_ja: string;
  boarding_date: string;
  row_num: number;
};
// src/components/type.ts
export interface VisitDetails {
  id: number;
  port_name: string;
  port_name_ja: string;
  full_name_jp: string;
  full_name_en: string;
  status: string;
  status_ja: string;
  boarding_date: string;
  scheduled_boarding_time: string;
  scheduled_disembark_time: string;
  company: string;
  barcode: string;
}
export type SelectItemProps = {
  id: number;
  name: string;
  name_ja?: string;
};
export type Role = {
  role_id: number;
};
export type RoleScreensItemProps = {
  screen_id: string;
  role: Role[];
};

export type PaginationItemProps = {
  url: string | null;
  label: string;
  active: boolean;
};
