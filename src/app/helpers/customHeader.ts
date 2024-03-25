export const customHeaders = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API}`,
  },
};
