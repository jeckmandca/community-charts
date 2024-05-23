export const tabMap = {
  "0": ["overview", "newsletter"],
  "1": ["pro-research"],
  "2": ["analysis", "public"],
  "3": ["news"]
};

export const articleMap = Object.fromEntries(
  Object.entries(tabMap)
    .map(([tab, articles]) => articles.map(article => [article, tab]))
    .flat()
);

export const defaultArticle = "overview";

export const defaultTab = article2tab(defaultArticle);

export function article2tab(article) {
  return articleMap[article] || "0";
}

export function tab2article(tab) {
  return tabMap[tab] ? tabMap[tab][0] : defaultArticle;
}
