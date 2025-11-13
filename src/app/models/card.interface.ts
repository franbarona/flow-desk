export interface Card {
  id: string;
  title: string;
  column: 'backlog' | 'todo' | 'doing' | 'done';
}

export interface DragData {
  cardId: string;
}