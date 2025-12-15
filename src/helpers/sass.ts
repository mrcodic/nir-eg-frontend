export const getCurrentTemplate = () => {
  const template = Number(process.env.NEXT_PUBLIC_WEBSITE_TEMPLATE) || 1;

  return template;
};

export const getCurrentTemplateColor = () => {
  const color = process.env.NEXT_PUBLIC_TEMPLATE_COLOR || "#012d5a";

  return color;
};
