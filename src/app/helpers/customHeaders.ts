export const customHeadersJson = {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API}`,
  },
};

export const customHeadersWwwFromUrlEncoded = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API}`,
  },
};

export const customHeadersMultipart = {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_AI_API}`,
  },
};
