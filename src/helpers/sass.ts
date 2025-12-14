export const getCurrentTemplate = () => {
  const template = Number(process.env.NEXT_PUBLIC_WEBSITE_TEMPLATE) || 1;

  return template;
};
