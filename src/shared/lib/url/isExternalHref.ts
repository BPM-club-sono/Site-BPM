export const isExternalHref = (href: string) => {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:");
};
