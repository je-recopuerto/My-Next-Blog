export const optimizeImage = (url: string, width: number = 1920, height: number = 1080) => {
  if (!url) return "";

  const optimizedUrl = url.replace(
    "/upload/",
    `/upload/w_${width},h_${height},q_auto,f_auto,c_fit/`
  );

  return optimizedUrl;
};