export interface DropdownOptions {
    id: string,
    name: string
}

export interface MultiselectDropdown {
  id: string;
  label: string;
  extraLabel?: string;
  avatarUrl?: string;
  color?: string;
}

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}