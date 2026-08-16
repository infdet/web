const GENDER_EMOJIS: Record<string, string> = {
  male: '♂️',
  female: '♀️',
  other: '⚧️',
};

interface GenderEmojiProps {
  gender: string | null;
}

export default function GenderEmoji({ gender }: GenderEmojiProps) {
  if (!gender) return null;
  const emoji = GENDER_EMOJIS[gender];
  return emoji ? <>{emoji}</> : null;
}
