import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
}

export function SEO({
  title = '로또나라 - 행운의 번호 생성기',
  description = '로또 번호를 생성하고 역대 당첨번호와 판매점을 확인하세요. 실시간 통계와 함께 행운의 번호를 찾아보세요!',
  keywords = '로또, 로또번호, 로또생성기, 로또나라, 로또645, 행운번호, 당첨번호, 당첨판매점',
  url = 'https://lotto-kingdom.com',
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook / KakaoTalk */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="로또나라" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      
      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
