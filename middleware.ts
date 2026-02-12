import { rewrite } from '@vercel/functions';

const BOT_USER_AGENTS = [
  'WhatsApp',
  'facebookexternalhit',
  'Facebot',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
];

export const config = {
  matcher: ['/intel/(.*)', '/:lang/intel/(.*)'],
};

export default function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = BOT_USER_AGENTS.some(bot => userAgent.includes(bot));

  if (!isBot) {
    return;
  }

  const url = new URL(request.url);
  const match = url.pathname.match(/\/intel\/(.+)$/);

  if (!match) {
    return;
  }

  const slug = match[1];
  const ogMetaUrl = `https://rfkdcmvzvxcsoecoeddi.supabase.co/functions/v1/og-meta?slug=${encodeURIComponent(slug)}`;

  return rewrite(ogMetaUrl);
}
