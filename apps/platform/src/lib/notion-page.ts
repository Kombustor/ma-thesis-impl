import NotionPageToHtml from 'notion-page-to-html';

export const getNotionPageHtml = async (url: string) => {
  const { html } = await NotionPageToHtml.convert(url, {
    excludeCSS: true,
    excludeHeaderFromBody: true,
    bodyContentOnly: true,
    excludeScripts: true,
  });

  return html;
};
