export interface AppEvent {
  id: number;
  date: Date;
  time: string;
  title: string;
  category: string;
  location: string;
  desc: string;
  tags: string[];
  image: string;
}

export const MOCK_EVENTS: AppEvent[] = [];
