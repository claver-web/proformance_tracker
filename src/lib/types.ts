export type Topic = {
  id: string;
  title: string;
  isCompleted: boolean;
};

export type Subject = {
  id:string;
  title: string;
  description: string;
  topics: Topic[];
  color: string;
};
