type CustomData = {
  key: string;
  metadata: {
    id: string;
    name: string;
    url: string;
  };
};

export const customData: CustomData[] = [
  {
    key: "google_url",
    metadata: { id: "1", name: "Google", url: "https://google.com" },
  },
  {
    key: "zomato_url",
    metadata: { id: "2", name: "Zomato", url: "https://zomato.com" },
  },
];
